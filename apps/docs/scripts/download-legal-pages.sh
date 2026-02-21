#!/bin/bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

echo "Download site notice pages"

curl --fail \
  -H "Accept: application/vnd.github.raw" \
  -H "Authorization: Bearer ${PAT}"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/dicebear/legal/contents/docs/legal/site-notice.md \
  > "${DIR}/../pages/legal/site-notice/index.md"
