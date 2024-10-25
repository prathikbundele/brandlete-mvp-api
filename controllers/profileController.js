const User = require('../models/User');

// Update Profile
exports.updateProfile = async (req, res) => {
  const { phone, address, testScore } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user's profile details
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.testScore = testScore || user.testScore;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {

  console.log("req recieved : ", req)
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log("returning user", user)
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Save personal details
exports.savePersonalDetails = async (req, res) => {
  try {
    const { phone, address, dob } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.personalDetails = { phone, address, dob };
    await user.save();

    res.status(200).json({ message: 'Personal details saved', user });
  } catch (error) {
    res.status(500).json({ message: 'Error saving personal details', error: error.message });
  }
};

// Save athletic details
exports.saveAthleticDetails = async (req, res) => {
  try {
    const { sportName, position, achievements } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.athleticDetails = { sportName, position, achievements };
    await user.save();

    res.status(200).json({ message: 'Athletic details saved', user });
  } catch (error) {
    res.status(500).json({ message: 'Error saving athletic details', error: error.message });
  }
};

// Save academic details
exports.saveAcademicDetails = async (req, res) => {
  try {
    const { degree, major, gpa } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.academicDetails = { degree, major, gpa };
    await user.save();

    res.status(200).json({ message: 'Academic details saved', user });
  } catch (error) {
    res.status(500).json({ message: 'Error saving academic details', error: error.message });
  }
};

exports.updateUserDetails = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOneAndUpdate({ email }, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
}

