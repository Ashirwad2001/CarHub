var express = require("express");
var router = express.Router();
var Car = require("../models/car");
var middleware = require("../middleware");


//show index route
router.get("/",function(req,res){
    Car.find({}, function(err,allCars){
        if(err){
            console.log(err);
        }else{
            res.render("cars/index",{cars:allCars,currentUser:req.user});
        }
    });

});

//create AutoHub - add new car to db
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image  =  req.body.image;
    var description = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var newCar = {name:name ,price:price, image:image,description:description,author:author}
    Car.create(newCar, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/car");
        }
    });
});

//show  form to create new AutoHub
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("cars/new.ejs");
})


//show more info about a Car
router.get("/:id",function(req,res){
    Car.findById(req.params.id).populate('comments').exec(function(err,foundCar){
        if(err){
            console.log(err);
        }else{
            res.render("cars/show",{car: foundCar});
        }
    });
});

router.get("/:id/edit",middleware.checkCarOwnership, function(req,res){
        Car.findById(req.params.id,function(err,foundCar){
            res.render("cars/edit",{car:foundCar});
        });
});

router.put("/:id",middleware.checkCarOwnership,function(req,res){
    Car.findByIdAndUpdate(req.params.id,req.body.car,function(err,updatedCar){
        if(err){
            res.redirect("/car");
        }else{
            res.redirect("/car/" + req.params.id);
        }
    })
})

router.delete("/:id",middleware.checkCarOwnership,function(req,res){
        Car.findByIdAndDelete(req.params.id,function(err){
            if(err){
                res.redirect("/car")
            }else{
                res.redirect("/car")
            }
        })
})

//middleware


module.exports = router;