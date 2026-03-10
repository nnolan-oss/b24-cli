#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
#  bitrix24-cli installer
#  Works on: Linux, macOS, Windows (Git Bash/WSL)
# ─────────────────────────────────────────────

APP_NAME="bitrix24-cli"
REPO_URL="https://github.com/user/bitrix24-cli"  # TODO: update after publish
MIN_NODE_VERSION=18

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── Detect OS ────────────────────────────────
detect_os() {
  case "$(uname -s)" in
    Linux*)   OS="linux" ;;
    Darwin*)  OS="macos" ;;
    MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
    *)        OS="unknown" ;;
  esac
  echo "$OS"
}

# ── Check Node.js ────────────────────────────
check_node() {
  if ! command -v node &>/dev/null; then
    error "Node.js topilmadi. Avval Node.js ${MIN_NODE_VERSION}+ o'rnating:
    Linux/macOS:  curl -fsSL https://fnm.vercel.app/install | bash && fnm install ${MIN_NODE_VERSION}
    Windows:      https://nodejs.org/en/download
    Nix:          nix-shell -p nodejs"
  fi

  local node_version
  node_version=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$node_version" -lt "$MIN_NODE_VERSION" ]; then
    error "Node.js v${node_version} topildi, lekin v${MIN_NODE_VERSION}+ kerak. Node.js ni yangilang."
  fi
  success "Node.js v$(node -v | sed 's/v//') topildi"
}

# ── Check npm ────────────────────────────────
check_npm() {
  if ! command -v npm &>/dev/null; then
    error "npm topilmadi. Node.js bilan birga kelishi kerak edi."
  fi
  success "npm v$(npm -v) topildi"
}

# ── Install methods ──────────────────────────
install_from_npm() {
  info "npm orqali global o'rnatilmoqda..."
  npm install -g "$APP_NAME"
  success "$APP_NAME npm orqali o'rnatildi"
}

install_from_source() {
  info "Manba koddan o'rnatilmoqda..."

  local install_dir="${HOME}/.${APP_NAME}"

  if [ -d "$install_dir" ]; then
    info "Mavjud papka yangilanmoqda: $install_dir"
    cd "$install_dir"
    git pull --ff-only
  else
    if command -v git &>/dev/null; then
      git clone "$REPO_URL" "$install_dir"
    else
      error "git topilmadi. Avval git o'rnating yoki npm usulini tanlang."
    fi
    cd "$install_dir"
  fi

  npm install
  npm run build
  npm link

  success "$APP_NAME manba koddan o'rnatildi"
}

install_local() {
  info "Joriy papkadan o'rnatilmoqda..."

  if [ ! -f "package.json" ]; then
    error "package.json topilmadi. Loyiha papkasida ekanligingizni tekshiring."
  fi

  npm install
  npm run build
  npm link

  success "$APP_NAME lokal o'rnatildi"
}

# ── Post-install check ───────────────────────
verify_install() {
  echo ""
  if command -v b24 &>/dev/null; then
    success "b24 buyrug'i tayyor!"
    echo ""
    b24 --version
  elif command -v bitrix24-cli &>/dev/null; then
    success "bitrix24-cli buyrug'i tayyor!"
    echo ""
    bitrix24-cli --version
  else
    warn "Global buyruq topilmadi. PATH ni tekshiring yoki yangi terminal oching."
    echo ""
    echo -e "  Qo'lda ishga tushirish: ${BOLD}npx bitrix24-cli${NC}"
  fi
}

# ── Uninstall ────────────────────────────────
uninstall() {
  info "$APP_NAME o'chirilmoqda..."

  npm uninstall -g "$APP_NAME" 2>/dev/null || true

  local install_dir="${HOME}/.${APP_NAME}"
  if [ -d "$install_dir" ]; then
    rm -rf "$install_dir"
    info "Papka o'chirildi: $install_dir"
  fi

  success "$APP_NAME o'chirildi"
  exit 0
}

# ── Main ─────────────────────────────────────
main() {
  echo ""
  echo -e "${BOLD}${CYAN}╔══════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${CYAN}║     bitrix24-cli — installer         ║${NC}"
  echo -e "${BOLD}${CYAN}╚══════════════════════════════════════╝${NC}"
  echo ""

  local os
  os=$(detect_os)
  info "OS: $os"

  # Handle --uninstall flag
  if [[ "${1:-}" == "--uninstall" || "${1:-}" == "uninstall" ]]; then
    uninstall
  fi

  check_node
  check_npm

  echo ""
  echo -e "${BOLD}O'rnatish usulini tanlang:${NC}"
  echo ""
  echo "  1) npm (global)   — npm install -g bitrix24-cli"
  echo "  2) Source (git)    — git clone + npm link"
  echo "  3) Local           — joriy papkadan npm link"
  echo "  4) Bekor qilish"
  echo ""

  # Non-interactive mode: accept method as argument
  local method="${1:-}"
  if [[ -z "$method" || "$method" == "--interactive" ]]; then
    read -rp "Tanlov [1-4]: " method
  fi

  case "$method" in
    1|npm)    install_from_npm ;;
    2|source) install_from_source ;;
    3|local)  install_local ;;
    4|exit)   info "Bekor qilindi."; exit 0 ;;
    *)        error "Noto'g'ri tanlov: $method" ;;
  esac

  verify_install

  echo ""
  echo -e "${BOLD}Keyingi qadamlar:${NC}"
  echo ""
  echo -e "  ${CYAN}b24 login${NC} https://your-domain.bitrix24.kz/rest/USER_ID/WEBHOOK/"
  echo -e "  ${CYAN}b24 tasks${NC}"
  echo -e "  ${CYAN}b24 lang uz${NC}  # Tilni o'zgartirish"
  echo ""
}

main "$@"
