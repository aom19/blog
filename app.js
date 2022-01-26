var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expreessSanitizer = require("express-sanitizer");
//APP CONFIG

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expreessSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE /MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
var Blog = mongoose.model("Blog", blogSchema);

//ROUTES

// Blog.create({
// 	title :"TEST BLOG" ,
// 	image :"https://images.pexels.com/photos/2994325/pexels-photo-2994325.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
// 	body :"BLOG POST"
// });

//INDEX Route
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log("ERROR!");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});
//New route
app.get("/blogs/new", function (req, res) {
  res.render("new");
});
//CREATE2=======================================
app.post("/blogs", function (req, res) {
  //create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      //redirect to the index
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE=======================================
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});
//Edit ROUTE =======================================
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//Update ROUTE =======================================
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(
    req.params.id,
    req.body.blog,
    function (err, updatedBlog) {
      if (err) {
        res.redirect("/blogs");
      } else {
        res.redirect("/blogs/" + req.params.id);
      }
    }
  );
});

//Remove ROUTE =======================================
app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/");
    }
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ku5rn.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`
  )

  .then(() => {
    console.log("Server start at port " + 3000);
    console.log("MongoDB is connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
