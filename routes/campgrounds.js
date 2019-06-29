var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var expressSanitizer = require("express-sanitizer");
var middleware = require("../middleware");

router.use(expressSanitizer());

// Campgournds Index
router.get("/",function(req, res){
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

//  Campgrounds CREATE - add new campgrounds to DB
router.post("/",middleware.isLoggedIn,function(req, res){
    //get data from form and add to campgrounds array
    var name = req.sanitize(req.body.name);
    
    var image = req.sanitize(req.body.image);
    var cost =req.sanitize( req.body.cost);
    var description = req.sanitize(req.body.description);
    var author = {
        id: req.user._id,
        username: req.user.username
    };

 
    var newCampground = {name: name, image: image, description: description, cost:cost, author:author};
    Campground.create(newCampground,function(err, newlyCreated){
            if(err){
                req.flash("error", "Oops, Something went wrong while creating the campground.");
                res.redirect("back");
            } else {
                //show all the campgrounds
                req.flash("sucess", "Campground added successfully.");
                res.redirect("/campgrounds");
            } 
    });
});
    
    
    
    
    //Create a new campground and save to DB


// Campgrounds NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Campgrounds SHOW - show more ihernfo about one campground
router.get("/:id",middleware.isLoggedIn, function(req, res){
    //find the campfround with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else {
                res.render("campgrounds/show", {campground: foundCampground});
            }
    });
});

//EDIT Campgrounds ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
           if(err){
            req.flash("error", "Oops, something went wrong while getting the campground");
            res.redirect("back");
        } else {
            //show the edit campground page
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});

//UPDATE Campgrounds ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Campgrounds ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
           req.flash("error", "Oops, something went wrong while deleting the campground");
            res.redirect("back");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;