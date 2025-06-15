import { COMMAND } from '../constants/commands.js';
import UserCollection from '../queries/users.js';
import { setMessageReaction } from '../utils/telegramApi.js';
import { add } from './add.js';

export function registerHandlers(bot) {
  bot.start((ctx) => ctx.reply('¡Bienvenido!'));

  bot.command(COMMAND.ADD, async (ctx) => {
    const userId = ctx.from.id;
    const messageId = ctx.message.message_id;
    
    await setMessageReaction(ctx, '👍');
    await UserCollection.editLastMessageId(userId, messageId);
    await UserCollection.editCommandInserted(userId, COMMAND.ADD)
  });

  bot.on('text', async (ctx) => {
    const userId = ctx.from.id;

    // Check if bot is waiting for a response from the user
    const { data: commandInserted } = await UserCollection.getCommandInserted(userId);

    if (commandInserted) {
      switch (commandInserted) {
        case COMMAND.ADD:
          await add(ctx);
          break;
        default:
        console.warn(`Unknown command: ${commandInserted}`);
      }

      await UserCollection.deleteCommandInserted(userId);
      await UserCollection.deleteLastMessageId(userId);
    } else {
      await ctx.reply(`Hola, recibí: ${ctx.message.text}`);
    }
  });
}