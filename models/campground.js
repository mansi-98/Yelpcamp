
var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    cost: Number,
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
    author:{
            id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
            },
            username: String
    }        
});

//compile schema in to a model
var Campground = mongoose.model("Campground", campgroundSchema);

//export the model
module.exports = Campground;