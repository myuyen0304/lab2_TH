const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/sessionAuth")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Session middleware
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/sessionAuth" }),
    cookie: { maxAge: 1000 * 60 * 60 } // 1 giờ
  })
);

// Routes
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
