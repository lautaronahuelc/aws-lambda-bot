export const COMMAND = {
  ADD: 'add',
  DELETE: 'delete',
  LIST: 'list',
  START: 'start',
};

export const COMMANDLIST = [
  { name: COMMAND.ADD, desc: 'Agregar un gasto' },
  { name: COMMAND.LIST, desc: 'Listar todos los gastos' },
  { name: COMMAND.DELETE, desc: 'Eliminar un gasto' },
  { name: COMMAND.START, desc: 'Iniciar el bot' },
];