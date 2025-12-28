/* eslint-disable no-console */
import path from 'path';
import { fileURLToPath } from 'url';
import { Context, Telegraf } from 'telegraf';
import rateLimit from 'telegraf-ratelimit';

// Расширяем тип Context для startPayload
interface MyContext extends Context {
  startPayload?: string;
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN is required');
if (!APP_URL) throw new Error('APP_URL is required');

const bot = new Telegraf<MyContext>(BOT_TOKEN);

// Rate-limiting
bot.use(
  rateLimit({
    window: 3000,
    limit: 1,
    onLimitExceeded: (ctx) => ctx.reply('Too many requests'),
  }),
);

bot.start(async (ctx) => {
  try {
    const user = ctx.from;
    if (!user) throw new Error('User data not available');

    const initData = new URLSearchParams();
    initData.append('auth_date', Math.floor(Date.now() / 1000).toString());
    initData.append(
      'user',
      JSON.stringify({
        id: user.id,
        first_name: user.first_name,
        username: user.username,
        language_code: user.language_code,
      }),
    );
    initData.append('hash', 'mock_signature_for_development');

    const webAppUrl = new URL(APP_URL);
    webAppUrl.searchParams.set('initData', initData.toString());

    const payload = ctx.message?.text.split(' ')[1]; // Получаем telegramId из /start

    let messageText = `🎉 Добро пожаловать в Svara! 🃏
Готов к игре? Здесь тебя ждёт азарт, увлекательный геймплей и шанс зарабатывать реальные деньги!

👥 Зови друзей и собирайтесь в одной комнате.
🔐 Создавай приватные игры с паролем.
💰 Побеждай — получай награды!

Собери колоду, брось вызов и докажи, кто главный!
🎮 Играй. Общайся. Зарабатывай.`;
    if (payload && payload.startsWith('join_')) {
      messageText = 'Приглашение в игру от Друга!';
    }

    if (payload) {
      webAppUrl.searchParams.set('startPayload', payload); // Передаём как startPayload
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    // Пробуем найти assets в dist (runtime) или src (development)
    let assetsPath = path.join(__dirname, 'assets', 'welcome.png');

    // Если файл не найден в dist, пробуем src (для development)
    try {
      await import('fs').then((fs) => fs.promises.access(assetsPath));
    } catch {
      assetsPath = path.join(__dirname, '..', 'src', 'assets', 'welcome.png');
    }

    await ctx.replyWithPhoto(
      { source: assetsPath },
      {
        caption: messageText,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'ИГРАТЬ',
                web_app: { url: webAppUrl.toString() },
              },
            ],
          ],
        },
      },
    );
  } catch (error) {
    console.error('Start command error:', error);
    await ctx.reply('Error occurred. Please try later.');
  }
});

// Graceful shutdown
const shutdown = (signal: NodeJS.Signals) => {
  console.log(`Shutting down (${signal})`);
  bot.stop(signal);
  process.exit(0);
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

// Запуск
bot
  .launch()
  .then(() => console.log('Bot started on @' + bot.botInfo?.username))
  .catch((err) => {
    console.error('Bot start failed:', err);
    process.exit(1);
  });
