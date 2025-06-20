import ExpenseCollection from '../queries/expenses.js';
import { formatExpenseText } from '../helpers/expenses.js';
import { buildBackKeyboard } from '../constants/keyboards.js';

export async function onList(ctx) {
  const { data, error } = await ExpenseCollection.getAll();

  if (!data.length) {
    await ctx.editMessageText('Menu principal\n\nNo se encontraron gastos', initialKeyboard);
    return;
  }

  if (error) {
    await ctx.editMessageText('Menu principal\n\nError al obtener los gastos', initialKeyboard);
    return;
  }
  
  const message = buildMessage(data);
  await ctx.editMessageText(message, { parse_mode: 'Markdown', ...buildBackKeyboard('list')});
}

function buildMessage(data) {
  const sortedExpenses = data.sort((a, b) => a.date - b.date);
  
  const groupedExpenses = sortedExpenses.reduce((grouped, { username, amount, desc }) => {
    if (!grouped[username]) grouped[username] = [];
    grouped[username].push(formatExpenseText(amount, desc));
    return grouped;
  }, {});

  let message = 'Menu principal > list\n\n';

  for (const user in groupedExpenses) {
    message += `*Gastos de ${user}*\n${groupedExpenses[user].join('\n')}\n\n`;
  }

  return message;
}