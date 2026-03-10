#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
#  b24-cli installer
#  Works on: Linux, macOS, Windows (Git Bash/WSL)
# ─────────────────────────────────────────────

APP_NAME="b24-cli"
REPO_URL="https://github.com/nnolan-oss/b24-cli"  # TODO: update after publish
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
    error "Node.js not found. Please install Node.js ${MIN_NODE_VERSION}+ first:
    Linux/macOS:  curl -fsSL https://fnm.vercel.app/install | bash && fnm install ${MIN_NODE_VERSION}
    Windows:      https://nodejs.org/en/download
    Nix:          nix-shell -p nodejs"
  fi

  local node_version
  node_version=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$node_version" -lt "$MIN_NODE_VERSION" ]; then
    error "Node.js v${node_version} found, but v${MIN_NODE_VERSION}+ is required. Please upgrade Node.js."
  fi
  success "Node.js v$(node -v | sed 's/v//') found"
}

# ── Check npm ────────────────────────────────
check_npm() {
  if ! command -v npm &>/dev/null; then
    error "npm not found. It should come bundled with Node.js."
  fi
  success "npm v$(npm -v) found"
}

# ── Install methods ──────────────────────────
install_from_npm() {
  info "Installing globally via npm..."
  npm install -g "$APP_NAME"
  success "$APP_NAME installed via npm"
}

install_from_source() {
  info "Installing from source..."

  local install_dir="${HOME}/.${APP_NAME}"

  if [ -d "$install_dir" ]; then
    info "Updating existing directory: $install_dir"
    cd "$install_dir"
    git pull --ff-only
  else
    if command -v git &>/dev/null; then
      git clone "$REPO_URL" "$install_dir"
    else
      error "git not found. Please install git or use the npm method."
    fi
    cd "$install_dir"
  fi

  npm install
  npm run build
  npm link

  success "$APP_NAME installed from source"
}

install_local() {
  info "Installing from local directory..."

  if [ ! -f "package.json" ]; then
    error "package.json not found. Make sure you are in the project directory."
  fi

  npm install
  npm run build
  npm link

  success "$APP_NAME installed locally"
}

# ── Post-install check ───────────────────────
verify_install() {
  echo ""
  if command -v b24 &>/dev/null; then
    success "b24 command is ready!"
    echo ""
    b24 --version
  elif command -v b24-cli &>/dev/null; then
    success "b24-cli command is ready!"
    echo ""
    b24-cli --version
  else
    warn "Global command not found. Check your PATH or open a new terminal."
    echo ""
    echo -e "  Run manually: ${BOLD}npx b24-cli${NC}"
  fi
}

# ── Uninstall ────────────────────────────────
uninstall() {
  info "Uninstalling $APP_NAME..."

  npm uninstall -g "$APP_NAME" 2>/dev/null || true

  local install_dir="${HOME}/.${APP_NAME}"
  if [ -d "$install_dir" ]; then
    rm -rf "$install_dir"
    info "Removed directory: $install_dir"
  fi

  success "$APP_NAME uninstalled"
  exit 0
}

# ── Main ─────────────────────────────────────
main() {
  echo ""
  echo -e "${BOLD}${CYAN}╔══════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${CYAN}║         b24-cli — installer          ║${NC}"
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
  echo -e "${BOLD}Select installation method:${NC}"
  echo ""
  echo "  1) npm (global)   — npm install -g b24-cli"
  echo "  2) Source (git)    — git clone + npm link"
  echo "  3) Local           — npm link from current directory"
  echo "  4) Cancel"
  echo ""

  # Non-interactive mode: accept method as argument
  local method="${1:-}"
  if [[ -z "$method" || "$method" == "--interactive" ]]; then
    read -rp "Choice [1-4]: " method
  fi

  case "$method" in
    1|npm)    install_from_npm ;;
    2|source) install_from_source ;;
    3|local)  install_local ;;
    4|exit)   info "Cancelled."; exit 0 ;;
    *)        error "Invalid choice: $method" ;;
  esac

  verify_install

  echo ""
  echo -e "${BOLD}Next steps:${NC}"
  echo ""
  echo -e "  ${CYAN}b24 login${NC} https://your-domain.bitrix24.kz/rest/USER_ID/WEBHOOK/"
  echo -e "  ${CYAN}b24 tasks${NC}"
  echo -e "  ${CYAN}b24 lang uz${NC}  # Change language"
  echo ""
}

main "$@"
