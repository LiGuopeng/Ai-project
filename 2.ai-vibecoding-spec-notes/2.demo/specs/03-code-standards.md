# 代码规范

## 1. 格式化

以参考工程的 Prettier 配置为默认基线：单引号、无分号、四空格缩进、最大行宽 140、LF 换行、箭头函数省略单参数括号、ES5 尾逗号。当前项目若已有格式化配置，以实际配置为准。

```json
{
    "singleQuote": true,
    "semi": false,
    "tabWidth": 4,
    "printWidth": 140,
    "arrowParens": "avoid",
    "trailingComma": "es5",
    "endOfLine": "lf"
}
```

## 2. TypeScript

默认开启 `strict`、`noUncheckedIndexedAccess`、`noImplicitReturns`、`noFallthroughCasesInSwitch`、`isolatedModules`、声明文件和 sourcemap。客户端额外开启未使用变量检查，使用 bundler 模块解析和 `noEmit`。若关闭严格选项，只能限于明确的兼容场景并说明原因。

禁止无理由使用 `any`、类型断言掩盖错误或忽略未处理的 `undefined`。输入数据先校验再进入业务层；公共 API 类型优先放入共享包。

## 3. ESLint 与导入

使用 ESLint flat config、TypeScript ESLint recommended、Prettier 集成和 import sort。导入顺序为外部依赖在前、相对路径在后。启用框架的 hooks 规则；业务代码禁止遗留 `console`。不能通过扩大 ignore 范围来逃避业务代码问题。

## 4. 命名与文件

- UI 组件及组件文件使用 `PascalCase`。
- 变量、函数和 hooks 使用 `camelCase`；hooks 以 `use` 开头。
- 页面目录使用单数 PascalCase，例如 `pages/Settings`；服务文件使用小写或 camelCase，例如 `services/profile.ts`。
- 服务端模块目录使用小写领域名；类使用 PascalCase，输入模型按项目语言使用 `Dto` 或 `Schema` 后缀。
- CSS class 使用稳定、可读的前缀；共享样式不得污染全局。

## 5. Python 与其他语言

Python 使用四空格缩进、类型注解和独立的输入输出模型。配置、数据库会话、路由、模型和安全逻辑保持目录分离。其他语言遵循该语言的官方格式化工具，并将配置提交到仓库。

## 6. 拼写与版权

领域词统一登记到自定义词典，不要逐文件关闭拼写检查。搬运带版权头的源码时保留原声明，并确认其使用边界。
