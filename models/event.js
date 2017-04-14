var mongoose = require('mongoose');
var Schema = mongoose.Schema;

eventSchema = new Schema({
	activity:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activities',
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
  }, {
      timestamps: true //create and fill fields createdAt and updatedAt
});

var Events = mongoose.model('events', eventSchema);

module.exports = Events;