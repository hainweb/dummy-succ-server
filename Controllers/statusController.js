const UserModel = require('../modals/userModel');
const expressAsyncHandler = require('express-async-handler');

// Update Status
const updateStatusController = expressAsyncHandler(async (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    res.status(400);
    throw new Error('User ID and status are required');
  }

  const user = await UserModel.findByIdAndUpdate(userId, { status }, { new: true });
  if (user) {
    res.status(200).json({ message: 'Status updated', user });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  updateStatusController,
};
