import { Telegraf } from 'telegraf';
import { COMMAND } from './constants/commands.js';
import { setMessageReaction } from './utils/telegramApi.js';

const bot = new Telegraf(process.env.BOT_TOKEN);
const waitingForUserResponse = new Map();

bot.command(COMMAND.ADD, async (ctx) => {
  const userId = ctx.from.id;

  await setMessageReaction(ctx, '👍');
  waitingForUserResponse.set(userId, COMMAND.ADD);
});


bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;
  const botIsWaitingForUserResponse = waitingForUserResponse.has(userId);

  if (botIsWaitingForUserResponse) {
    const typeOfResponseWaitedFor = waitingForUserResponse.get(userId);

    switch (typeOfResponseWaitedFor) {
      case COMMAND.ADD:
        await ctx.reply(`Entiendo, querés agregar: "${text}"`);
        break;
    }

    waitingForUserResponse.delete(userId);
  } else {
    await ctx.reply(`Hola, recibí: ${ctx.message.text}`);
  }
});

// Este es el "handler" que Lambda necesita
export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body); // Telegram manda el mensaje en el body del POST
    await bot.handleUpdate(body);        // Telegraf procesa ese mensaje
    return { statusCode: 200, body: '' }; // Devolvés 200 para decir "ok"
  } catch (err) {
    console.error('Error manejando el mensaje:', err);
    return { statusCode: 500, body: 'Error interno' };
  }
};
