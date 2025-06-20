import { parse } from 'dotenv';
import { COMMAND } from '../constants/commands.js';
import { buildBackKeyboard, initialKeyboard } from '../constants/keyboards.js';
import { editMessageText } from '../helpers/editMessageText.js';
import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';

export async function onAdd(ctx) {
  const userId = ctx.update.callback_query.from.id;
  
  await editMessageText({
    ctx,
    message: '*Nuevo gasto*\n\nIngrese el nuevo gasto.\nPor ejemplo: "7000 huevos"',
    keyboard: buildBackKeyboard('add'),
  });
  await UserCollection.editCommandInserted(userId, COMMAND.ADD);
}

export async function addExpense(ctx) {
  const chatId = ctx.chat.id;
  const messageId = ctx.message.message_id;
  const userId = ctx.from.id;
  const username = ctx.from.username;

  const { data: lastMessageId } = await UserCollection.getLastMessageId(userId);

  const { amount , desc } = getAmountAndDesc(ctx.message.text); 

  if (!amount || !desc) {
    await ctx.telegram.deleteMessage(chatId, messageId);
    await editMessageText({
      ctx,
      chatId,
      lastMessageId,
      message: '❌ _Error en formato. Inténtelo nuevamente..._\n\n*Menú principal*\n\nSeleccione una opción:',
      keyboard: initialKeyboard,
    });
    return;
  }

  const { error: neError } = await ExpenseCollection.create({
    amount,
    desc,
    userId,
    username
  });

  if (neError) {
    await editMessageText({
      ctx,
      chatId,
      lastMessageId,
      message: '❌ _Error al agregar el gasto. Inténtelo nuevamente..._\n\n*Menú principal*\n\nSeleccione una opción:',
      keyboard: initialKeyboard,
    });
    return;
  }

  const { error: iteError } = await UserCollection.incrementTotalExpenses(userId, amount);

  if (iteError) {
    await editMessageText({
      ctx,
      chatId,
      lastMessageId,
      message: '⚠️ _Error al actualizar los gastos totales._\n\n*Menú principal*\n\nSeleccione una opción:',
      keyboard: initialKeyboard,
    });
    return;
  }

  await editMessageText({
    ctx,
    chatId,
    lastMessageId,
    message: '✅ _Nuevo gasto registrado con éxito._\n\n*Menú principal*\n\nSeleccione una opción:',
    keyboard: initialKeyboard,
  });

  await ctx.telegram.deleteMessage(chatId, messageId);
}

function getAmountAndDesc(text) {
  const match = text.match(/^(\d+)\s+(.+)/);

  if (!match) {
    return { amount: null, desc: null };
  }
  
  const amount = parseInt(match[1]);
  const desc = match[2];
  
  return { amount, desc };
}
