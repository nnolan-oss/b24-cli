# B24 CLI Tool

## About

A CLI tool for managing Bitrix24 from the terminal. Built with React Ink framework, providing an interactive and user-friendly interface.

## Key Features

### Authentication
- Authentication via inbound webhook URL
- Webhook stored in config file (`~/.config/b24-cli/config.json`)
- Setup via `b24 login <webhook-url>` command

### Task Management
- **My tasks** — view all tasks assigned to you
- **Task details** — full information about a selected task
- **Change status** — move task between states (new, in progress, completed, etc.)
- **Kanban movement** — move tasks between kanban stages
- **Change responsible** — reassign a task to a different person
- **Create task** — create a new task from terminal

### Comments
- Add comments to tasks
- **@mention** — mention users in comments (`[USER=ID]Name[/USER]`)
- View comment history

### Time Tracking
- Add time spent on a task
- View time logs
- Start/stop timer

### Additional Features
- View users list
- Projects list
- Filter and search tasks
- Priority color coding

## Technologies

- **React Ink** — terminal UI framework
- **TypeScript** — type safety
- **Commander.js** — CLI command handling
- **Axios** — HTTP requests

## Installation

```bash
npm install -g b24-cli
b24 login https://your-domain.bitrix24.kz/rest/USER_ID/WEBHOOK_KEY/
b24 tasks
```

## Commands

| Command | Description |
|---------|-------------|
| `login <url>` | Authenticate with webhook URL |
| `tasks` | Interactive tasks panel |
| `tasks <id>` | Task details |
| `open` | Interactive main menu |
| `lang <code>` | Change language (en, uz, ru) |
| `status` | Connection status |
| `logout` | Clear configuration |
