import Expense from '../models/expenses.js';

async function create({
  amount,
  desc,
  userId,
  username,
}) {
  try {
    await new Expense({
      amount,
      desc,
      userId,
      username,
    }).save();
    return { error: false };
  } catch (err) {
    console.error('❌ Error adding new expense:', err);
    return { error: true };
  }
}

const ExpenseCollection = {
  create,
};

export default ExpenseCollection;