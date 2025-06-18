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

async function getAll(userId) {
  try {
    const data = await Expense.find(userId ? { userId } : {}).sort({ date: -1 });
    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error loading expenses:', err);
    return {
      data: null,
      error: true,
    };
  }
}

const ExpenseCollection = {
  create,
  getAll,
};

export default ExpenseCollection;