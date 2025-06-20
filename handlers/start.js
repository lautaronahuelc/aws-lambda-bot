import { initialKeyboard } from '../constants/keyboards.js';
import UserCollection from '../queries/users.js';

export async function onStart(ctx) {
  const messageId = ctx.message.message_id;
  const userId = ctx.from.id.toString();

  // Reset user state
  await UserCollection.deleteCommandInserted(userId);
  await UserCollection.editLastMessageId(userId, messageId);

  await ctx.reply('Menú principal', initialKeyboard);
}