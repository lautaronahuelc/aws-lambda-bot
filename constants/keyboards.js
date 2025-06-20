export const initialKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Nuevo gasto', callback_data: 'add' },
        { text: 'Ver gastos', callback_data: 'list' },
      ],
      [
        { text: 'Eliminar uno', callback_data: 'delete' },
        { text: 'Ver usuarios', callback_data: 'showuserdetails' },
      ],
      [
        { text: 'Editar salario', callback_data: 'editsalary' },
        { text: 'Cierre', callback_data: 'calculate' },
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