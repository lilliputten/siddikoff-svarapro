/* eslint-disable no-console */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Context, Telegraf } from 'telegraf';
import rateLimit from 'telegraf-ratelimit';

const dirName = process.cwd();

const dotenvOptions: dotenv.DotenvConfigOptions = {
  path: [
    // Using root `.env` file
    path.resolve(dirName, '..', '.env'),
    // Using current folder's `.env` file
    path.resolve(dirName, '.env'),
  ],
};

dotenv.config(dotenvOptions);

// Расширяем тип Context для startPayload
interface MyContext extends Context {
  startPayload?: string;
}

const isDev = process.env.NODE_ENV === 'development';
const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;
const CLIENT_APP_URL = process.env.CLIENT_APP_URL;

if (!BOT_TOKEN || BOT_TOKEN === 'your_bot_token_here') {
  console.warn(
    '[bot] BOT_TOKEN not set or using placeholder. Bot will not start.',
  );
  console.warn(
    '[bot] To enable the bot, set BOT_TOKEN environment variable with a valid Telegram bot token.',
  );
  process.exit(0);
}

if (!APP_URL) {
  console.warn('[bot] APP_URL not set. Bot will not start.');
  console.warn('[bot] To enable the bot, set APP_URL environment variable.');
  process.exit(0);
}

const appUrl = CLIENT_APP_URL || APP_URL;

console.log('[bot/src/index.ts]', {
  isDev,
  appUrl,
  dotenvOptions,
  BOT_TOKEN,
  APP_URL,
  CLIENT_APP_URL,
});

const tgOptions = {} satisfies Partial<Telegraf.Options<MyContext>>;
const bot = new Telegraf<MyContext>(BOT_TOKEN, tgOptions);

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

    const webAppUrl = new URL(appUrl);
    webAppUrl.searchParams.set('initData', initData.toString());

    /* // initData sample (unescaped) keys:
     * auth_date=NNNNNNNNNN
     * user={"id":NNNNNNNNN,"first_name":"Ig","username":"lilliputten","language_code":"en"}
     * hash=mock_signature_for_development
     */

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

    console.log('[bot/src/index.ts:start]', {
      ctx,
      assetsPath,
      webAppUrl,
    });

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

const launchOptions: Telegraf.LaunchOptions = {
  // Long polling options (default mode)
  dropPendingUpdates: true, // Удаляем старые обновления при запуске
  allowedUpdates: ['message', 'callback_query', 'inline_query'], // Типы обновлений, которые будем получать
};
/* // DEBUG: Use webhook
 * if (isDev) {
 *   launchOptions.webhook = {
 *     domain: APP_URL, // Use your APP_URL as the domain
 *     port: parseInt(process.env.PORT || '3000'), // Use PORT from env or default to 3000
 *   };
 * }
 */

// Удаляем текущий webhook (если он был установлен), чтобы использовать long polling
bot.telegram
  .deleteWebhook({ drop_pending_updates: true })
  .then(() => {
    console.log('Webhook deleted, starting in long polling mode');

    // Запуск - используем long polling (режим по умолчанию)
    return bot.launch(launchOptions);
  })
  .then(() => {
    // This log entry is never printed
    console.log('Bot started on @' + bot.botInfo?.username);
  })
  .catch((err) => {
    console.error('Bot start failed:', err);
    process.exit(1);
  });
