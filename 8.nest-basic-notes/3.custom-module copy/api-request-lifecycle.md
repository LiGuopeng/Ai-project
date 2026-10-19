# Nest API 业务与请求流程总结

这份文档用于区分 Middleware、Guard、Interceptor、Pipe 和 Filter，重点回答：

> 我想给接口增加一个限制，应该把代码写在哪个 API？

## 一、先记住一条请求链路

```text
客户端请求
  |
  v
Middleware       请求进入 Nest 后最先执行
  |
  v
Guard            判断是否允许访问
  |
  v
Interceptor      Controller 执行前
  |
  v
Pipe             转换和校验参数
  |
  v
Controller       接收请求，调用业务服务
  |
  v
Service          编写具体业务逻辑
  |
  v
Interceptor      Controller 返回后处理响应
  |
  v
Filter           Controller 或其他环节抛出异常后处理
  |
  v
返回响应
```

实际顺序可以简单记成：

```text
Middleware -> Guard -> Interceptor -> Pipe -> Controller -> Service
                                                         |
                                                         v
                              Interceptor <- 返回结果或 Filter 处理异常
```

## 二、到底应该把限制放在哪里

| 需求 | 应该使用 | 例子 |
| --- | --- | --- |
| 每个请求都生成 requestId、记录访问日志 | Middleware | 记录请求方法、URL、状态码、耗时 |
| 判断用户有没有登录、有没有权限 | Guard | 必须携带 Token、管理员才能访问 |
| 参数类型转换和格式校验 | Pipe | `id` 必须是正整数，邮箱格式必须正确 |
| 统一包装响应、统计 Controller 耗时、缓存、超时 | Interceptor | `{ code: 0, data: ... }` |
| 统一处理异常和错误响应格式 | Filter | 把 `400/401/404/500` 转成统一 JSON |
| 查询用户、扣库存、创建订单等具体业务规则 | Service | 用户不存在、库存不足、订单状态流转 |

### 判断口诀

```text
能不能进来？       Guard
参数对不对？       Pipe
进来之前/出去之后？ Interceptor
出了异常怎么办？   Filter
所有请求都要做？   Middleware
真正的业务怎么做？ Service
```

## 三、当前项目中的示例

Controller 的统一前缀是：

```ts
@Controller('guopeng')
```

因此下面的接口都以 `/guopeng` 开头。

### 1. Middleware：所有请求的公共处理

文件：`src/middlewares/request-logger.middleware.ts`

当前在 `src/app.module.ts` 中通过 `forRoutes` 应用到所有 HTTP 请求：

```ts
consumer.apply(RequestLoggerMiddleware).forRoutes({
  path: '*',
  method: RequestMethod.ALL,
});
```

它适合做：

- 生成 `X-Request-Id`
- 记录请求开始和响应结束
- 记录请求方法、URL、状态码、耗时
- 解析 Cookie、请求头等公共信息

它不适合做：

- 判断用户是否有权限
- 校验某个路由参数
- 编写订单、用户等业务逻辑

当前日志示例：

```text
[HTTP-----] GET /guopeng/1?id=1 200 2ms requestId=...
```

### 2. Guard：限制谁可以访问

文件：`src/guards/demo-auth.guard.ts`

使用位置：`src/app.controller.ts` 的 `guard-demo` 路由。

```ts
@UseGuards(DemoAuthGuard)
@Get('guard-demo')
getGuardDemo(): string {
  return 'Guard 校验通过';
}
```

当前规则是必须携带请求头：

```text
x-demo-token: nest-demo
```

测试：

```bash
# 没有 Token，返回 401
curl http://localhost:3000/guopeng/guard-demo

# Token 正确，允许进入 Controller
curl -H "x-demo-token: nest-demo" \
  http://localhost:3000/guopeng/guard-demo
```

以后遇到这些需求，优先考虑 Guard：

- 登录校验
- JWT 校验
- 角色权限校验
- 用户是否可以访问某个资源

Guard 返回 `false` 或抛出异常时，Controller 不会执行。

### 3. Pipe：限制并转换参数

文件：`src/pipes/parse-positive-int.pipe.ts`

使用位置：`pipe-demo` 路由的 `id` 参数。

```ts
@Get('pipe-demo/:id')
getPipeDemo(@Param('id', ParsePositiveIntPipe) id: number): string {
  return `Pipe 转换后的 id: ${id}`;
}
```

测试：

```bash
# 字符串 "12" 会被转换为数字 12
curl http://localhost:3000/guopeng/pipe-demo/12

# abc 不是正整数，返回 400
curl http://localhost:3000/guopeng/pipe-demo/abc
```

Pipe 适合处理：

