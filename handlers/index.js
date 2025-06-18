import { COMMAND } from '../constants/commands.js';
import { withAuth } from '../helpers/auth.js';
import UserCollection from '../queries/users.js';
import { addExpense, onAdd } from './add.js';
import { onDelete } from './delete.js';

export function registerHandlers(bot) {
  bot.start((ctx) => ctx.reply('¡Bienvenido!'));

  bot.command(COMMAND.ADD, withAuth(onAdd));
  bot.command(COMMAND.DELETE, withAuth(onDelete));

  bot.on('text', async (ctx) => {
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
  });
}