# 当前项目 Agent 总规则

## 1. 适用范围与规则优先级

本文件是当前 `2.demo` 项目的 Agent 主入口。`../1.basic/todo-app` 是规则抽取的参考工程，本文档及 `specs/` 中的内容只保留可复用的工程约束，不包含参考工程的业务实现。

规则优先级如下：用户当前明确要求 > 本文件中的强制约束 > `specs/` 细则 > 当前实现和配置 > 参考工程中的示例实现。当前实现或配置不能用来推翻明确的工程规则；若确需改变规则，必须先修改规范并说明原因。

## 2. 开发总原则

- 先确认目标、边界、影响范围和验收方式，再修改代码。
- 优先复用既有包、类型、服务和组件；不要重复实现已有能力。
- 保持前端、后端、共享包和基础设施的职责边界，禁止跨层绕过约定。
- 所有新增行为都要有验证：至少完成类型检查、Lint、构建或明确的手动验证。
- 不提交密钥、`.env`、构建产物、缓存、依赖目录或本地数据库数据。
- 变更完成后说明改动文件、验证命令、未验证项和已知风险。

## 3. 不可违反的工程约束

- `AGENTS.md` 和受影响的 `specs/` 是执行规则，不是参考建议。开始编码前必须阅读它们。
- 具有业务意义、需要刷新后保留或需要团队共享的数据，必须走 `services/` -> 后端 API -> 持久化数据库 -> Docker 本地基础设施。
- 禁止使用 `localStorage`、`sessionStorage`、内存数组、前端 mock 或静态 JSON 作为持久化业务数据源。它们只能用于临时 UI 状态、主题偏好或明确标注的演示桩；使用前必须得到用户明确同意。
- 如果需求需要持久化而当前没有后端，必须先创建后端、数据模型、API 和数据库配置，不能为了快速交付绕过架构。
- 页面和组件不得直接访问数据库、底层 HTTP 客户端或持久化存储；必须通过 `hooks/` 和 `services/` 分层访问。
- 新增功能必须先判断数据是否持久化、是否跨端共享、是否需要权限，再决定技术方案。

## 4. 架构基线

默认采用 pnpm workspace + Turborepo Monorepo：`packages/*` 放共享包，`apps/frontend/*` 放前端应用，`apps/backend/*` 放后端应用。共享类型和 UI 能力进入独立包；前端通过 `pages`、`components`、`hooks`、`services`、`types`、`router` 分层；后端统一使用 Next.js App Router，API 放在 `app/api/**/route.ts`，数据库访问和领域服务放在服务端模块中。

后端 API 使用 Next.js Route Handlers、统一路由前缀、明确的认证方案、输入校验、统一异常处理和 API 文档；不同服务实现同一契约时，必须保持接口、鉴权和数据模型一致。

## 5. 必读细则

开始涉及对应范围的工作前，阅读 `specs/` 中的相关文件：

| 范围 | 规范 |
| --- | --- |
| 来源、适用边界 | `specs/00-scope-and-source.md` |
| Monorepo、模块与依赖 | `specs/01-engineering-architecture.md` |
| 前端、后端、包的分层 | `specs/02-layering-and-boundaries.md` |
| TypeScript、Python、格式与命名 | `specs/03-code-standards.md` |
| 构建、开发、质量门禁 | `specs/04-build-and-quality.md` |
| API、数据契约与鉴权 | `specs/05-api-data-security.md` |
| 前端实现细则 | `specs/06-frontend-guidelines.md` |
| 后端实现细则 | `specs/07-backend-guidelines.md` |
| 测试、验证与发布检查 | `specs/08-testing-and-verification.md` |
| Commit、分支与协作 | `specs/09-git-collaboration.md` |

## 6. 常用验证入口

在实际包含该工具链的项目根目录执行：`pnpm install`、`pnpm dev`、`pnpm build`、`pnpm typecheck`、`pnpm lint`、`pnpm spellcheck`。当前 Todo demo 的数据库开发环境使用 `pnpm dev:db`，结束后使用 `pnpm stop:db`。提交前必须通过 `npx lint-staged && pnpm spellcheck && pnpm typecheck`；没有测试脚本时，必须补充接口、页面或构建的手动验证记录。

## 7. Agent 工作流

先阅读本文件和受影响的 `specs/`，再检查现有目录、脚本和状态；明确数据流和持久化方案；确认没有违反不可违反约束后再编码。小步修改；优先使用仓库已有脚本；完成后运行最小充分的质量检查，并报告结果。除非用户明确要求，不修改规则来源工程，也不覆盖其他目录中已有的用户改动。
