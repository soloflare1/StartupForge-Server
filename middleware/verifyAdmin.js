const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
  const email = req.user?.email;
  const user = await User.findOne({ email });

  if (!user || user.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden Access - Admin Only' });
  }
  next();
};

module.exports = verifyAdmin;