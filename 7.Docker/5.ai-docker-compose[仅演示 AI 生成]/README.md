# Docker Compose 全栈演示

这是一个用于学习的演示项目：

```text
浏览器
  ↓
Caddy + HTML/React CDN
  ↓ /api
Node.js API
  ├── PostgreSQL
  └── Redis
```

前端页面使用 CDN 加载 React、ReactDOM 和 Babel，不需要在本地安装前端依赖。Node.js、PostgreSQL 和 Redis 使用 Docker Compose 编排。

本示例使用 `docker.m.daocloud.io` 拉取基础镜像，使用 `registry.npmmirror.com` 安装 Node.js 依赖，适合 Docker Hub 访问不稳定的网络环境。

## 一键启动

进入本目录后执行：

```bash
chmod +x start.sh stop.sh
./start.sh dev
```

`dev` 是开发环境，会额外暴露 Node API 的 `3000` 端口；生产环境使用：

```bash
./start.sh prod
```

生产环境只通过 Caddy 暴露前端端口，不直接暴露 API。两个环境使用不同的 Compose 项目名和数据 Volume，互不混用。

首次启动会拉取基础镜像、构建 Node.js API 镜像并创建所有服务。

访问地址：

```text
前端：http://localhost:8080
API：http://localhost:8080/api/hello
健康检查：http://localhost:8080/api/health
```

## 常用命令

```bash
docker compose --env-file .env.dev --project-name ai-demo-dev --file docker-compose.yml --file compose.dev.yml ps
docker compose --env-file .env.dev --project-name ai-demo-dev --file docker-compose.yml --file compose.dev.yml logs -f backend
./stop.sh dev                      # 停止开发环境，保留数据库 Volume
./stop.sh prod                     # 停止生产环境，保留数据库 Volume
docker compose --env-file .env.dev --project-name ai-demo-dev --file docker-compose.yml --file compose.dev.yml down -v
```

## 环境区分

```text
.env.dev       开发环境变量
.env.prod      生产环境变量
compose.dev.yml  开发环境额外配置
compose.prod.yml 生产环境额外配置
```

生产环境部署前请修改 [.env.prod](.env.prod) 中的 `POSTGRES_PASSWORD`，不要在真实项目中使用示例密码，也不要把真实密钥提交到代码仓库。

## 服务说明

| 服务 | 镜像/构建 | 用途 |
| --- | --- | --- |
| `frontend` | `caddy:2-alpine` | 提供静态页面并代理 API |
| `backend` | 本地 `backend/Dockerfile` | Node.js HTTP API |
| `postgres` | `postgres:16-alpine` | PostgreSQL 数据库 |
| `redis` | `redis:7-alpine` | Redis 缓存服务 |

Compose 会创建默认网络。同一网络内可以使用服务名互访：

```text
backend -> postgres:5432
backend -> redis:6379
frontend -> backend:3000
```

不要在容器内使用 `localhost` 访问其他服务，因为 `localhost` 指向当前容器本身。

## 前端 CDN 配置

前端 CDN 引用配置在 [frontend/index.html](frontend/index.html) 中：

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

生产环境可以把 `development` 替换为压缩版，或者改用 jsDelivr 等 CDN。`frontend/Caddyfile` 负责静态文件和 `/api` 反向代理。

## 数据持久化

PostgreSQL 和 Redis 数据分别保存在 Docker Volume：

```text
postgres-data
redis-data
```

普通执行 `docker compose down` 不会删除这些数据。只有执行 `docker compose down -v` 才会删除 Volume，请谨慎使用。
