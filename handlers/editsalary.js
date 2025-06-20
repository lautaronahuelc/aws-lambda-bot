import { COMMAND } from '../constants/commands.js';
import { buildBackKeyboard, initialKeyboard } from '../constants/keyboards.js';
import { editMessageText } from '../helpers/editMessageText.js';
import { anyError } from '../helpers/error.js';
import UserCollection from '../queries/users.js';

export async function onEditSalary(ctx) {
  const userId = ctx.update.callback_query.from.id;    

  await editMessageText({
    ctx,
    message: '*Editar salario*\n\nIngrese el nuevo salario sin puntos ni comas.\nPor ejemplo: "1000000"',
    keyboard: buildBackKeyboard('editsalary'),
  });
  await UserCollection.editCommandInserted(userId, COMMAND.EDITSALARY);
}

export async function editSalary(ctx) {
  const chatId = ctx.chat.id;
  const messageId = ctx.message.message_id;
  const newSalary = parseInt(ctx.message.text);
  const userId = ctx.from.id;
  
  const { data: lastMessageId } = await UserCollection.getLastMessageId(userId);
  const { data, error } = await UserCollection.editSalary(userId, newSalary);

  if (error || !data) {
    await editMessageText({
      ctx,
      chatId,
      lastMessageId,
      message: '❌ _Error al actualizar su salario. Inténtelo nuevamente..._\n\n*Menú principal*\n\nSeleccione una opción:',
      keyboard: initialKeyboard,
    });
    return;
  }

  const upError = await updatePercentages();

  if (upError) {
    await editMessageText({
      ctx,
      chatId,
      lastMessageId,
      message: upError,
      keyboard: initialKeyboard,
    });
    return; 
  }

  await editMessageText({
    ctx,
    chatId,
    lastMessageId,
    message: '✅ _Su salario ha sido actualizado correctamente._\n\n*Menú principal*\n\nSeleccione una opción:',
    keyboard: initialKeyboard,
  });
  await ctx.telegram.deleteMessage(chatId, messageId);
}

async function updatePercentages() {
  const { data, error } = await UserCollection.getSalaries();

  if (error || !data.length) {
    return '❌ _Error al actualizar porcentaje de los usuarios. Inténtelo nuevamente más tarde._\n\n*Menú principal*\n\nSeleccione una opción:';
  }

  const totalIncome = data.reduce((acc, { salary }) => {
    return acc + salary;
  }, 0);

  const promises = data.map(({ salary, userId }) => {
    const newPercentage = (salary / totalIncome).toFixed(4);
    return UserCollection.updateContributionPercentage(userId, parseFloat(newPercentage));
  });
  
  const updatingPercentages = await Promise.all(promises);
  
  if (anyError(...updatingPercentages)) {
    return '❌ _Error al actualizar porcentaje de los usuarios. Intente nuevamente más tarde._\n\n*Menú principal*\n\nSeleccione una opción:';
  }
}