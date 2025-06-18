import { COMMAND } from '../constants/commands.js';
import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { sleep } from '../utils/sleep.js';
import { setMessageReaction } from '../utils/telegramApi.js';

export async function onAdd(ctx) {
  const messageId = ctx.message.message_id;
  const userId = ctx.from.id;

  await setMessageReaction(ctx, '👍');
  await UserCollection.editLastMessageId(userId, messageId);
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
    await setMessageReaction(ctx, '🤬');
    
    await sleep(1500);
    ctx.telegram.deleteMessage(chatId, lastMessageId);
    ctx.telegram.deleteMessage(chatId, messageId);
    
    return;
  }

  const { error: neError } = await ExpenseCollection.create({
    amount,
    desc,
    userId,
    username
  });

  if (neError) {
    await ctx.replay('❌ Ocurrió un error al agregar el gasto.');
    return;
  }

  const { error: iteError } = await UserCollection.incrementTotalExpenses(userId, amount);

  if (iteError) {
    await ctx.replay('❌ Ocurrió un error al actualizar los gastos totales. Eliminar el último gasto ingresado para evitar errores de cálculo.');
    return;
  }

  await setMessageReaction(ctx, '👍');

  await sleep(1500);
  ctx.telegram.deleteMessage(chatId, lastMessageId);
  ctx.telegram.deleteMessage(chatId, messageId);
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
