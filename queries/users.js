import User from '../models/users.js';

async function deleteCommandInserted(userId) {
  try {
    const data = await User.findOneAndUpdate(
      { userId },
      { commandInserted: '' },
      { new: true }
    );

    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error deleting commandInserted:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function deleteLastMessageId(userId) {
  try {
    const data = await User.findOneAndUpdate(
      { userId },
      { lastMessageId: '' },
      { new: true }
    );

    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error deleting lastMessageId:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function editCommandInserted(userId, commandInserted) {
  try {
    const data = await User.findOneAndUpdate({ userId }, { commandInserted }, { new: true });
    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error editing salary:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function editLastMessageId(userId, lastMessageId) {
  try {
    const data = await User.findOneAndUpdate(
      { userId },
      { lastMessageId },
      { new: true }
    );

    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error editing lastMessageId:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function getCommandInserted(userId) {
  try {
    const { commandInserted } = await User.findOne({ userId }, 'commandInserted');
    return {
      data: commandInserted,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error getting commandInserted:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function getLastMessageId(userId) {
  try {
    const { lastMessageId } = await User.findOne({ userId }, 'lastMessageId');

    return {
      data: lastMessageId,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error getting lastMessageId:', err);
    return {
      data: null,
      error: true,
    };
  }
}


async function incrementTotalExpenses(userId, amount) {
  try {
    const data = await User.updateOne(
      { userId },
      { $inc: { totalExpenses: amount } }
    );

    if (data.modifiedCount === 0) return { error: true };
    
    return { error: false };
  } catch (err) {
    console.error('❌ Error incrementing totalExpenses:', err);
    return { error: true };
  }
}

const UserCollection = {
  deleteCommandInserted,
  deleteLastMessageId,
  editCommandInserted,
  editLastMessageId,
  getCommandInserted,
  getLastMessageId,
  incrementTotalExpenses,
};

export default UserCollection;