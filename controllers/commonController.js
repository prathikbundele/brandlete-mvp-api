const UniversityRanking = require('../models/UniversityRanking');

exports.getUniversityList = async (req, res) => {
    try {
        const schools = await UniversityRanking.find();
        if (!schools) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(schools);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
}