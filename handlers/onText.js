import { COMMAND } from '../constants/commands.js';
import UserCollection from '../queries/users.js';
import { addExpense } from './add.js';

export async function onText(ctx) {
  const userId = ctx.from.id;

  // Check if bot is waiting for a response from the user
  const { data: commandInserted } = await UserCollection.getCommandInserted(userId);

  if (commandInserted) {
    switch (commandInserted) {
      case COMMAND.ADD:
        await addExpense(ctx);
        break;
      default:
      console.warn(`Unknown command: ${commandInserted}`);
    }

    await UserCollection.deleteCommandInserted(userId);
    await UserCollection.deleteLastMessageId(userId);
  }
}