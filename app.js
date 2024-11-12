require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");

const dashboardRoutes = require("./routes/dashboard");

const app = express();

// Passport Config
require("./config/passport")(passport);

// DB Config
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// EJS setup
app.set("view engine", "ejs");

// Bodyparser
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

/*Structure
|-- app.js
|-- models
|   |-- User.js
|-- routes
|   |-- auth.js
|   |-- user.js
|-- views
|   |-- login.ejs
|   |-- signup.ejs
|   |-- dashboard.ejs
|   |-- admin_dashboard.ejs
|-- package.json
|-- .env
*/
