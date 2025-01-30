var express = require("express");
var router = express.Router({mergeParams:true});
var Car = require("../models/car");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//comments_ new
router.get("/new",middleware.isLoggedIn,function(req,res){
    Car.findById(req.params.id,function(err,car){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{car:car});
        }
    })
})

//comments create
router.post("/",middleware.isLoggedIn,function(req,res){
    Car.findById(req.params.id,function(err,car){
        if(err){
            console.log(err);
            res.redirect("/car");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong")
                    console.log(err);
                }else{
                    console.log("My Name is"+ req.user.username);
                    comment.author.id  = req.user._id;
                    comment.author.username  = req.user.username;
                    comment.save();
                    car.comments.push(comment);
                    car.save();
                    req.flash("success","Successfully added a comment :)")
                    res.redirect("/car");
                }
            })
        }
    })
})


router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{car_id:req.params.id,comment:foundComment});
        }
    })
})

//comment update=====
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedCar){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/car/"+req.params.id);
        }
    })
})

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success","Comment deleted :(")
            res.redirect("/car/" + req.params.id)
        }
    })
})

module.exports = router;