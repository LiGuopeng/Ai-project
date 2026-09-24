# Todo List Demo

一个按当前项目工程规范搭建的移动端优先 H5 Todo 应用示例。

## 开始使用

```bash
pnpm dev:db
pnpm install
pnpm dev
```

打开 `http://localhost:5173`，建议使用浏览器移动设备模拟器预览。页面按 H5 场景设计，支持手机窄屏和桌面浏览器预览；任务数据保存在本地 Docker PostgreSQL 中。

## 常用命令

-   `pnpm dev` - 启动 Vite 和 API 开发服务。
-   `pnpm dev:db` - 启动本地 Docker PostgreSQL。
-   `pnpm stop:db` - 停止本地 Docker PostgreSQL。
-   `pnpm build` - 按依赖拓扑构建共享包和前端应用。
-   `pnpm typecheck` - 执行全量 TypeScript 类型检查。
-   `pnpm lint` - 执行 ESLint 和 Prettier 规则检查。
-   `pnpm format` - 格式化源码。

## 目录说明

-   `apps/frontend/web` - Web 应用，按页面、组件、hooks、services、types 分层。
-   `apps/backend/server` - Next.js Todo API，使用 App Router Route Handlers。
-   `packages/core` - Todo 领域类型和数据契约。
-   `packages/react` - 无业务依赖的共享 React UI 组件。

## 本地服务

-   Web：`http://localhost:5173`
-   API：`http://localhost:8080/api`
-   健康检查：`http://localhost:8080/api/health`
-   PostgreSQL：`localhost:5433`，数据库 `todo_list`

首次启动时先执行 `pnpm dev:db`，再执行 `pnpm dev`。数据库表会在 Next.js API 首次访问时自动创建；该方式仅用于本地开发，不作为生产迁移方案。
