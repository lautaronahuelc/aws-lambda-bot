import { initialKeyboard } from '../constants/keyboards.js';
import { editMessageText } from '../helpers/editMessageText.js';
import UserCollection from '../queries/users.js';

export async function goBackToMainMenu(ctx) {
  const userId = ctx.update.callback_query.from.id;

  // Reset user state
  await UserCollection.deleteCommandInserted(userId);
  await editMessageText({
    ctx,
    message: '*Menú principal*\n\nSeleccione una opción:',
    keyboard: initialKeyboard,
  });
}