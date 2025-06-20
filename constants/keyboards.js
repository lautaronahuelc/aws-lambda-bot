export const initialKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'add', callback_data: 'add' },
        { text: 'list', callback_data: 'list' },
      ],
      [
        { text: 'delete', callback_data: 'delete' },
        { text: 'userdetails', callback_data: 'showuserdetails' },
      ],
      [
        { text: 'editsalary', callback_data: 'editsalary' },
        { text: 'calculate', callback_data: 'calculate' },
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