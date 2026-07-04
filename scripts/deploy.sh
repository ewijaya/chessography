#!/usr/bin/env bash
# Deploy chessography to Cloudflare Pages.
# Credentials are read from /home/ubuntu/.secrets (CLOUDFLARE_API_TOKEN,
# CLOUDFLARE_ACCOUNT_ID) and passed via the environment only — never
# printed, logged, or written into the repo.
set -euo pipefail

set -a
# shellcheck disable=SC1091
source /home/ubuntu/.secrets
set +a

npm run build
npx wrangler pages deploy dist --project-name chessography --commit-dirty=true
