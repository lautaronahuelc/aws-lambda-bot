import { buildBackKeyboard, initialKeyboard } from '../constants/keyboards.js';
import { formatCurrency } from '../helpers/currency.js';
import { editMessageText } from '../helpers/editMessageText.js';
import UserCollection from '../queries/users.js';

export async function onShowUserDetails(ctx) {
  const { data, error } = await UserCollection.getAll();

  if (error || !data.length) {
    await editMessageText({
      ctx,
      message: '❌ _Error al obtener información de los usuarios._\n\n*Menú principal*\n\nSeleccione una opción:',
      keyboard: initialKeyboard,
    });
    return;
  }

  const message = buildMessage(data);
  await editMessageText({
    ctx,
    message,
    keyboard: buildBackKeyboard('showuserdetails'),
  });
}

function buildMessage(data) {
  let message = '*Detalles de los usuarios*\n\n';
  
  for (const user of data) {
    for (const key of Object.keys(user._doc)) {
      if (!formatKey[key] || !formatValue[key]) {
        continue; // Skip keys that are not in formatKey or formatValue
      }
      message += `${formatKey[key]}: ${formatValue[key](user[key])}\n`;
    }
    message += '\n';
  }

  return message;
}

const formatKey = {
  'username': 'Nombre',
  'salary': 'Ingresos',
  'totalExpenses': 'Gasto total',
  'contributionPercentage': 'Contribución',
  'amountDueToUser': 'Le deben',
};

const formatValue = {
  'username': (value) => `*${value}*`,
  'salary': (value) => formatCurrency(value),
  'totalExpenses': (value) => formatCurrency(value),
  'contributionPercentage': (value) => formatPercentage(value),
  'amountDueToUser': (value) => formatCurrency(value),
};

function formatPercentage(value) {
  return value.toLocaleString("es-AR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}