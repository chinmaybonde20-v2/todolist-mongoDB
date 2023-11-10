const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/todo-list", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Collection model
const Todo = mongoose.model(
  "todo-list",
  new mongoose.Schema({
    text: String,
    description: String,
    done: Boolean,
  })
);

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    country: String,
    mfaSecret: String,
  })
);

// Generate key
const jwtSecretKey = crypto.randomBytes(32).toString("hex");
process.env.SECRET_KEY = jwtSecretKey;

// Middleware
const authenticateToken = (req, res, next) => {
  const rawJwtToken = req.header("Authorization");

  if (!rawJwtToken || !rawJwtToken.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const jwtToken = rawJwtToken.split(" ")[1];

  if (!jwtToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(jwtToken, jwtSecretKey, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = user;
    next();
  });
};

// CRUD
app.get("/todos", authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/todos", authenticateToken, async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    console.error("Error creating a new todo:", error);
    res.status(500).json({ error: "Failed to create a new todo" });
  }
});

app.put("/todos/:id", authenticateToken, async (req, res) => {
  try {
    const todoId = req.params.id;
    const updatedData = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedData, {
      new: true,
    });
    if (updatedTodo) {
      res.json(updatedTodo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Error updating a todo:", error);
    res.status(500).json({ error: "Failed to update a todo" });
  }
});

app.delete("/todos/:id", authenticateToken, async (req, res) => {
  try {
    const todoId = req.params.id;
    const result = await Todo.findByIdAndDelete(todoId);
    if (result) {
      res.json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Error deleting a todo:", error);
    res.status(500).json({ error: "Failed to delete a todo" });
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (matchPassword) {
      // Generate and send a JWT token if login is successful
      // const jwtFToken = jwt.sign({ email: user.email }, jwtSecretKey, {
      //   expiresIn: "20m",
      // });
      // console.log("token", jwtFToken);
      res.json({ message: "Login successful", qrCodeUrl: user.qrCodeUrl });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const userData = req.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Generate a secret for the user
    const mfaSecret = speakeasy.generateSecret({
      length: 20,
      name: "Todo-lists",
    });

    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      country: userData.country,
      mfaSecret: mfaSecret.base32,
    });

    await newUser.save();

    // Generate a QR code for the user to scan
    const qrCode = await QRCode.toDataURL(mfaSecret.otpauth_url);

    res.json({ newUser, qrCodeUrl: qrCode });
    console.log("Secret Key:", mfaSecret.base32);
    console.log("QR Code Image URL:", qrCode);
  } catch (error) {
    console.error("Error creating a new user:", error);
    res.status(500).json({ error: "Failed to create a new user" });
  }
});

app.post("/mfa-verify", async (req, res) => {
  try {
    const { email, mfaToken } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log(JSON.stringify(user));
    // Verify the token
    var token = speakeasy.totp({
      secret: user.mfaSecret,
      encoding: "base32",
    });
    console.log("Token is ", token);
    console.log(`mfaTOken is ${mfaToken} and secret is ${user.mfaSecret}`);
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: mfaToken,
    });
    console.log("verified is ", verified);
    if (verified) {
      const jwtFToken = jwt.sign({ email: user.email }, jwtSecretKey, {
        expiresIn: "20m",
      });
      console.log("token", jwtFToken);
      res.json({ message: "Verification successful", jwtToken: jwtFToken });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (errorundefined) {
    console.error("Error during verification:", errorundefined);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
