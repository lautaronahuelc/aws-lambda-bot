import { createBot } from './bot.js';
import dbConnect from './config/db.js';

let bot;

export const handler = async (event) => {
  try {
    await dbConnect();
  
    if (!bot) {
      bot = createBot();
    }

    const body = JSON.parse(event.body);
    await bot.handleUpdate(body);

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('❌ Error al procesar update', err);
    return { statusCode: 500, body: 'Error' };
  }
};
