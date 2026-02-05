#!/usr/bin/env bash
set -euo pipefail

# Script para desplegar en Netlify
# Ejecuta exactamente:
# NETLIFY=1 pnpm run build
# netlify deploy --prod

# Validaciones básicas
if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm no está instalado. Instala pnpm y vuelve a intentar."
  exit 1
fi

if ! command -v netlify >/dev/null 2>&1; then
  echo "Error: Netlify CLI (netlify) no está instalado. Instala netlify-cli y vuelve a intentar."
  exit 1
fi

echo "Ejecutando: NETLIFY=1 pnpm run build"
NETLIFY=1 pnpm run build

echo "Ejecutando: netlify deploy --prod"
netlify deploy --prod
