import UserCollection from '../queries/users.js';
import { goBackToMainMenu } from '../utils/goBackToMainMenu.js';
import { setMessageReaction } from '../utils/telegramApi.js';
import { onAdd } from './add.js';
import { deleteExpense, onDelete } from './delete.js';
import { onList } from './list.js';

export async function onCallbackQuery(ctx) {
  const chatId = ctx.update.callback_query.message.chat.id;
  const messageId = ctx.update.callback_query.message.message_id;
  const data = ctx.update.callback_query.data;

  if (data.startsWith('delete_by_id_')) {
    await deleteExpense(ctx);
    return;
  };
  
  switch(data) {
    case 'add':
      onAdd(ctx);
      break;
    case 'list':
      onList(ctx);
      break;
    case 'delete':
      onDelete(ctx);
      break;
    case 'add_goback':
    case 'list_goback':
    case 'delete_goback':
    default:
      goBackToMainMenu(ctx);
  }

/*   const { data: lastMessageId } = await UserCollection.getLastMessageId(chatId);
  
  if (data.startsWith('delete_')) await deleteExpense(ctx);

  await ctx.editMessageReplyMarkup();
  await ctx.telegram.deleteMessage(chatId, messageId);
  await setMessageReaction({
    telegram: ctx.telegram,
    chat: { id: chatId },
    message: { message_id: lastMessageId },
  }, '👍');
  ctx.telegram.deleteMessage(chatId, lastMessageId); */

  // Importante: responder al callback para evitar spinner infinito
/*   switch (data) {
    case 'delete_cancel':
      ctx.answerCbQuery('Operación cancelada ❌');
      break;
    default:
      ctx.answerCbQuery('Gasto eliminado ✅');
  }

  await UserCollection.deleteCommandInserted(chatId);
  await UserCollection.deleteLastMessageId(chatId); */
}