#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
AUTH_EMAIL="${AUTH_EMAIL:-test@contaai.com}"
AUTH_PASSWORD="${AUTH_PASSWORD:-test123456}"
COOKIE_JAR="/tmp/contaai-cookies.txt"

GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
section() { echo -e "\n${CYAN}━━━ $1 ━━━${NC}"; }

is_json() {
  echo "$1" | python3 -c "import sys,json; json.load(sys.stdin)" 2>/dev/null
}

has_error() {
  echo "$1" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('error') else 1)" 2>/dev/null
}

get_field() {
  echo "$1" | python3 -c "import sys,json; print(json.load(sys.stdin).get('$2',''))" 2>/dev/null || echo ""
}

# Login
login() {
  section "Login"
  local res
  res=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{ \"email\": \"$AUTH_EMAIL\", \"password\": \"$AUTH_PASSWORD\" }" \
    -c "$COOKIE_JAR")
  if has_error "$res"; then
    fail "Login falhou: $(get_field "$res" 'message')"
    exit 1
  fi
  pass "Autenticado como $AUTH_EMAIL"
}

# 2.1 GET /api/user/books
test_list_books() {
  section "2.1 GET /api/user/books"
  local res
  res=$(curl -s -b "$COOKIE_JAR" "$BASE_URL/api/user/books")

  if has_error "$res"; then
    fail "$(get_field "$res" 'message')"
    return
  fi

  local count
  count=$(echo "$res" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
  pass "Retornou $count livro(s)"
}

# 2.2 POST /api/user/books
test_create_book() {
  section "2.2 POST /api/user/books"
  local res
  res=$(curl -s -X POST "$BASE_URL/api/user/books" \
    -b "$COOKIE_JAR" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Meu Livro de Teste",
      "author": "Autor Teste",
      "category": "Fantasia",
      "coverColor": "#8B4513"
    }')

  if has_error "$res"; then
    fail "$(get_field "$res" 'message')"
    BOOK_ID=""
    return
  fi

  BOOK_ID=$(get_field "$res" 'id')
  pass "Livro criado com ID: $BOOK_ID"
}

# 2.3 POST /api/user/books/cover
test_upload_cover() {
  section "2.3 POST /api/user/books/cover"
  if [ -z "${BOOK_ID:-}" ]; then
    fail "Sem book_id, pulando"
    return
  fi

  local png_base64
  png_base64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

  local res
  res=$(curl -s -X POST "$BASE_URL/api/user/books/cover" \
    -b "$COOKIE_JAR" \
    -H "Content-Type: application/json" \
    -d "{
      \"bookId\": \"$BOOK_ID\",
      \"file\": {
        \"data\": \"$png_base64\",
        \"type\": \"image/png\",
        \"name\": \"cover.png\"
      }
    }")

  if has_error "$res"; then
    fail "$(get_field "$res" 'message')"
    return
  fi

  local url
  url=$(get_field "$res" 'url')
  if [[ "$url" == http* ]]; then
    pass "Capa enviada: $url"
  else
    fail "URL inválida retornada"
  fi
}

# 2.4 DELETE /api/user/books/[id]
test_delete_book() {
  section "2.4 DELETE /api/user/books/[id]"
  if [ -z "${BOOK_ID:-}" ]; then
    fail "Sem book_id, pulando"
    return
  fi

  local res
  res=$(curl -s -X DELETE "$BASE_URL/api/user/books/$BOOK_ID" \
    -b "$COOKIE_JAR")

  if has_error "$res"; then
    fail "$(get_field "$res" 'message')"
    return
  fi

  local success
  success=$(get_field "$res" 'success')
  if [ "$success" = "True" ]; then
    pass "Livro deletado com sucesso"
  else
    fail "Resposta inesperada: $res"
  fi
}

# 2.5 GET /api/user/stats
test_user_stats() {
  section "2.5 GET /api/user/stats"
  local res
  res=$(curl -s -b "$COOKIE_JAR" "$BASE_URL/api/user/stats")

  if has_error "$res"; then
    fail "$(get_field "$res" 'message')"
    return
  fi

  local tb pb
  tb=$(get_field "$res" 'totalBooks')
  pb=$(get_field "$res" 'publishedBooks')
  pass "Métricas do usuário — total: $tb, publicados: $pb"
}

# 2.6 GET /api/platform/stats
test_platform_stats() {
  section "2.6 GET /api/platform/stats"
  local res
  res=$(curl -s "$BASE_URL/api/platform/stats")

  if has_error "$res"; then
    fail "$(get_field "$res" 'message')"
    return
  fi

  local ta tb
  ta=$(get_field "$res" 'totalAuthors')
  tb=$(get_field "$res" 'totalBooks')
  pass "Métricas da plataforma — autores: $ta, livros: $tb"
}

# ─── Run ───
login
test_list_books
test_create_book
test_upload_cover
test_user_stats
test_platform_stats
test_delete_book

section "Concluído"
