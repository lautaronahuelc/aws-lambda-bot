import { initialKeyboard } from '../constants/keyboards.js';
import UserCollection from '../queries/users.js';

export async function onStart(ctx) {
  const userId = ctx.from.id.toString();

  // Reset user state
  await UserCollection.deleteCommandInserted(userId);
  
  const sentMessage = await ctx.reply(
    '*Menú principal*\n\nSeleccione una opción:',
    { parse_mode: 'Markdown', ...initialKeyboard }
  );
  
  await UserCollection.editLastMessageId(userId, sentMessage.message_id);
}