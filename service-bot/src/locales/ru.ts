// src/locales/ru.ts
export const ru = {
  welcome: (name: string) => `Привет, ${name}!`,

  help: {
    title: '📋 Доступные команды:\n\n',
    common: ['Нет доступных команд'],
  },

  errors: {
    tooManyRequests: '⚠️ Слишком много запросов. Попробуйте позже.',
    userNotFound: '❌ Пользователь не найден',
    insufficientBalance: '❌ Недостаточно средств',
    invalidAmount: '❌ Неверная сумма',
    serverError: '❌ Ошибка сервера. Попробуйте позже.',
    accessDenied: '❌ Доступ запрещен',
    invalidCommand: '❌ Неверная команда',
    invalidPassword:
      '❌ Пароль должен содержать только буквы и цифры (6-20 символов)',
  },

  success: {
    balanceUpdated: '✅ Баланс обновлен',
    userBanned: '✅ Пользователь заблокирован',
    userUnbanned: '✅ Пользователь разблокирован',
    transactionCreated: '✅ Транзакция создана',
    passwordCreated:
      '✅ Пароль создан! Теперь вы можете использовать /admin для входа.',
    loginSuccess: '✅ Успешная авторизация! Добро пожаловать в админ-панель.',
  },

  admin: {
    panel: '🔧 Админ панель\n\nВыберите действие:',
    menu: '🔧 Админ меню\n\nДобро пожаловать в панель администратора!',
    users: '👥 Пользователи',
    stats: '📊 Статистика',
    userInfo: '👤 Информация о пользователе',
    banUser: '🚫 Заблокировать пользователя',
    unbanUser: '✅ Разблокировать пользователя',
    enterPassword: '🔐 Введите пароль администратора:',
    createPassword:
      '🔐 Создайте новый пароль администратора (только буквы и цифры, 6-20 символов):',
    wrongPassword: '❌ Неверный пароль',
    alreadyLoggedIn: '✅ Вы уже авторизованы как администратор.',
    notInAdminList: '❌ Вы не в списке администраторов.',
    firstTimeAdmin:
      '🔐 Добро пожаловать! Это ваш первый вход. Создайте пароль администратора:',
    back: '⬅️ Назад',
    search: '🔍 Поиск',
    next: '➡️ Далее',
    prev: '⬅️ Назад',
    balance: '💰 Баланс',
    addBalance: '➕ Добавить баланс',
    removeBalance: '➖ Убрать баланс',
    amount: 'Сумма:',
    enterAmount: 'Введите сумму:',
    balanceUpdated: 'Баланс обновлен:',
    userNotFound: 'Пользователь не найден',
    noUsers: 'Пользователи не найдены',
    totalUsers: 'Всего пользователей:',
    showingUsers: 'Показано пользователей:',
    period: {
      day: 'День',
      week: 'Неделя',
      month: 'Месяц',
      total: 'Всего',
    },
  },

  balance: {
    current: (amount: number) => `💰 Ваш текущий баланс: ${amount} USDT`,
    history: '📊 История транзакций:',
    noTransactions: '📊 История транзакций пуста',
  },

  deposit: {
    title: '💳 Пополнение баланса',
    selectAmount: 'Выберите сумму для пополнения:',
    processing: '⏳ Обработка платежа...',
    address: (address: string) => `💳 Адрес для пополнения:\n\`${address}\``,
  },

  withdraw: {
    title: '💸 Вывод средств',
    enterAmount: 'Введите сумму для вывода:',
    enterAddress: 'Введите адрес кошелька:',
    processing: '⏳ Обработка вывода...',
  },
};
