#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CONTAINER_NAME="caddy"
IMAGE="caddy:2-alpine"
CADDYFILE="${SCRIPT_DIR}/Caddyfile"
SITE_DIR="${SCRIPT_DIR}/site"
DATA_DIR="${SCRIPT_DIR}/data"
CONFIG_DIR="${SCRIPT_DIR}/config"

usage() {
    cat <<EOF
用法: $0 <命令>

命令:
  pull       拉取最新 Caddy 镜像
  start      首次创建或启动 Caddy
  stop       停止 Caddy
  restart    重启 Caddy
  update     拉取最新镜像并重建容器（数据保留）
  status     查看容器状态
  logs       查看实时日志
  config     检查 Caddyfile 配置

示例:
  $0 start
  $0 status
  $0 logs
EOF
}

require_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        echo "错误：未找到 docker，请先安装并启动 Docker。" >&2
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        echo "错误：Docker 服务未运行，或当前用户没有访问权限。" >&2
        exit 1
    fi
}

container_exists() {
    docker container inspect "${CONTAINER_NAME}" >/dev/null 2>&1
}

container_running() {
    [[ "$(docker inspect -f '{{.State.Running}}' "${CONTAINER_NAME}" 2>/dev/null || true)" == "true" ]]
}

prepare_files() {
    mkdir -p "${DATA_DIR}" "${CONFIG_DIR}"
    if [[ ! -f "${CADDYFILE}" ]]; then
        echo "错误：找不到 ${CADDYFILE}。" >&2
        exit 1
    fi
    if [[ ! -f "${SITE_DIR}/index.html" ]]; then
        echo "错误：找不到 ${SITE_DIR}/index.html。" >&2
        exit 1
    fi
}

create_container() {
    prepare_files
    docker run -d \
        --name "${CONTAINER_NAME}" \
        --restart unless-stopped \
        --publish 80:80 \
        --publish 443:443 \
        --publish 443:443/udp \
        --volume "${CADDYFILE}:/etc/caddy/Caddyfile:ro" \
        --volume "${SITE_DIR}:/srv:ro" \
        --volume "${DATA_DIR}:/data" \
        --volume "${CONFIG_DIR}:/config" \
        "${IMAGE}"
}

start() {
    prepare_files
    if container_exists; then
        if container_running; then
            echo "Caddy 已在运行。"
        else
            docker start "${CONTAINER_NAME}"
            echo "Caddy 已启动。"
        fi
        return
    fi

    if ! docker image inspect "${IMAGE}" >/dev/null 2>&1; then
        docker pull "${IMAGE}"
    fi
    create_container
    echo "Caddy 已创建并启动，访问 http://localhost 查看。"
}

update() {
    prepare_files
    docker pull "${IMAGE}"
    if container_exists; then
        docker rm -f "${CONTAINER_NAME}" >/dev/null
    fi
    create_container
    echo "Caddy 已更新并启动。"
}

main() {
    local command="${1:-}"
    require_docker

    case "${command}" in
        pull)
            docker pull "${IMAGE}"
            ;;
        start)
            start
            ;;
        stop)
            if container_exists; then
                docker stop "${CONTAINER_NAME}"
            else
                echo "Caddy 容器不存在。"
            fi
            ;;
        restart)
            if container_exists; then
                docker restart "${CONTAINER_NAME}"
            else
                start
            fi
            ;;
        update)
            update
            ;;
        status)
            if container_exists; then
                docker ps -a --filter "name=^/${CONTAINER_NAME}$" \
                    --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
            else
                echo "Caddy 容器不存在。"
            fi
            ;;
        logs)
            if container_exists; then
                docker logs -f "${CONTAINER_NAME}"
            else
                echo "Caddy 容器不存在。"
                exit 1
            fi
            ;;
        config)
            prepare_files
            docker run --rm \
                --volume "${CADDYFILE}:/etc/caddy/Caddyfile:ro" \
                "${IMAGE}" caddy validate --config /etc/caddy/Caddyfile
            ;;
        ""|-h|--help|help)
            usage
            ;;
        *)
            echo "错误：未知命令 ${command}" >&2
            usage >&2
            exit 1
            ;;
    esac
}

main "$@"
