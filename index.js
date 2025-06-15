import { Telegraf } from 'telegraf';

import dbConnect from './config/db.js';
import { COMMAND } from './constants/commands.js';
import { add } from './handlers/add.js';
import UserCollection from './queries/users.js';
import { setMessageReaction } from './utils/telegramApi.js';

await dbConnect();

const bot = new Telegraf(process.env.BOT_TOKEN);

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
  const commandInsertedByUser = await UserCollection.getCommandInserted(userId);

  if (commandInsertedByUser) {
    switch (commandInsertedByUser) {
      case COMMAND.ADD:
        await add(ctx);
        break;
      default:
      console.warn(`Unknown command: ${commandInsertedByUser}`);
    }

    await UserCollection.deleteCommandInserted(userId);
  } else {
    await ctx.reply(`Hola, recibí: ${ctx.message.text}`);
  }
});

// This is the entry point for the AWS Lambda function
export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body); // Telegram sends the update as JSON in the body
    await bot.handleUpdate(body);        // Telegraf processes the update
    return { statusCode: 200, body: '' }; // Return a 200 status code to Telegram
  } catch (err) {
    console.error('Error manejando el mensaje:', err);
    return { statusCode: 500, body: 'Error interno' };
  }
};
