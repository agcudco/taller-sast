#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SONAR_HOST_URL="${SONAR_HOST_URL:-http://localhost:9000}"
SONAR_TOKEN="${SONAR_TOKEN:-}"

if [ -z "$SONAR_TOKEN" ]; then
  echo "ERROR: SONAR_TOKEN no esta definido."
  echo "  1. Crea el proyecto 'taller-sast' en http://localhost:9000"
  echo "  2. Genera un token en My Account -> Security"
  echo "  3. export SONAR_TOKEN=\"tu_token\""
  exit 1
fi

if ! curl -sf "${SONAR_HOST_URL}/api/system/status" | grep -q '"status":"UP"'; then
  echo "ERROR: SonarQube no esta disponible en ${SONAR_HOST_URL}"
  echo "  Levanta el servidor desde Lab 2 o ejecuta:"
  echo "  docker compose --profile sonarqube up -d"
  exit 1
fi

if ! command -v sonar-scanner >/dev/null 2>&1; then
  echo "ERROR: sonar-scanner no esta instalado."
  echo "  brew install sonar-scanner"
  exit 1
fi

echo "Ejecutando analisis SonarQube Community..."
sonar-scanner \
  -Dsonar.host.url="${SONAR_HOST_URL}" \
  -Dsonar.token="${SONAR_TOKEN}"

echo "Analisis completado: ${SONAR_HOST_URL}/dashboard?id=taller-sast"
