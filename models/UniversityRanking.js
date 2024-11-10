const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UniversityRankingSchema = mongoose.Schema({
    school_name : {type : String},
    rank : {type : Number}
},{
    timestamp : true
})

const UniversityRanking = mongoose.model('University', UniversityRankingSchema, 'university_rankings');
module.exports = UniversityRanking;