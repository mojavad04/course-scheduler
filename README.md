# برنامه‌ریز انتخاب واحد

یک وب‌اپلیکیشن مینیمال، کاملاً فارسی و Client-Side برای برنامه‌ریزی انتخاب واحد دانشجویی.

بدون Backend، بدون Database، بدون Login. تمام اطلاعات فقط در مرورگر خود شما (LocalStorage) ذخیره می‌شود.

## امکانات

- افزودن، ویرایش و حذف درس با یک یا دو جلسه در هفته
- نمایش برنامه هفتگی به‌صورت Timeline / Gantt Chart
- تشخیص خودکار تداخل کلاس‌ها و تداخل امتحان‌ها
- محاسبه مجموع واحدها
- ذخیره‌سازی خودکار در LocalStorage
- اشتراک‌گذاری برنامه از طریق یک URL (بدون سرور)
- دانلود برنامه به‌صورت تصویر PNG
- تاریخ‌های شمسی، اعداد فارسی، ساعت‌های ۲۴ ساعته، راست‌به‌چپ (RTL)

## تکنولوژی‌ها

React + TypeScript + Vite + Tailwind CSS، به‌همراه `jalaali-js` (تبدیل تاریخ شمسی)، `lz-string` (فشرده‌سازی برای اشتراک‌گذاری URL) و `html-to-image` (خروجی PNG).

---

## ۱. نصب Dependencies

```bash
npm install
```

## ۲. اجرای نسخه Local (توسعه)

```bash
npm run dev
```

سپس آدرسی که در ترمینال نمایش داده می‌شود (معمولاً `http://localhost:5173`) را در مرورگر باز کنید.

## ۳. Build نسخه نهایی

```bash
npm run build
```

خروجی در پوشه `dist/` ساخته می‌شود. برای مشاهده محلی خروجی build:

```bash
npm run preview
```

## ۴. Deploy روی GitHub Pages

پروژه از پیش برای انتشار روی GitHub Pages تنظیم شده (مسیر assets به‌صورت نسبی است، `vite.config.ts` → `base: "./"`).

### روش پیشنهادی: GitHub Actions (خودکار)

یک workflow آماده در مسیر `.github/workflows/deploy.yml` قرار دارد که با هر Push به شاخه `main` به‌صورت خودکار پروژه را build و منتشر می‌کند.

مراحل:

1. یک repository جدید در GitHub بسازید و کد را Push کنید:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```

2. در تنظیمات repository به مسیر بروید: **Settings → Pages**
3. در بخش **Build and deployment → Source** گزینه **GitHub Actions** را انتخاب کنید.
4. بعد از اولین Push، workflow به‌صورت خودکار اجرا و سایت منتشر می‌شود. آدرس نهایی در بخش **Actions** یا **Settings → Pages** نمایش داده می‌شود (به شکل `https://<username>.github.io/<repo-name>/`).

### روش جایگزین: انتشار دستی

اگر ترجیح می‌دهید بدون GitHub Actions Deploy کنید:

```bash
npm run build
npx gh-pages -d dist
```

(نیاز به نصب یک‌بارهٔ پکیج `gh-pages` دارد: `npm install -D gh-pages`)

سپس در **Settings → Pages** شاخه `gh-pages` را به‌عنوان Source انتخاب کنید.

> **نکته:** چون `base: "./"` در `vite.config.ts` تنظیم شده، مسیرهای فایل‌ها نسبی هستند و صرف‌نظر از نام repository یا زیرمسیر GitHub Pages، به‌درستی کار می‌کنند. نیازی به تغییر دستی این مقدار نیست.

---

## ساختار پروژه

```
src/
  types/            تعریف انواع داده (Course, Session, Exam)
  utils/            منطق خالص و بدون UI
    time.ts           پارس و مقایسه ساعت ۲۴ ساعته
    jalali.ts         اعتبارسنجی و تبدیل تاریخ شمسی
    persianDigits.ts  تبدیل اعداد لاتین ↔ فارسی
    conflicts.ts      تشخیص تداخل کلاس و امتحان
    storage.ts        ذخیره و بازیابی از LocalStorage
    share.ts          Encode/Decode برنامه در URL
    exportImage.ts    خروجی PNG از جدول برنامه
    validation.ts     اعتبارسنجی فرم افزودن درس
    constants.ts      روزهای هفته، بازه ساعتی جدول، رنگ‌بندی دروس
  hooks/
    useCourses.ts     مدیریت state دروس + همگام‌سازی با LocalStorage و URL
  components/         تمام کامپوننت‌های UI (فرم، جدول، Modal‌ها و...)
  App.tsx             ترکیب تمام بخش‌ها و مدیریت Modal فعال
```

## داده‌های ذخیره‌شده

برنامه شما فقط در `localStorage` مرورگر شما ذخیره می‌شود و به هیچ سروری ارسال نمی‌شود. لینک اشتراک‌گذاری نیز کاملاً در همان لحظه در مرورگر شما ساخته می‌شود و اطلاعات را به‌صورت فشرده در بخش query خود URL قرار می‌دهد؛ هیچ داده‌ای در سمت سرور ذخیره نمی‌شود.
