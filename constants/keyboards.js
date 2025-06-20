export const initialKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'list', callback_data: 'list' },
        { text: 'add', callback_data: 'add' },
        { text: 'delete', callback_data: 'delete' },
      ],
    ]
  }
}

export function buildBackKeyboard(from) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '< Volver', callback_data: `${from}_goback` }],
      ]
    }
  };
}