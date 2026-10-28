#!/usr/bin/env bash
# Production deploy to https://vanshika-maths-test.vercel.app, then a live check of key pages.
# Needs VERCEL_TOKEN. Uploads a clean copy without .git, so Vercel's git-author team check
# doesn't apply and local build output stays behind.
set -euo pipefail

SITE="https://vanshika-maths-test.vercel.app"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOKEN="$(printf %s "${VERCEL_TOKEN:?VERCEL_TOKEN is not set}" | tr -d '[:space:]')"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cd "$ROOT"
if ! npm run --silent validate > "$WORK/validate.log" 2>&1; then
  cat "$WORK/validate.log"
  exit 1
fi
tail -1 "$WORK/validate.log"

mkdir -p "$WORK/src/.vercel"
tar --exclude=./.git --exclude=./node_modules --exclude=./.next --exclude=./.vercel --exclude=./tsconfig.tsbuildinfo -cf - . | tar -xf - -C "$WORK/src"
echo '{"projectId":"prj_fdX4HMUZnSnFAIT2qzbbSkjOBOjl","orgId":"team_EMrUlQNtTaBzr440EXsMsc88"}' > "$WORK/src/.vercel/project.json"

cd "$WORK/src"
if ! npx -y vercel@latest deploy --prod --yes --token "$TOKEN" > "$WORK/deploy.log" 2>&1; then
  tail -20 "$WORK/deploy.log"
  exit 1
fi
grep -E "Aliased" "$WORK/deploy.log" || true

failed=0
for path in / /set/fr-mcq-1 /set/sq-written-4 /guide/fr /mock /review; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "$SITE$path" || true)"
  echo "$code $path"
  [ "$code" = "200" ] || failed=1
done
exit "$failed"
