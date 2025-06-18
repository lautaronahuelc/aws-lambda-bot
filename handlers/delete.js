import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { formatExpenseText } from '../helpers/expenses.js';
import { setMessageReaction } from '../utils/telegramApi.js';
import { COMMAND } from '../constants/commands.js';

export async function onDelete(ctx) {
  const messageId = ctx.message.message_id;
  const userId = ctx.from.id;

  await setMessageReaction(ctx, '👍');
  await UserCollection.editLastMessageId(userId, messageId);
  await UserCollection.editCommandInserted(userId, COMMAND.DELETE);

  const { data, error } = await ExpenseCollection.getAll(userId);

  if (!data.length) {
    await setMessageReaction(ctx, '🤔');
    return;
  }

  if (error) {
    await ctx.reply('❌ Ocurrió un error al obtener los gastos.');
    return;
  }

  const inlineKeyboard = buildInlineKeyboard(data);
  await ctx.reply('Seleccione el gasto a eliminar.', {
    reply_markup: { inline_keyboard: inlineKeyboard },
  });
}

function buildInlineKeyboard(data) {
  const sortedExpenses = data.sort((a, b) => a.date - b.date);
  const expensesKeyboard = sortedExpenses.map(({ amount, desc, id }) => {
    return [
      {
        text: formatExpenseText(amount, desc).replaceAll('_', ''),
        callback_data: `delete_${id}`,
      },
    ];
  });
  expensesKeyboard.push([
    {
      text: 'Cancelar',
      callback_data: 'delete_cancel',
    },
  ]);
  return expensesKeyboard;
}

export async function deleteExpense(callbackQuery) {
  switch (callbackQuery.data) {
    case 'delete_cancel':
      await handleDeleteCancel(callbackQuery);
      break;
    default:
      await handleDeleteConfirm(callbackQuery); 
  }
}

async function handleDeleteCancel(callbackQuery) {
  return;
}

async function handleDeleteConfirm(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const id = callbackQuery.data.replace('delete_', '');

  const { data: rData, error: rError } = await ExpenseCollection.remove(id);

  if (rError) {
    await sendMessage(chatId, '❌ Ocurrió un error al eliminar el gasto.');
    return;
  }

  const { amount, desc } = rData;

  const { error: iteError } = await UserCollection.incrementTotalExpenses(userId, -amount);

  if (iteError) {
    await sendMessage(
      chatId,
      `❌ Ocurrió un error al actualizar los gastos totales. Agregar el gasto eliminado para evitar errores de cálculo.\n\n*Gasto elminado*\n${formatExpenseText(amount, desc)}`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  // await reactToMessage(chatId, messageId, '👍');
}

