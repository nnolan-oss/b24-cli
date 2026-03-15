export default {
  // General
  "app.name": "B24 CLI",
  "app.welcome": "B24 CLI ga xush kelibsiz!",
  "app.version": "Versiya",
  "app.back": "Orqaga",
  "app.cancel": "Bekor qilish",
  "app.confirm": "Tasdiqlash",
  "app.success": "Muvaffaqiyatli!",
  "app.error": "XATO",
  "app.loading": "Yuklanmoqda...",
  "app.refresh": "yangilash",
  "app.exit": "Chiqish",
  "app.press_enter": "ENTER - davom etish",
  "app.press_esc": "ESC - orqaga",
  "app.press_r": "R - yangilash",
  "app.press_q": "Q - chiqish",
  "app.not_found": "Topilmadi",
  "app.yes": "Ha",
  "app.no": "Yo'q",

  // Auth
  "auth.not_configured":
    'Webhook URL sozlanmagan. Avval "b24-cli login <webhook-url>" buyrug\'ini bajaring.',
  "auth.help":
    "Yordam: b24-cli login https://your-domain.bitrix24.kz/rest/USER_ID/WEBHOOK/",
  "auth.connecting": "Bitrix24 ga ulanilmoqda...",
  "auth.connection_error": "Ulanish xatosi",
  "auth.success": "Muvaffaqiyatli! Salom,",
  "auth.user_id": "Foydalanuvchi ID",
  "auth.webhook_error": "Xatolik: Webhook URL to'g'ri ekanligini tekshiring.",
  "auth.logged_out": "Muvaffaqiyatli chiqildi.",
  "auth.status_connected": "Holat: Ulangan",
  "auth.status_disconnected": "Holat: Ulanmagan",

  // Welcome (no auth)
  "welcome.title": "B24 CLI ga xush kelibsiz!",
  "welcome.setup": "Avval webhook URL bilan autentifikatsiya qiling:",
  "welcome.commands": "Buyruqlar:",
  "welcome.login_desc": "Webhook bilan ulanish",
  "welcome.tasks_desc": "Vazifalar paneli",
  "welcome.task_id_desc": "Vazifa tafsilotlari",
  "welcome.open_desc": "Interaktiv menyu",
  "welcome.status_desc": "Ulanish holatini ko'rish",
  "welcome.logout_desc": "Chiqish",
  "welcome.lang_desc": "Tilni o'zgartirish (en, uz, ru)",

  // Main Menu
  "menu.title": "Bosh menyu",
  "menu.my_tasks": "Mening vazifalarim",
  "menu.all_tasks": "Barcha vazifalar",
  "menu.create_task": "Yangi vazifa yaratish",
  "menu.language": "Tilni o'zgartirish",
  "menu.logout": "Chiqish",
  "menu.exit": "Dasturdan chiqish",

  // Tasks
  "tasks.title": "Mening vazifalarim",
  "tasks.all_title": "Barcha vazifalar",
  "tasks.loading": "Vazifalar yuklanmoqda...",
  "tasks.empty": "Vazifalar topilmadi",
  "tasks.total": "Jami",
  "tasks.task": "ta vazifa",
  "tasks.tasks": "ta vazifa",

  // Task Detail
  "task.detail_title": "Vazifa",
  "task.loading": "Vazifa yuklanmoqda...",
  "task.not_found": "Vazifa topilmadi",
  "task.title": "Sarlavha",
  "task.status": "Status",
  "task.priority": "Ustuvorlik",
  "task.responsible": "Mas'ul",
  "task.creator": "Yaratuvchi",
  "task.group": "Guruh",
  "task.deadline": "Muddat",
  "task.description": "Tavsif",
  "task.time_spent": "Sarflangan vaqt",
  "task.hours": "soat",
  "task.minutes": "daqiqa",
  "task.checklist": "Cheklist",
  "task.actions": "Amallar:",
  "task.create_title": "Yangi Vazifa Yaratish",
  "task.creating": "Vazifa yaratilmoqda...",
  "task.edit_title": "Vazifani Tahrirlash",
  "task.updating": "Vazifa yangilanmoqda...",
  "task.deleting": "Vazifa o'chirilmoqda...",
  "task.delete_confirm_title":
    "Haqiqatan ham ushbu vazifani o'chirmoqchimisiz?",

  // Amallar
  "action.change_status": "Statusni o'zgartirish",
  "action.add_comment": "Izoh qo'shish",
  "action.view_comments": "Izohlarni ko'rish",
  "action.add_time": "Vaqt qo'shish",
  "action.delegate": "Mas'ulni o'zgartirish",
  "action.move_stage": "Bosqichga ko'chirish (Kanban)",
  "action.edit": "Tahrirlash",
  "action.delete": "O'chirish",
  "action.back": "Orqaga",

  // Status
  "status.new": "Yangi",
  "status.pending": "Kutilmoqda",
  "status.in_progress": "Bajarilmoqda",
  "status.awaiting_control": "Kutish (nazorat)",
  "status.completed": "Tugallangan",
  "status.deferred": "Kechiktirilgan",

  // Status Change
  "status.change_title": "Status o'zgartirish",
  "status.changing": "Status o'zgartirilmoqda...",
  "status.changed": "Status muvaffaqiyatli o'zgartirildi!",
  "status.current": "Joriy",
  "status.start": "Boshlash (Bajarilmoqda)",
  "status.complete": "Tugallash",
  "status.pause": "To'xtatish",
  "status.defer": "Kechiktirish",
  "status.renew": "Qayta boshlash",

  // Priority
  "priority.low": "Past",
  "priority.medium": "O'rtacha",
  "priority.high": "Yuqori",

  // Comments
  "comments.title": "Izohlar",
  "comments.loading": "Izohlar yuklanmoqda...",
  "comments.empty": "Izohlar yo'q",
  "comments.add_title": "Izoh yozish",
  "comments.sending": "Izoh yuborilmoqda...",
  "comments.sent": "Izoh muvaffaqiyatli qo'shildi!",
  "comments.mention_help":
    "Mention uchun [USER=ID]Ism[/USER] formatidan foydalaning",
  "comments.placeholder": "Izoh matnini kiriting...",
  "comments.label": "Izoh",
  "comments.press_enter": "ENTER - yuborish",

  // Time Tracking
  "time.add_title": "Vaqt qo'shish",
  "time.adding": "Vaqt qo'shilmoqda...",
  "time.added": "Vaqt muvaffaqiyatli qo'shildi!",
  "time.hours": "Soat",
  "time.minutes": "Daqiqa",
  "time.comment": "Izoh (ixtiyoriy)",
  "time.comment_placeholder": "Nima ish qildingiz...",
  "time.press_enter": "ENTER - saqlash",
  "time.zero_error": "Vaqt 0 dan katta bo'lishi kerak",

  // Delegate
  "delegate.title": "Mas'ul o'zgartirish",
  "delegate.loading": "Foydalanuvchilar yuklanmoqda...",
  "delegate.changing": "Mas'ul o'zgartirilmoqda...",
  "delegate.changed": "Mas'ul shaxs o'zgartirildi.",
  "delegate.current": "Joriy",
  "delegate.select": "Yangi mas'ulni tanlang:",

  // Move Stage
  "stage.title": "Bosqichga ko'chirish",
  "stage.loading": "Bosqichlar yuklanmoqda...",
  "stage.moving": "Vazifa ko'chirilmoqda...",
  "stage.moved": "Vazifa ko'chirildi.",
  "stage.empty": "Ushbu loyiha uchun bosqichlar topilmadi.",
  "stage.empty_scrum": "Aktiv sprint uchun bosqichlar topilmadi.",
  "stage.select": "Yangi bosqichni tanlang",
  "stage.current": "(joriy)",
  "stage.scrum_move_error":
    "Eslatma: Scrum/Sprintdagi vazifalarni API orqali ko'chirish Bitrix24 tomonidan qo'llab-quvvatlanmasligi mumkin.",

  // Til
  "lang.title": "Tilni o'zgartirish",
  "lang.select": "Tilni tanlang:",
  "lang.changed": "Til o'zgartirildi:",
  "lang.custom_hint": "O'z tilingizni qo'shing: ~/.config/b24-cli/locales/",
} as const;
