// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  app.get("/", function(req, res) {
    db.Restaurant.findAll({include:[{ model: db.User, attributes: ['username']}]}).then(function(data){
      var hbsObject = {
        restaurants: data
      };
      db.User.findAll({}).then(function(data2){
        hbsObject["users"] = data2;
        res.render("index", hbsObject);
      });
    });
  });


//root route, show each restaurant's information, calls model's .all()
app.get("/restaurants/:userid", function(req, res) {
  db.Restaurant.findAll({
    where: {
      UserId:req.params.userid
    },
    include:[{ model: db.User}]
  }).then(function(data){
    var hbsObject = {
      restaurants: data
    };
    db.User.findAll({}).then(function(data2){
      hbsObject["users"] = data2;
      res.json(hbsObject);
    });
  });
});

//when post request comes from client, calls model's create()
app.post("/api/restaurants", function(req, res) {
  db.Restaurant.create({
    name:req.body.name,
    UserId:req.body.userId
  }).then(function(data){
    res.json({ id: data.insertId });
  });
});

//when post request comes from client, calls model's create()
app.post("/api/users", function(req, res) {
  db.User.create({
    username:req.body.username
  }).then(function(data){
    res.json({ id: data.insertId });
  });
});

//when put request comes from client, calls model's update()
app.put("/api/restaurants/:id", function(req, res) {
  db.Restaurant.update({
    visited:req.body.visited,
    liked:req.body.liked
  },{
    where:
    {
      id:req.params.id
    }
  }).then(function(data){
    if (data.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

//when delete request comes from client, calls model's delete()
app.delete("/api/restaurants/:id", function(req, res) {

  db.Restaurant.destroy({
    where:
    {
      id:req.params.id
    }
  }).then(function(data){
    if (data.affectedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});
  
};
