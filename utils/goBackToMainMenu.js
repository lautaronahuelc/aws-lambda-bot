import { initialKeyboard } from '../constants/keyboards.js';
import UserCollection from '../queries/users.js';

export async function goBackToMainMenu(ctx) {
  const userId = ctx.update.callback_query.from.id;

  // Reset user state
  await UserCollection.deleteCommandInserted(userId);
  await ctx.editMessageText('Menu principal', initialKeyboard);
}