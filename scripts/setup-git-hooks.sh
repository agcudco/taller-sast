#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

git config core.hooksPath .husky
chmod +x .husky/pre-commit scripts/sonar-analyze.sh

echo "Git hooks configurados: pre-commit -> analisis SonarQube"
