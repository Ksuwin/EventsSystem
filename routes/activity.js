var express = require('express');
var mongoose = require('mongoose');
var activities = require('../models/activity');
var bodyParser = require('body-parser');
var moment = require('moment');

var activityRouter = express.Router();
activityRouter.use(bodyParser.json());

activityRouter.route('/')
.get(function (req, res, next) {
    activities.find({}).sort({description: 1})
      .exec(function (err, activities) {
        var result = activities.map(function(activity) {
        	                return {
        	                	     id: activity._id, 
        	                	     description: activity.description,
        	                	     createdAt: moment(activity.createdAt).format('MMMM Do YYYY, h:mm:ss A'),
                                     updatedAt: moment(activity.updatedAt).format('MMMM Do YYYY, h:mm:ss A') 
        	                       };
                           } 
        )	
      	res.render("index", {the_title: "Activities", current:2, activities:result, error:err});     
    })
});


activityRouter.route('/delete/:activityID')
.get(function (req, res, next) {
    activities.findByIdAndRemove(req.params.activityID, function (err, resp) {
        res.render("result", {the_title: "Result", current:2, result:resp, error:err, action:"delete"});   
    })
});

activityRouter.route('/update/:activityID')
.post(function (req, res, next) {
    activities.findByIdAndUpdate(req.params.activityID, {
        $set: req.body
    }, function (err, resp) {
         res.render("result", {the_title: "Result", current:2, result:resp, error:err, action:"update"});   
    })    
});

activityRouter.route('/add')
.post(function (req, res, next) {
    activities.create(req.body, function (err, resp) {
        res.render("result", {the_title: "Result", current:2, result:resp, error:err, action:"add"});
    })
});

module.exports = activityRouter;
