# 后端实现规范（Next.js）

## 0. 技术基线

后端使用 Next.js App Router。API 使用 `app/api/**/route.ts` Route Handlers。数据库使用项目配置的 PostgreSQL Docker 服务。

## 1. 模块模式

每个领域或能力模块按以下结构组织，路径以 `apps/backend/<service>/src` 为根：

```text
modules/<domain>/
├── <domain>.module.ts
    ├── <domain>.controller.ts 或 app/api/**/route.ts
├── <domain>.service.ts
├── dto/ 或 schemas/
├── constants.ts
└── guards/ 或 strategies/
```

Controller 只做路由映射、参数接收和访问控制声明；Service 封装业务规则和数据访问；输入模型负责约束；Guard/Strategy 负责认证授权；Entity/Model 放在持久化层。公共过滤器、任务、队列和数据库基础设施放入基础设施层，不复制到每个模块。

Next.js 项目中，Route Handler 承担 Controller 的 HTTP 边界职责；不要在 `route.ts` 中堆积 SQL 和复杂业务规则，统一调用 `src/modules/**` 下的 Service。

## 2. 全局服务约定

Next.js 入口应完成配置加载、Route Handler 输入校验、统一异常处理、跨域策略、路由前缀和 API 文档装配。异常使用项目统一错误结构，由 Route Handler 输出稳定响应。业务代码不得返回不必要的敏感字段、内部实体对象或调试信息。

## 3. 数据访问

持久化模型集中定义主键、索引、关系、创建时间和更新时间。资源查询必须附带权限范围；更新和删除前先确认资源存在且可操作，不存在或无权访问时返回一致的错误。连接、端口和凭证全部来自配置层；生产使用迁移而不是自动同步。

## 4. Next.js 服务模式

数据库连接使用服务端模块并复用开发环境连接池，避免每次热更新创建新连接。`route.ts` 只处理 Request、参数校验、状态码和响应；数据库查询放在 Service；环境变量只在服务端读取。Next.js 页面层不承担 API 数据库职责。

## 5. Python 服务模式

若使用 Python Web 框架，建议将配置、数据库会话、模型、输入输出 schema、路由和安全逻辑分别放入独立模块。路由只负责 HTTP 编排，数据库 session 通过依赖注入并在请求结束后关闭；不同语言的服务必须遵守同一 API 契约。

## 6. 安全边界

凭证和密钥使用安全存储；认证必须校验签名、过期时间和主体有效性；授权必须在服务端执行。日志不得记录密码、token、完整 Authorization header、数据库密码或敏感请求体。
