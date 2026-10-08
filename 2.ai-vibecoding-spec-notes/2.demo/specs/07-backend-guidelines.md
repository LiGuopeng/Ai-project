# 后端实现规范（NestJS、FastAPI、Spring Boot）

## 0. 技术基线

后端使用 NestJS。API 使用 Controller 和装饰器定义路由，模块、服务和 DTO 按领域组织。数据库使用项目配置的 PostgreSQL Docker 服务。

## 1. 模块模式

每个领域或能力模块按以下结构组织，路径以 `apps/backend/<service>/src` 为根：

```text
modules/<domain>/
├── <domain>.module.ts
├── <domain>.controller.ts
├── <domain>.service.ts
├── dto/ 或 schemas/
├── constants.ts
└── guards/ 或 strategies/
```

Controller 只做路由映射、参数接收和访问控制声明；Service 封装业务规则和数据访问；输入模型负责约束；Guard/Strategy 负责认证授权；Entity/Model 放在持久化层。公共过滤器、任务、队列和数据库基础设施放入基础设施层，不复制到每个模块。

NestJS Controller 承担 HTTP 边界职责；不要在 Controller 中堆积 SQL 和复杂业务规则，统一调用 `src/modules/**` 下的 Service。

## 2. 全局服务约定

NestJS 入口应完成配置加载、全局 ValidationPipe、统一异常处理、跨域策略、路由前缀和 API 文档装配。异常使用项目统一错误结构，由 NestJS Exception Filter 输出稳定响应。业务代码不得返回不必要的敏感字段、内部实体对象或调试信息。

## 3. 数据访问

持久化模型集中定义主键、索引、关系、创建时间和更新时间。资源查询必须附带权限范围；更新和删除前先确认资源存在且可操作，不存在或无权访问时返回一致的错误。连接、端口和凭证全部来自配置层；生产使用迁移而不是自动同步。

## 4. NestJS 服务模式

数据库连接使用 NestJS 基础设施模块并复用连接池，避免每次热更新创建新连接。Controller 只处理参数校验、状态码和响应；数据库查询放在 Service 或 Repository；环境变量只在服务端读取。

## 5. FastAPI 服务模式

FastAPI 入口放在 `src/app/main.py`，路由放在模块的 `router.py`，输入输出模型放在 `schemas.py`，业务逻辑放在 `service.py`，SQL 和连接池访问放在 `repository.py` 或数据库基础设施层。使用应用 lifespan 初始化和关闭连接池，使用依赖注入获取 Service；不同语言的服务必须遵守同一 API 契约。

## 6. Spring Boot 服务模式

Spring Boot 入口放在 `src/main/java`，Controller 负责 HTTP 边界，Service 负责业务规则，Repository 负责数据库访问，Request/Response DTO 负责输入输出模型。使用 Bean Validation 校验请求，使用配置文件和环境变量管理连接信息，使用连接池访问 PostgreSQL；生产环境使用迁移工具而不是依赖启动时自动建表。

## 7. 安全边界

凭证和密钥使用安全存储；认证必须校验签名、过期时间和主体有效性；授权必须在服务端执行。日志不得记录密码、token、完整 Authorization header、数据库密码或敏感请求体。
