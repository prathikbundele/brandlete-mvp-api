const axios = require('axios');
const User = require('../models/User');
const UniversityRanking = require('../models/UniversityRanking');

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

  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePicture = req.file.path; // Save the file path to the user's profile picture field
    await user.save();

    res.status(200).json({ message: 'Profile picture uploaded successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile picture', error });
  }
};

// Get user profile picture
exports.getUserProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user || !user.profilePicture) return res.status(404).json({ message: 'Profile picture not found' });

    res.status(200).json({ profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile picture', error });
  }
};

exports.getUserScores = async (req, res) => {
  const email = req.params.email;
  try {
    // Fetch the user by ID
    const user = await User.findOne({email}).select('academicDetails athleticDetails');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Structure the response data
    const response = {
      academicDetails: user.academicDetails || {},
      athleticDetails: user.athleticDetails || {},
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'An error occurred while fetching scores.');
  }
};

exports.getRefreshedBasicSocialDetails = async (req, res) => {
  const email = req.query.email;
  const igHandle = req.query.username;
  const basicApiUrl = process.env.SOCIAL_SANDBOX_API_URL + "/v1/social/creators/profiles";
  
  try{
    const response = await axios.get(basicApiUrl, {
      headers: {
        'Authorization': `Basic ${process.env.SOCIAL_SANDBOX_API_TOKEN}`, 
        'Content-Type': 'application/json',
      },
      params: {
        identifier: igHandle,
        work_platform_id: process.env.INSTAGRAM_PLATFORM_ID,
      },
    });
    const socialDetails = {
      followers : response.data.follower_count,
    }
    const user = await User.findOneAndUpdate({ email }, {socialDetails} , { new: true });
    res.status(200).json(response.data);
  }catch(error){
    console.error('Error fetching data from external API:', error.message);

    // Handle errors and send an appropriate response
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to fetch data from external API',
    });
  }
}

exports.getRefreshedPublicProfileAnalytics = async (req, res) => {
  const email = req.query.email;
  const igHandle = req.query.username;
  const basicApiUrl = process.env.SOCIAL_SANDBOX_API_URL + "/v1/social/creators/profiles/analytics"
  try{
    const response = await axios.post(basicApiUrl, {
      identifier: igHandle,
      work_platform_id: process.env.INSTAGRAM_PLATFORM_ID,
    },{
      headers: {
        'Authorization': `Basic ${process.env.SOCIAL_SANDBOX_API_TOKEN}`, 
        'Content-Type': 'application/json',
      }
    });
    const socialDetails = {
      followers : response.data.profile.follower_count,
      engagement :  response.data.profile.engagement_rate
    }
   const user = await User.findOneAndUpdate({ email }, {socialDetails} , { new: true });
    res.status(200).json(response.data);
  }catch(error){
    console.error('Error fetching data from external API:', error.message);

    // Handle errors and send an appropriate response
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to fetch data from external API',
    });
  }

}


