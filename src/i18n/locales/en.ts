export default {
  // General
  'app.name': 'B24 CLI',
  'app.welcome': 'Welcome to B24 CLI!',
  'app.version': 'Version',
  'app.back': 'Back',
  'app.cancel': 'Cancel',
  'app.confirm': 'Confirm',
  'app.success': 'Success!',
  'app.error': 'ERROR',
  'app.loading': 'Loading...',
  'app.refresh': 'refresh',
  'app.exit': 'Exit',
  'app.press_enter': 'ENTER - continue',
  'app.press_esc': 'ESC - back',
  'app.press_r': 'R - refresh',
  'app.press_q': 'Q - quit',
  'app.not_found': 'Not found',

  // Auth
  'auth.not_configured': 'Webhook URL not configured. Run "b24-cli login <webhook-url>" first.',
  'auth.help': 'Help: b24-cli login https://your-domain.bitrix24.kz/rest/USER_ID/WEBHOOK/',
  'auth.connecting': 'Connecting to Bitrix24...',
  'auth.connection_error': 'Connection error',
  'auth.success': 'Success! Hello,',
  'auth.user_id': 'User ID',
  'auth.webhook_error': 'Error: please check if the Webhook URL is correct.',
  'auth.logged_out': 'Successfully logged out.',
  'auth.status_connected': 'Status: Connected',
  'auth.status_disconnected': 'Status: Disconnected',

  // Welcome (no auth)
  'welcome.title': 'Welcome to B24 CLI!',
  'welcome.setup': 'First, authenticate with a webhook URL:',
  'welcome.commands': 'Commands:',
  'welcome.login_desc': 'Connect with webhook',
  'welcome.tasks_desc': 'Tasks panel',
  'welcome.task_id_desc': 'Task details',
  'welcome.open_desc': 'Interactive menu',
  'welcome.status_desc': 'Connection status',
  'welcome.logout_desc': 'Logout',
  'welcome.lang_desc': 'Change language (en, uz, ru)',

  // Main Menu
  'menu.title': 'Main Menu',
  'menu.my_tasks': 'My tasks',
  'menu.all_tasks': 'All tasks',
  'menu.language': 'Change language',
  'menu.logout': 'Logout',
  'menu.exit': 'Exit application',

  // Tasks
  'tasks.title': 'My tasks',
  'tasks.all_title': 'All tasks',
  'tasks.loading': 'Loading tasks...',
  'tasks.empty': 'No tasks found',
  'tasks.total': 'Total',
  'tasks.task': 'task',
  'tasks.tasks': 'tasks',

  // Task Detail
  'task.detail_title': 'Task',
  'task.loading': 'Loading task...',
  'task.not_found': 'Task not found',
  'task.title': 'Title',
  'task.status': 'Status',
  'task.priority': 'Priority',
  'task.responsible': 'Responsible',
  'task.creator': 'Creator',
  'task.group': 'Group',
  'task.deadline': 'Deadline',
  'task.time_spent': 'Time spent',
  'task.hours': 'h',
  'task.minutes': 'min',
  'task.actions': 'Actions:',

  // Actions
  'action.change_status': 'Change status',
  'action.add_comment': 'Add comment',
  'action.view_comments': 'View comments',
  'action.add_time': 'Add time',
  'action.delegate': 'Change responsible',
  'action.move_stage': 'Move to stage (Kanban)',
  'action.back': 'Back',

  // Status
  'status.new': 'New',
  'status.pending': 'Pending',
  'status.in_progress': 'In Progress',
  'status.awaiting_control': 'Awaiting control',
  'status.completed': 'Completed',
  'status.deferred': 'Deferred',

  // Status Change
  'status.change_title': 'Change status',
  'status.changing': 'Changing status...',
  'status.changed': 'Status changed successfully!',
  'status.current': 'Current',
  'status.start': 'Start (In Progress)',
  'status.complete': 'Complete',
  'status.pause': 'Pause',
  'status.defer': 'Defer',
  'status.renew': 'Renew',

  // Priority
  'priority.low': 'Low',
  'priority.medium': 'Medium',
  'priority.high': 'High',

  // Comments
  'comments.title': 'Comments',
  'comments.loading': 'Loading comments...',
  'comments.empty': 'No comments',
  'comments.add_title': 'Add comment',
  'comments.sending': 'Sending comment...',
  'comments.sent': 'Comment added successfully!',
  'comments.mention_help': 'For mention use [USER=ID]Name[/USER] format',
  'comments.placeholder': 'Enter comment text...',
  'comments.label': 'Comment',
  'comments.press_enter': 'ENTER - send',

  // Time Tracking
  'time.add_title': 'Add time',
  'time.adding': 'Adding time...',
  'time.added': 'Time added successfully!',
  'time.hours': 'Hours',
  'time.minutes': 'Minutes',
  'time.comment': 'Comment (optional)',
  'time.comment_placeholder': 'What did you do...',
  'time.press_enter': 'ENTER - save',
  'time.zero_error': 'Time must be greater than 0',

  // Delegate
  'delegate.title': 'Change responsible',
  'delegate.loading': 'Loading users...',
  'delegate.changing': 'Changing responsible...',
  'delegate.changed': 'Responsible changed successfully!',
  'delegate.current': 'Current',
  'delegate.select': 'Select new responsible:',

  // Move Stage
  'stage.title': 'Move to stage',
  'stage.loading': 'Loading stages...',
  'stage.moving': 'Moving task...',
  'stage.moved': 'Task moved successfully!',
  'stage.empty': 'No stages found. Is the task in a Kanban project?',
  'stage.select': 'Select stage:',
  'stage.current': '(current)',

  // Language
  'lang.title': 'Change language',
  'lang.select': 'Select language:',
  'lang.changed': 'Language changed to',
  'lang.custom_hint': 'Add custom languages in ~/.config/b24-cli/locales/',
} as const;
