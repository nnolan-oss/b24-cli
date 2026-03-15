export default {
  // General
  "app.name": "B24 CLI",
  "app.welcome": "Добро пожаловать в B24 CLI!",
  "app.version": "Версия",
  "app.back": "Назад",
  "app.cancel": "Отмена",
  "app.confirm": "Подтвердить",
  "app.success": "Успешно!",
  "app.error": "ОШИБКА",
  "app.loading": "Загрузка...",
  "app.refresh": "обновить",
  "app.exit": "Выход",
  "app.press_enter": "ENTER - продолжить",
  "app.press_esc": "ESC - назад",
  "app.press_r": "R - обновить",
  "app.press_q": "Q - выход",
  "app.not_found": "Не найдено",

  // Auth
  "auth.not_configured":
    'Webhook URL не настроен. Сначала выполните "b24-cli login <webhook-url>".',
  "auth.help":
    "Помощь: b24-cli login https://your-domain.bitrix24.kz/rest/USER_ID/WEBHOOK/",
  "auth.connecting": "Подключение к Bitrix24...",
  "auth.connection_error": "Ошибка подключения",
  "auth.success": "Успешно! Привет,",
  "auth.user_id": "ID пользователя",
  "auth.webhook_error": "Ошибка: проверьте правильность Webhook URL.",
  "auth.logged_out": "Успешный выход.",
  "auth.status_connected": "Статус: Подключён",
  "auth.status_disconnected": "Статус: Не подключён",

  // Welcome (no auth)
  "welcome.title": "Добро пожаловать в B24 CLI!",
  "welcome.setup": "Сначала авторизуйтесь с помощью webhook URL:",
  "welcome.commands": "Команды:",
  "welcome.login_desc": "Подключиться через webhook",
  "welcome.tasks_desc": "Панель задач",
  "welcome.task_id_desc": "Детали задачи",
  "welcome.open_desc": "Интерактивное меню",
  "welcome.status_desc": "Статус подключения",
  "welcome.logout_desc": "Выход",
  "welcome.lang_desc": "Сменить язык (en, uz, ru)",

  // Main Menu
  "menu.title": "Главное меню",
  "menu.my_tasks": "Мои задачи",
  "menu.all_tasks": "Все задачи",
  "menu.language": "Сменить язык",
  "menu.logout": "Выход (logout)",
  "menu.exit": "Выйти из программы",

  // Tasks
  "tasks.title": "Мои задачи",
  "tasks.all_title": "Все задачи",
  "tasks.loading": "Загрузка задач...",
  "tasks.empty": "Задачи не найдены",
  "tasks.total": "Всего",
  "tasks.task": "задача",
  "tasks.tasks": "задач",

  // Task Detail
  "task.detail_title": "Задача",
  "task.loading": "Загрузка задачи...",
  "task.not_found": "Задача не найдена",
  "task.title": "Название",
  "task.status": "Статус",
  "task.priority": "Приоритет",
  "task.responsible": "Ответственный",
  "task.creator": "Создатель",
  "task.group": "Группа",
  "task.deadline": "Крайний срок",
  "task.time_spent": "Затрачено",
  "task.hours": "ч",
  "task.minutes": "мин",
  "task.actions": "Действия:",

  // Actions
  "action.change_status": "Изменить статус",
  "action.add_comment": "Написать комментарий",
  "action.view_comments": "Просмотр комментариев",
  "action.add_time": "Добавить время",
  "action.delegate": "Сменить ответственного",
  "action.move_stage": "Переместить в стадию (Kanban)",
  "action.back": "Назад",

  // Status
  "status.new": "Новая",
  "status.pending": "Ожидает",
  "status.in_progress": "Выполняется",
  "status.awaiting_control": "Ожидает контроля",
  "status.completed": "Завершена",
  "status.deferred": "Отложена",

  // Status Change
  "status.change_title": "Изменить статус",
  "status.changing": "Изменение статуса...",
  "status.changed": "Статус успешно изменён!",
  "status.current": "Текущий",
  "status.start": "Начать (В работе)",
  "status.complete": "Завершить",
  "status.pause": "Приостановить",
  "status.defer": "Отложить",
  "status.renew": "Возобновить",

  // Priority
  "priority.low": "Низкий",
  "priority.medium": "Средний",
  "priority.high": "Высокий",

  // Comments
  "comments.title": "Комментарии",
  "comments.loading": "Загрузка комментариев...",
  "comments.empty": "Нет комментариев",
  "comments.add_title": "Написать комментарий",
  "comments.sending": "Отправка комментария...",
  "comments.sent": "Комментарий успешно добавлен!",
  "comments.mention_help":
    "Для упоминания используйте формат [USER=ID]Имя[/USER]",
  "comments.placeholder": "Введите текст комментария...",
  "comments.label": "Комментарий",
  "comments.press_enter": "ENTER - отправить",

  // Time Tracking
  "time.add_title": "Добавить время",
  "time.adding": "Добавление времени...",
  "time.added": "Время успешно добавлено!",
  "time.hours": "Часы",
  "time.minutes": "Минуты",
  "time.comment": "Комментарий (необязательно)",
  "time.comment_placeholder": "Что было сделано...",
  "time.press_enter": "ENTER - сохранить",
  "time.zero_error": "Время должно быть больше 0",

  // Delegate
  "delegate.title": "Сменить ответственного",
  "delegate.loading": "Загрузка пользователей...",
  "delegate.changing": "Смена ответственного...",
  "delegate.changed": "Ответственный успешно изменён!",
  "delegate.current": "Текущий",
  "delegate.select": "Выберите нового ответственного:",

  // Move Stage
  "stage.title": "Переместить на стадию (Канбан)",
  "stage.loading": "Загрузка стадий...",
  "stage.moving": "Перемещение задачи...",
  "stage.moved": "Задача перемещена.",
  "stage.empty": "Для этого проекта не найдено стадий.",
  "stage.empty_scrum": "Для активного спринта не найдено стадий.",
  "stage.select": "Выберите новую стадию",
  "stage.current": "(текущая)",
  "stage.scrum_move_error":
    "Примечание: Перемещение задач в Scrum/Sprint через API может не поддерживаться Bitrix24.",

  // Language
  "lang.title": "Сменить язык",
  "lang.select": "Выберите язык:",
  "lang.changed": "Язык изменён на",
  "lang.custom_hint": "Добавьте свой язык: ~/.config/b24-cli/locales/",
} as const;
