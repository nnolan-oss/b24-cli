# B24 CLI

CLI tool to manage Bitrix24 from your terminal. Built with React Ink.

Manage tasks, comments, time tracking, kanban stages, and more — all from the command line.

## Install

### npm (recommended)

```bash
npm install -g b24-cli
```

### One-line installer (Linux / macOS / WSL)

```bash
curl -fsSL https://raw.githubusercontent.com/nnolan-oss/b24-cli/main/install.sh | bash -s -- npm
```

Or interactive mode:

```bash
curl -fsSL https://raw.githubusercontent.com/nnolan-oss/b24-cli/main/install.sh | bash
```

### Nix (flakes)

```bash
# Run directly
nix run github:nnolan-oss/b24-cli

# Install to profile
nix profile install github:nnolan-oss/b24-cli

# Dev shell
nix develop github:nnolan-oss/b24-cli
```

### Nix (classic)

```bash
# Build
nix-build

# Install
nix-env -if .

# Dev shell
nix-shell
```

### From source

```bash
git clone https://github.com/nnolan-oss/b24-cli.git
cd b24-cli
npm install && npm run build && npm link
```

### Uninstall

```bash
# npm
npm uninstall -g b24-cli

# Script
curl -fsSL https://raw.githubusercontent.com/nnolan-oss/b24-cli/main/install.sh | bash -s -- --uninstall

# Nix
nix profile remove b24-cli
```

## Setup

Get your webhook URL from Bitrix24:
**CRM → Developer resources → Other → Inbound webhook**

```bash
b24 login https://your-domain.bitrix24.com/rest/USER_ID/WEBHOOK_KEY/
```

## Usage

```bash
# Interactive menu
b24

# Task list
b24 tasks

# Task details
b24 tasks 123

# Change language
b24 lang uz    # O'zbek
b24 lang ru    # Русский
b24 lang en    # English

# Connection status
b24 status

# Logout
b24 logout
```

## Features

- **Task management** — view, filter, update tasks
- **Status changes** — start, complete, pause, defer, renew
- **Comments** — add comments with @mentions (`[USER=ID]Name[/USER]`)
- **Time tracking** — log hours and minutes with descriptions
- **Delegate** — change task responsible person
- **Kanban** — move tasks between stages
- **Multi-language** — English, Uzbek, Russian (extensible)

## Adding Custom Languages

Create a JSON file in `~/.config/b24-cli/locales/`:

```bash
# Copy the template
cat ~/.config/b24-cli/locales/template.json
```

Create your translation file (e.g., `de.json` for German):

```json
{
  "_name": "Deutsch",
  "app.name": "BITRIX24 CLI",
  "menu.title": "Hauptmenü"
}
```

Then use it:

```bash
b24 lang de
```

## Keyboard Shortcuts

| Key     | Action           |
| ------- | ---------------- |
| `↑↓`    | Navigate menu    |
| `Enter` | Select / Confirm |
| `Esc`   | Go back          |
| `R`     | Refresh list     |
| `Q`     | Quit             |

## Platforms

Works on **Windows**, **macOS**, and **Linux** — anywhere Node.js 18+ runs.

## Maintainer

**Javohir G'ulomjonov**

- GitHub: [@3nln](https://github.com/3nln)
- LinkedIn: [javohirtech](https://linkedin.com/in/javohirtech)
- Website: [nolan.uz](https://nolan.uz)

## License

MIT
