import { goBackToMainMenu } from '../utils/goBackToMainMenu.js';
import { onAdd } from './add.js';
import { onCalculate } from './calculate.js';
import { deleteExpense, onDelete } from './delete.js';
import { onEditSalary } from './editsalary.js';
import { onList } from './list.js';
import { onShowUserDetails } from './showuserdetails.js';

export async function onCallbackQuery(ctx) {
  const data = ctx.update.callback_query.data;

  if (data.startsWith('delete_by_id_')) {
    await deleteExpense(ctx);
    return;
  };
  
  switch(data) {
    case 'add':
      onAdd(ctx);
      break;
    case 'list':
      onList(ctx);
      break;
    case 'delete':
      onDelete(ctx);
      break;
    case 'showuserdetails':
      onShowUserDetails(ctx);
      break;
    case 'editsalary':
      onEditSalary(ctx);
      break;
    case 'calculate':
      onCalculate(ctx);
      break;
    case 'add_goback':
    case 'list_goback':
    case 'delete_goback':
    case 'showuserdetails_goback':
    case 'editsalary_goback':
    case 'calculate_goback':
    default:
      goBackToMainMenu(ctx);
  }
}