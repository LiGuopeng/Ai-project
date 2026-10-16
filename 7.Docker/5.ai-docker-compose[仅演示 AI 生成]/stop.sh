#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

ENVIRONMENT="${1:-dev}"

if [[ "${ENVIRONMENT}" != "dev" && "${ENVIRONMENT}" != "prod" ]]; then
    echo "用法: $0 [dev|prod]" >&2
    exit 1
fi

docker compose \
    --env-file ".env.${ENVIRONMENT}" \
    --project-name "ai-demo-${ENVIRONMENT}" \
    --file docker-compose.yml \
    --file "compose.${ENVIRONMENT}.yml" \
    down
