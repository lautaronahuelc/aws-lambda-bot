import { Telegraf } from 'telegraf';
import { registerHandlers } from './handlers/index.js';
import 'dotenv/config';

export function createBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  registerHandlers(bot);

  return bot;
}