export async function setMessageReaction(ctx, emoji) {
  await ctx.telegram.callApi('setMessageReaction', {
    chat_id: ctx.chat.id,
    message_id: ctx.message.message_id,
    reaction: emoji ? [{ type: 'emoji', emoji }] : [],
  });
}