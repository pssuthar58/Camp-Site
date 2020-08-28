var express      = require("express"),
     app         = express(),
     bodyParser  = require("body-parser"),
     mongoose    = require("mongoose");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//Database Connection
const newLocal = "mongodb://localhost/yelpCamp_app";
mongoose.connect(newLocal, {useNewUrlParser : true, useUnifiedTopology : true})
.then(()=>{
    console.log("Database Connection Successfully Establised.!");
})
.catch((err)=>{
    console.log(err);
});

//SCHEMA SETUP
var campSchema = new mongoose.Schema({
    name : String,
    imageUrl : String,
    description: String
});
var Campground = mongoose.model("campdata", campSchema);

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX- show all campgrounds 
app.get("/campground", function(req, res){
    //Get all campground from DB
    Campground.find({},(err, allCampgrounds)=>{
        if(err){
            console.log(err);
        } else{
            res.render("index", {campgrounds : allCampgrounds});
        }
    })
});

//CREATE- add new campground to database
app.post("/campground", function(req, res){
    //get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name : name, imageUrl : image, description: desc};
    Campground.create(newCampground, function(err, camp){
            if (err) {
                console.log(err);
            } else{
                //redirect back to campgrounds page
                res.redirect("/campground");
            }
    });    
});

//NEW- show form to create  new capmground
app.get("/campground/new", function(req, res){
    res.render("new");
});

//SHOW- show more info about one campground
app.get("/campground/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
            console.log(err);
        } else{
            //render show template with that campground
              res.render("show",{campground : foundCampground});
        }
    });
})
app.listen(8080, function(){
    console.log("YelpCamp App Started!!..");
});