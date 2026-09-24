# 工程化架构规范

## 1. Monorepo 基础

默认工具链为 pnpm workspace + Turborepo。workspace 可按以下职责划分：

```yaml
packages:
  - "packages/*"
  - "apps/frontend/*"
  - "apps/backend/*"
```

根级任务交由 Turbo 调度。`build` 应先构建依赖再构建自身；开发、监听和类型检查任务按需关闭缓存并保持常驻；缓存目录不得提交。

## 2. 通用拓扑

| 路径 | 职责 |
| --- | --- |
| `apps/frontend/<app>` | 面向用户或其他客户端的前端应用 |
| `apps/backend/<service>` | NestJS API 服务和后台任务 |
| `packages/<package>` | 可复用的类型、领域能力、UI 或基础设施包 |
| `specs/` | 工程规则、架构决策和验证约束 |

新增应用放入 `apps`，可复用能力放入 `packages`。业务实现不得复制到共享包；共享包不得反向依赖具体应用。

涉及持久化业务数据的功能必须同时具备前端应用、NestJS 后端服务、数据实体/模型、API 契约和本地 Docker 数据库链路。后端尚不存在时，应作为同一功能的一部分创建，不得用 `localStorage` 或前端内存替代。

后端技术基线为 NestJS：入口位于 `src/main.ts`，模块位于 `src/modules`，Controller 负责 HTTP 边界，Service 负责业务逻辑，数据库连接放在 `src/database` 或等价基础设施目录。

## 3. 依赖管理

- 包间依赖统一使用 `workspace:*`，由 workspace 链接。
- 关键依赖使用精确版本，修改依赖时同步更新锁文件。
- 每个包声明自己的脚本、入口和 TypeScript 配置。
- 共享包通过单一公开入口导出，消费者不得引用包内私有路径。
- 库包使用统一构建工具生成 ESM、声明文件和 sourcemap；样式独立导出时声明副作用。

## 4. 配置与环境

环境变量只通过 `.env.example` 声明，不提交真实 `.env`。端口、数据库、外部服务和运行模式都必须可配置。配置变更时同步更新示例环境变量、启动文档、部署配置和验证步骤。

## 5. 部署基线

生产构建产物由容器或进程管理器托管，数据库、应用和日志统一使用明确的时区。生产必须使用独立密钥、显式跨域策略、迁移机制和最小权限账号。
