import ExpenseCollection from '../queries/expenses.js';
import { formatExpenseText } from '../helpers/expenses.js';
import { buildBackKeyboard, initialKeyboard } from '../constants/keyboards.js';
import { editMessageText } from '../helpers/editMessageText.js';

export async function onList(ctx) {
  const { data, error } = await ExpenseCollection.getAll();

  if (!data.length) {
    await editMessageText({
      ctx,
      message: '👀 _No hay gastos registrados._\n\n*Menu principal*\n\nSeleccione una opción:',
      config: { parse_mode: 'Markdown', ...initialKeyboard },
    });
    return;
  }

  if (error) {
    await editMessageText({
      ctx,
      message: '❌ _Error al obtener los gastos._\n\n*Menu principal*\n\nSeleccione una opción:',
      config: { parse_mode: 'Markdown', ...initialKeyboard },
    });
    return;
  }
  
  const message = buildMessage(data);
  await editMessageText({
    ctx,
    message,
    config: { parse_mode: 'Markdown', ...buildBackKeyboard('list')},
  });
}

function buildMessage(data) {
  const sortedExpenses = data.sort((a, b) => a.date - b.date);
  
  const groupedExpenses = sortedExpenses.reduce((grouped, { username, amount, desc }) => {
    if (!grouped[username]) grouped[username] = [];
    grouped[username].push(formatExpenseText(amount, desc));
    return grouped;
  }, {});

  let message = '*Gastos registrados\n\n*';

  for (const user in groupedExpenses) {
    message += `*${user}*\n${groupedExpenses[user].join('\n')}\n\n`;
  }

  return message;
}