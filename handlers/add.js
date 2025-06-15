import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { setMessageReaction } from '../utils/telegramApi.js';

export async function add(ctx) {
  const chatId = ctx.chat.id;
  const messageId = ctx.message.message_id;
  const userId = ctx.from.id;
  const username = ctx.from.username;

  const { data: lastMessageId } = await UserCollection.getLastMessageId(userId);

  const { amount , desc } = getAmountAndDesc(ctx.message.text); 

  if (!amount || !desc) {
    await setMessageReaction(ctx, '🤬');
    
    setTimeout(() => {
      ctx.telegram.deleteMessage(chatId, messageId);
      ctx.telegram.deleteMessage(chatId, lastMessageId);
    }, 1500);
    
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

  setTimeout(() => {
    ctx.telegram.deleteMessage(chatId, messageId);
    ctx.telegram.deleteMessage(chatId, lastMessageId);
  }, 1500);
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
