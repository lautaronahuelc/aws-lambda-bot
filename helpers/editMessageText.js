export async function editMessageText({ ctx, chatId, lastMessageId, message, keyboard }) {
  try {
    if (chatId && lastMessageId) {
      await ctx.telegram.editMessageText(
        chatId,
        lastMessageId,
        undefined,
        message,
        { parse_mode: 'Markdown', ...keyboard }
      );
    } else {
      await ctx.editMessageText(message, { parse_mode: 'Markdown', ...keyboard });
    }
  } catch (err) {
    const desc = err.description || '';

    if (desc.includes('message is not modified')) {
      console.warn('🔁 Mensaje no modificado, se ignora');
      return;
    }

    if (desc.includes("message can't be edited")) {
      console.warn('🧯 No se puede editar el mensaje, se hace reply nuevo');
      await ctx.reply(message, { parse_mode: 'Markdown', ...keyboard });
      return;
    }

    console.error('❌ Error inesperado al editar mensaje:', err);
    throw err;
  }
}