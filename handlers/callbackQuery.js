import UserCollection from '../queries/users.js';
import { sleep } from '../utils/sleep.js';
import { setMessageReaction } from '../utils/telegramApi.js';
import { deleteExpense } from './delete.js';

export async function onCallbackQuery(ctx) {
  const chatId = ctx.update.callback_query.message.chat.id;
  const messageId = ctx.update.callback_query.message.message_id;
  const data = ctx.update.callback_query.data;

  const { data: lastMessageId } = await UserCollection.getLastMessageId(chatId);
  
  if (data.startsWith('delete_')) await deleteExpense(ctx);

  await ctx.editMessageReplyMarkup();
  await ctx.telegram.deleteMessage(chatId, messageId);
  await setMessageReaction({
    telegram: ctx.telegram,
    chat: { id: chatId },
    message: { message_id: lastMessageId },
  }, '👍');
  ctx.telegram.deleteMessage(chatId, lastMessageId);

  // Importante: responder al callback para evitar spinner infinito
  switch (data) {
    case 'delete_cancel':
      ctx.answerCbQuery('Operación cancelada ❌');
      break;
    default:
      ctx.answerCbQuery('Gasto eliminado ✅');
  }

  await UserCollection.deleteCommandInserted(chatId);
  await UserCollection.deleteLastMessageId(chatId);
}