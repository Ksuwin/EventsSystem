var mongoose = require('mongoose');
var Schema = mongoose.Schema;

activitySchema = new Schema({
    description: {
        type: String,
        required: true,
        unique: true
    }
  }, {
      timestamps: true //create and fill fields createdAt and updatedAt
});

var Activities = mongoose.model('activities', activitySchema);

module.exports = Activities;