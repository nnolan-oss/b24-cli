# Bitrix24 CLI Tool

## Loyiha haqida

Bitrix24 platformasini terminal orqali boshqarish uchun mo'ljallangan CLI vosita. React Ink framework asosida qurilgan, interaktiv va foydalanuvchiga qulay interfeys bilan.

## Asosiy xususiyatlar

### Autentifikatsiya
- Inbound webhook URL orqali autentifikatsiya
- Konfiguratsiya faylida webhook saqlash (`~/.bitrix-cli/config.json`)
- `bitrix-cli login <webhook-url>` buyrug'i orqali sozlash

### Task (Vazifalar) boshqaruvi
- **Mening vazifalarim** — o'ziga tegishli barcha vazifalarni ko'rish
- **Vazifa tafsilotlari** — tanlangan vazifa haqida to'liq ma'lumot
- **Status o'zgartirish** — vazifani bir holatdan boshqasiga o'tkazish (yangi, bajarilmoqda, tugallangan va h.k.)
- **Kanban bo'ylab surish** — vazifani kanban bosqichlari orasida ko'chirish
- **Mas'ul shaxsni o'zgartirish** — vazifaga tayinlangan odamni almashtirish
- **Yangi vazifa yaratish** — terminal orqali yangi vazifa qo'shish

### Izohlar (Comments)
- Vazifaga izoh yozish
- **@mention** — foydalanuvchini eslatib o'tib izoh yozish
- Izohlar tarixini ko'rish

### Vaqt hisobi (Time Tracking)
- Vazifaga sarflangan vaqtni qo'shish
- Vaqt hisobini ko'rish
- Taymer boshlash/to'xtatish

### Qo'shimcha imkoniyatlar
- Foydalanuvchilar ro'yxatini ko'rish
- Loyihalar ro'yxati
- Vazifalarni filtrlash va qidirish
- Rang kodlari bilan ustuvorlik ko'rsatish

## Texnologiyalar

- **React Ink** — terminal UI framework
- **TypeScript** — tip xavfsizligi
- **Commander.js** — CLI buyruqlarni boshqarish
- **Axios** — HTTP so'rovlar

## O'rnatish

```bash
npm install -g bitrix24-cli
bitrix24-cli login https://your-domain.bitrix24.kz/rest/USER_ID/WEBHOOK_KEY/
bitrix24-cli tasks
```

## Buyruqlar

| Buyruq | Tavsif |
|--------|--------|
| `login <url>` | Webhook URL bilan autentifikatsiya |
| `tasks` | Interaktiv vazifalar paneli |
| `tasks list` | Vazifalar ro'yxati |
| `tasks view <id>` | Vazifa tafsilotlari |
| `tasks comment <id>` | Vazifaga izoh qo'shish |
| `tasks time <id>` | Vaqt hisobi qo'shish |
| `tasks move <id>` | Vazifani boshqa bosqichga ko'chirish |
