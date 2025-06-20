import 'dotenv/config';
import { Telegraf } from 'telegraf';

import { COMMANDLIST } from './constants/commands.js';
import { registerHandlers } from './handlers/index.js';

export function createBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.telegram.setMyCommands(COMMANDLIST.map(({ name, desc }) => ({
    command: name,
    description: desc,
  })));

  registerHandlers(bot);

  return bot;
}