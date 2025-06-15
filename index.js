import { createBot } from './bot.js';
import dbConnect from './config/db.js';

await dbConnect();

const bot = createBot();
bot.launch();

console.log('🤖 Bot corriendo en local');