# 构建与质量门禁

## 1. 根级命令

| 命令 | 用途 |
| --- | --- |
| `pnpm install` | 按锁文件安装 workspace 依赖 |
| `pnpm dev` | 并行启动各应用的开发任务 |
| `pnpm build` | 按依赖拓扑构建所有包和应用 |
| `pnpm build:watch` | 监听模式构建共享包 |
| `pnpm typecheck` | 执行全量类型检查 |
| `pnpm lint` | 执行静态检查 |
| `pnpm spellcheck` | 执行拼写检查 |
| `pnpm dev:db` / `pnpm stop:db` | 启停当前 Todo demo 的 PostgreSQL |
| `pnpm clean` | 清理构建产物和缓存 |

具体应用的过滤命令必须写在该应用文档中，不应被提升为通用规则。当前 Todo demo 使用 `pnpm dev:db` 启动 PostgreSQL，使用 `pnpm stop:db` 停止 PostgreSQL。

## 2. Turbo 与构建

新增 workspace 包必须提供与拓扑匹配的 `build`、`dev` 或 `typecheck` 脚本。依赖包先构建，应用再消费构建产物。构建输出放在 `build/` 或 `dist/`，不得提交。

## 3. 提交前门禁

Husky `pre-commit` 的基线为：

```bash
npx lint-staged && pnpm spellcheck && pnpm typecheck
```

`lint-staged` 对源码和文档执行对应的格式化、Lint 或拼写处理。新增测试、构建或部署入口时，应同步加入质量门禁或 PR 检查。

## 4. 本地基础设施

Docker 编排只用于可复现的本地依赖。数据目录、缓存和临时文件必须被 `.gitignore` 忽略。启动失败时先检查容器状态、端口占用、环境变量和连接配置，不要直接删除数据目录。

## 5. 验证原则

文档、配置和纯重构至少运行格式化/Lint；类型变更运行 typecheck；依赖或构建变更运行 build；API 变更运行服务启动和接口冒烟；页面变更运行前端构建并手动验证主要状态。未运行的检查必须在交付说明中明确写出。

持久化功能还必须验证数据经过 API 写入数据库，并在刷新页面、重启前端后仍可读取；只验证页面内存状态不算通过。
