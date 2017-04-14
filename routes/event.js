var express = require('express');
var mongoose = require('mongoose');
var events = require('../models/event');
var activities = require('../models/activity');
var bodyParser = require('body-parser');
var moment = require('moment');

var eventRouter = express.Router();
eventRouter.use(bodyParser.json());

eventRouter.route('/')
.get(function (req, res, next) {
    events.find({}).sort({startDateTime: 1})
      .populate(['activity'])
      .exec(function (err, events) {
        var result = events.map(function(event) {
        	                return {
        	                	       id: event._id, 
        	                	       activity: event.activity.description,
                                   isActive: event.isActive,
                                   date: moment(event.startDateTime).format('dddd MMMM Do, YYYY'),
                                   time: moment(event.startDateTime).format('h:mm A') + ' - ' + moment(event.endDateTime).format('h:mm A'),
        	                	       createdAt: moment(event.createdAt).format('MMMM Do YYYY, h:mm:ss A'),
                                   updatedAt: moment(event.updatedAt).format('MMMM Do YYYY, h:mm:ss A') 
        	                       }
                           } 
        )	
      	res.render("index", {the_title: "Events", current:1, events:result, error:err});     
    })
});

eventRouter.route('/week')
.get(function (req, res, next) {
    var startWeekDay = moment().startOf('week').add(1, 'days'),
        endWeekDay = moment().endOf('week').add(1, 'days');

    events.find({startDateTime: {$gt: startWeekDay, $lt: endWeekDay} }).sort({startDateTime: 1})
      .populate(['activity'])
      .exec(function (err, events) {
        var result = events.map(function(event, indx, events) {
                          return {
                                   activity: event.activity.description,
                                   date: moment(event.startDateTime).format('dddd MMMM Do, YYYY'),
                                   time: moment(event.startDateTime).format('h:mm A') + ' - ' + moment(event.endDateTime).format('h:mm A'),
                                   show: (indx === 0) || (indx > 0 && moment(events[indx].startDateTime).format('dddd MMMM Do, YYYY') !== moment(events[indx-1].startDateTime).format('dddd MMMM Do, YYYY'))
                                 }
                           } 
        ) 
        res.json(result);     
    })
});

eventRouter.route('/delete/:eventID')
.get(function (req, res, next) {
    events.findByIdAndRemove(req.params.eventID, function (err, resp) {
        res.render("result", {the_title: "Result", current:1, result:resp, error:err, action:"delete"});   
    })
});

eventRouter.route('/add')
.get(function (req, res, next) {
    activities.find({}, {description:1}).sort({description:1})
      .exec(function (err, activities) {
        res.render("modify", {the_title: "Assign Event", current:0, path:"/event/add", activities:activities, error:err, event:null});      
    })
});

eventRouter.route('/add')
.post(function (req, res, next) {
    var newEvent = {
      activity: mongoose.Types.ObjectId(req.body.activityId),
      startDateTime: moment(req.body.date + req.body.startHour, "MM/DD/YYYYh:mm A").format(), 
      endDateTime: moment(req.body.date + req.body.endHour, "MM/DD/YYYYh:mm A").format(), 
      isActive: Boolean(req.body.isActive)
    }; 
    events.create(newEvent, function (err, resp) {
      res.render("result", {the_title: "Result", current:1, result:resp, error:err, action:"add"});
    })
});

eventRouter.route('/update/:eventID')
.get(function (req, res, next) {
      activities.find({}, {description:1}).sort({description:1})
      .exec(function (err, activities) {
        if (err) {
          res.render("modify", {the_title: "Modify Event", current:0, path:req.params.eventID, activities:null, event:null, error:err});  
        } 
        else {
          events.findOne({_id:req.params.eventID}) 
          .exec(function (err, event) {
            var result = {
                            activity: event.activity, 
                            isActive: event.isActive,
                            date: moment(event.startDateTime).format('MM/DD/YYYY'),
                            startHour: moment(event.startDateTime).format('h:mm a'),
                            endHour: moment(event.endDateTime).format('h:mm a')                    
            };
            res.render("modify", {the_title: "Modify Event", current:0, path:req.params.eventID, activities:activities, event:result, error:err}); 
          })
        }
      }) 
});

eventRouter.route('/update/:eventID')
.post(function (req, res, next) {
    var newEvent = {
      activity: mongoose.Types.ObjectId(req.body.activityId),
      startDateTime: moment(req.body.date + req.body.startHour, "MM/DD/YYYYh:mm A").format(), 
      endDateTime: moment(req.body.date + req.body.endHour, "MM/DD/YYYYh:mm A").format(), 
      isActive: Boolean(req.body.isActive)
    };   
    events.findByIdAndUpdate(req.params.eventID, {
        $set: newEvent
    }, function (err, resp) {
         res.render("result", {the_title: "Result", current:1, result:resp, error:err, action:"update"});   
    })    
});

module.exports = eventRouter;
