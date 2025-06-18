import 'dotenv/config';

function isAuthorized(id) {
  const allowedUsers = JSON.parse(process.env.AUTHORIZED_USERS);
  return allowedUsers.includes(id.toString());
}

export function withAuth(handler) {
  return async (ctx, match) => {
    if (!isAuthorized(ctx.from.id)) {
      return await ctx.reply('¡Lo siento! No estás autorizado para usar este bot.');
    }
    return handler(ctx, match);
  };
}