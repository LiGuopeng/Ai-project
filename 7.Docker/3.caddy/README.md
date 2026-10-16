# Caddy Docker 服务

## 启动

在当前目录执行：

```bash
./caddy.sh start
```

首次启动会自动拉取 `caddy:2-alpine` 镜像并创建容器。之后再次执行同一命令即可启动已有容器。

本地网页文件放在 `site/` 目录中，并以只读 Volume 映射到容器的 `/srv`。默认首页是 `site/index.html`，修改本地文件后刷新浏览器即可看到效果。

## 常用命令

```bash
./caddy.sh pull     # 拉取镜像
./caddy.sh status   # 查看状态
./caddy.sh logs     # 查看日志
./caddy.sh restart  # 重启
./caddy.sh stop     # 停止
./caddy.sh update   # 拉取新镜像并重建容器
./caddy.sh config   # 校验 Caddyfile
```

默认映射端口为 `80` 和 `443`，Caddy 的证书数据保存在 `data/`，配置数据保存在 `config/`。

如果 Caddy 容器已经存在，需要执行一次 `update` 让新的 Volume 挂载生效：

```bash
./caddy.sh update
```

启动前请按需修改 `Caddyfile`，将示例站点替换成自己的域名和后端服务。修改配置后执行：

```bash
./caddy.sh config && ./caddy.sh restart
```
