#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

docker run -d \
  --name "heyi-caddy" \
  -p "8081:80" \
  --restart unless-stopped \
  -v "${SCRIPT_DIR}/Caddyfile:/etc/caddy/Caddyfile:ro" \
  -v "${SCRIPT_DIR}/site:/srv:ro" \
  -v caddy_data:/data \
  -v caddy_config:/config \
  "caddy:2"
