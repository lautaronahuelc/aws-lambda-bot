import { withAuth } from '../helpers/auth.js';
import { onCallbackQuery } from './callbackQuery.js';
import { onStart } from './start.js';
import { onText } from './text.js';

export function registerHandlers(bot) {
  bot.start(withAuth(onStart));
  bot.on('text', withAuth(onText));
  bot.on('callback_query', withAuth(onCallbackQuery));
}