import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { formatExpenseText } from '../helpers/expenses.js';
import { initialKeyboard } from '../constants/keyboards.js';

export async function onDelete(ctx) {
  const userId = ctx.update.callback_query.from.id;

  const { data, error } = await ExpenseCollection.getAll(userId);

  if (!data.length) {
    await ctx.editMessageText('Menu principal\n\nNo se encontraron gastos', initialKeyboard);
    return;
  }

  if (error) {
    await ctx.editMessageText('Menu principal\n\nError al obtener los gastos', initialKeyboard);
    return;
  }

  const inlineKeyboard = buildInlineKeyboard(data);
  await ctx.editMessageText(
    'Menu principal > delete\n\nSelecccione el gasto que desea eliminar',
    { reply_markup: { inline_keyboard: inlineKeyboard } }
  );
}

function buildInlineKeyboard(data) {
  const sortedExpenses = data.sort((a, b) => a.date - b.date);
  const expensesKeyboard = [];

  for (let i = 0; i < sortedExpenses.length; i += 2) {
    const row = [];

    const exp1 = sortedExpenses[i];
    row.push({
      text: formatExpenseText(exp1.amount, exp1.desc).replaceAll('_', ''),
      callback_data: `delete_by_id_${exp1.id}`,
    });

    const exp2 = sortedExpenses[i + 1];
    if (exp2) {
      row.push({
        text: formatExpenseText(exp2.amount, exp2.desc).replaceAll('_', ''),
        callback_data: `delete_by_id_${exp2.id}`,
      });
    }

    expensesKeyboard.push(row);
  }

  expensesKeyboard.push([
    {
      text: '< Volver',
      callback_data: 'delete_goback',
    },
  ]);

  return expensesKeyboard;
}

export async function deleteExpense(ctx) {
  const userId = ctx.update.callback_query.from.id;
  const id = ctx.update.callback_query.data.replace('delete_by_id_', '');


  const { data: rData, error: rError } = await ExpenseCollection.remove(id);

  if (rError) {
    await ctx.editMessageText('Menu principal\n\nError al eliminar el gasto. Inténtelo nuevamente...', initialKeyboard);
    return;
  }

  const { amount, desc } = rData;

  const { error: iteError } = await UserCollection.incrementTotalExpenses(userId, -amount);

  if (iteError) {
    const message = `Menu principal\n\nError al actualizar los gastos totales. Agregar el gasto eliminado para evitar errores de cálculo.\n\n*Gasto elminado*\n${formatExpenseText(amount, desc)}`
    await ctx.editMessageText(message, { ...initialKeyboard, parse_mode: 'Markdown' });
    return;
  }

  await ctx.editMessageText('Menu principal\n\n✅ Gasto eliminado con éxito', initialKeyboard);
}

