# Nest 服务端开发实战

## Nest Config 配置提取

1. env 文件方式
    .env.prod
    .env.test
    .env.dev
2. config 配置注入

## 数据库集成与 ORM

postgres 用的 pg，   驱动模块
redis    用的 redis  驱动

正常业务，不会直接手写 SQL，只关注于业务
程序 Object -> 数据库表


实施步骤
1. 数据库服务编排
2. 写配置
3. 安装 typeorm 和 @nestjs/typeorm pg
4. 注入使用测试


后续推荐直接 prisma

## jwt

passport-local
passport-jwt

local 登录校验用户名和密码
需要验证的接口每次请求携带 bearer token

## 文件上传下载

1. 直接存在服务器

2. 转存到 oss


## 定时任务

bull 队列
schedule

## 自动化文档

swagger
