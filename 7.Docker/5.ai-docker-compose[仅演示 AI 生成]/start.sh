#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

ENVIRONMENT="${1:-dev}"
ENV_FILE=".env.${ENVIRONMENT}"
OVERRIDE_FILE="compose.${ENVIRONMENT}.yml"

if [[ "${ENVIRONMENT}" != "dev" && "${ENVIRONMENT}" != "prod" ]]; then
    echo "用法: $0 [dev|prod]" >&2
    exit 1
fi

set -a
source "${ENV_FILE}"
set +a

docker compose \
    --env-file "${ENV_FILE}" \
    --project-name "ai-demo-${ENVIRONMENT}" \
    --file docker-compose.yml \
    --file "${OVERRIDE_FILE}" \
    up -d --build --remove-orphans

echo ""
echo "${ENVIRONMENT} 环境已启动："
echo "前端：http://localhost:${FRONTEND_PORT:-8080}"
echo "API：http://localhost:${FRONTEND_PORT:-8080}/api/hello"
echo "健康检查：http://localhost:${FRONTEND_PORT:-8080}/api/health"
