# Git 提交与协作规范

## 1. Commit 格式

遵循 Conventional Commits 和 `cz-git`：

```text
<type>(<scope>): <emoji> <subject>
```

常用类型：`feat` 新功能、`fix` 修复、`docs` 文档、`style` 格式、`refactor` 重构、`perf` 性能、`test` 测试、`build` 构建、`ci` CI、`chore` 杂项、`revert` 回滚。subject 使用简洁祈使句，避免把多个无关主题混在一次提交中。

## 2. Scope

scope 应对应实际 workspace 包或应用；也可使用配置中允许的 `docs`、`project`、`style`、`ci`、`dev`、`deploy`、`other`。新增包后同步检查 Commitlint 的 scope 枚举逻辑。

示例：

```text
feat(web): ✨ add empty state
fix(server): 🐛 enforce resource ownership
docs(project): 📝 update engineering rules
```

## 3. 提交前流程

优先使用项目提供的交互式提交命令。手动提交前执行：

```bash
npx lint-staged
pnpm spellcheck
pnpm typecheck
```

涉及构建、API、部署或数据库时，额外执行对应的 build、启动冒烟或基础设施验证。破坏性变更必须填写 body，并使用 `BREAKING CHANGE:` 说明迁移方式；Issue 关联使用 `fix #123` 或 `re #123`。

## 4. Pull Request

PR 必须说明背景、变更范围、架构或契约影响、验证命令和未验证项；API、UI、数据库或配置变更分别附接口示例、截图/录屏、迁移说明或环境变量说明。保持 PR 单一主题，不提交构建产物、缓存、真实密钥和无关格式化改动。

## 5. Agent 协作

开始工作前查看 `git status`，保留用户已有改动；不要使用破坏性 reset/checkout 覆盖文件。规则来源工程只用于审阅，不应被当前规则整理工作擅自修改。
