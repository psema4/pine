var mongoose = require('mongoose');

var AchievementSchema = new mongoose.Schema({
  title: String
  ,slug: String
  ,description: String
  ,display: Number
  ,icon: String
  ,status : {
    progress: Number
    ,goal: Number
  }
});

var Achievement = mongoose.model('Achievement', AchievementSchema);

// Increment an achievement
exports.incr = function (game_id, achieve_id, amount) {
  Achievement.findOne({slug: achieve_id}, function (err, doc) {
    doc.status.progress++;
    doc.save();
  });
};