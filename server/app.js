var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var graphqlHTTP = require("express-graphql");

var dotenv = require("dotenv");
dotenv.config();

var schema = require("./graphql/bookSchemas");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// for mongodb connection
var mongoose = require("mongoose");
var cors = require("cors");
var path = require("path");

mongoose
  .connect(process.env.MONGOLAB_URI, {
    promiseLibrary: require("bluebird"),
    useNewUrlParser: true
  })
  .then(() => console.log("connection successful"))
  .catch(err => console.error(err));

// app declaration needs  to be on top
var app = express();

// Serve static assets uf ub production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "client", "build", "index"));
  });
}

//configuring GraphQL
app.use("*", cors());

app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