- `string` 转 `number`
- 必填校验
- DTO 校验
- 日期、枚举、布尔值等格式转换

Pipe 主要关注“参数是否合法”，不负责判断用户权限。

### 4. Interceptor：包裹 Controller 的前后逻辑

文件：`src/interceptors/response-transform.interceptor.ts`

使用位置：`interceptor-demo` 路由。

```ts
@UseInterceptors(ResponseTransformInterceptor)
@Get('interceptor-demo')
getInterceptorDemo(): string {
  return '这是 Controller 返回的数据';
}
```

执行逻辑：

1. Controller 执行前打印日志。
2. 设置 `X-Interceptor` 响应头。
3. 调用 `next.handle()` 执行 Controller。
4. Controller 返回后，用 `map` 包装响应数据。
5. 计算 Controller 的执行耗时。

返回结果类似：

```json
{
  "code": 0,
  "message": "success",
  "data": "这是 Controller 返回的数据",
  "duration": 2
}
```

Interceptor 适合处理：

- 统一响应格式
- 统计 Controller 执行耗时
- 缓存响应
- 设置响应头
- 超时控制
- 对返回结果做转换

### 5. Filter：统一处理异常

文件：`src/filters/http-exception.filter.ts`

在 `src/main.ts` 中注册为全局 Filter：

```ts
app.useGlobalFilters(new HttpExceptionFilter());
```

当前只捕获 `HttpException`：

```ts
@Catch(HttpException)
```

测试接口：

```text
GET /guopeng/filter-demo
```

这个接口主动抛出 `BadRequestException`，Filter 会统一返回：

```json
{
  "statusCode": 400,
  "message": "这是一个异常过滤器示例",
  "path": "/guopeng/filter-demo",
  "timestamp": "..."
}
```

Filter 适合处理：

- 统一错误响应格式
- 记录异常日志
- 隐藏不应该暴露给客户端的错误细节
- 根据异常类型返回不同状态码

## 四、当前接口清单

| 接口 | 用途 | 特殊处理 |
| --- | --- | --- |
| `GET /guopeng` | 返回 Hello World | Middleware |
| `GET /guopeng/1?id=1` | 路由参数和查询参数示例 | Middleware |
| `GET /guopeng/filter-demo` | 主动抛出异常 | Filter |
| `GET /guopeng/pipe-demo/12` | 参数转换示例 | Pipe |
| `GET /guopeng/guard-demo` | Token 权限示例 | Guard |
| `GET /guopeng/interceptor-demo` | 响应包装示例 | Interceptor |
| `POST /guopeng` | 保存数据示例 | Middleware |
| `PUT /guopeng` | 更新数据示例 | Middleware |
| `DELETE /guopeng/deleteHello` | 删除数据示例 | Middleware |

## 五、一个真实业务应该怎么拆

以“创建订单”为例：

```text
POST /orders
  |
  +-- Middleware：生成 requestId，记录请求日志
  |
  +-- Guard：检查用户是否登录，是否有下单权限
  |
  +-- Interceptor：记录接口开始时间，统一包装响应
  |
  +-- Pipe：校验商品 ID、数量、地址格式
  |
  +-- Controller：接收参数，调用 OrderService
  |
  +-- Service：检查库存、计算价格、创建订单
  |
  +-- Filter：库存不足或参数异常时统一返回错误
```

关键点是：

> Guard 只负责“能不能访问”，Pipe 只负责“参数是否正确”，真正的业务判断放在 Service。

例如“用户没有权限下单”属于 Guard；“购买数量必须大于 0”属于 Pipe；“库存不足”属于 Service；“这些错误如何统一返回”属于 Filter。

## 六、作用范围

Nest 中每种能力都可以有不同作用范围：

```text
单个参数：@Param('id', ParsePositiveIntPipe)
单个路由：@UseGuards(...) / @UseInterceptors(...)
整个 Controller：写在 @Controller 上方
整个应用：app.useGlobalGuards(...) / app.useGlobalInterceptors(...)
                         app.useGlobalPipes(...) / app.useGlobalFilters(...)
```

选择原则：

- 只影响一个接口：写在方法上。
- 影响一个 Controller：写在 Controller 类上。
- 所有接口都需要：注册为全局。
- 不要为了一个接口的特殊规则直接改成全局，否则其他接口也会被影响。

## 七、最后的快速判断

当你想“加限制”时，先问自己：

```text
1. 是限制访问身份或权限吗？       -> Guard
2. 是限制参数格式或类型吗？       -> Pipe
3. 是限制所有请求都必须记录吗？   -> Middleware
4. 是限制返回格式或执行时间吗？   -> Interceptor
5. 是限制错误返回格式吗？         -> Filter
6. 是库存、订单、用户等业务规则吗？ -> Service
```
