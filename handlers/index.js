import { COMMAND } from '../constants/commands.js';
import { withAuth } from '../helpers/auth.js';
import { onAdd } from './add.js';
import { onCallbackQuery } from './callbackQuery.js';
import { onDelete } from './delete.js';
import { onText } from './onText.js';

export function registerHandlers(bot) {
  bot.start((ctx) => ctx.reply('¡Bienvenido!'));

  bot.command(COMMAND.ADD, withAuth(onAdd));
  bot.command(COMMAND.DELETE, withAuth(onDelete));

  bot.on('text', withAuth(onText));
  bot.on('callback_query', withAuth(onCallbackQuery));
}