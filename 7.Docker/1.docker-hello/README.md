# Docker Hello + Caddy 静态网页

`site/` 是宿主机上的网页目录，会以只读 Volume 映射到 Caddy 容器的 `/srv`。默认首页是 [site/index.html](site/index.html)。

## 启动

```bash
cd /Users/liguopeng/Desktop/miaoma/Ai-project/7.Docker/1.docker-hello
./run-caddy-manul.sh
```

访问 http://localhost:8081。

把本地构建好的 HTML、CSS 和 JS 文件放到 `site/` 目录，确保首页文件名为 `index.html`。保存后刷新浏览器即可看到更新，重启容器也会继续使用本地文件。

## 重启

```bash
docker restart heyi-caddy
```

如果修改了 `Caddyfile`，重启容器即可重新加载配置。如果需要重新创建容器并应用启动脚本的挂载配置：

```bash
docker rm -f heyi-caddy
./run-caddy-manul.sh
```
