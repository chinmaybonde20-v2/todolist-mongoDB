const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/employee-manager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Collection model
const Employee = mongoose.model(
  "employees",
  new mongoose.Schema({
    name: String,
    email: String,
    dob: String,
    designation: String,
    education: String,
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
    resetPasswordToken: String,
    resetPasswordExpires: Date,
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
app.get("/employees", authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees :", error);
    res.status(500).json({ error: "Failed to fetch employees " });
  }
});

app.post("/employees", authenticateToken, async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.json(newEmployee);
  } catch (error) {
    console.error("Error creating a new employee:", error);
    res.status(500).json({ error: "Failed to create a new employee" });
  }
});

app.put("/employees/:id", authenticateToken, async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updatedData = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updatedData,
      {
        new: true,
      }
    );
    if (updatedEmployee) {
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error("Error updating a employee:", error);
  }
});

app.delete("/employees/:id", authenticateToken, async (req, res) => {
  try {
    const employeeId = req.params.id;
    const result = await Employee.findByIdAndDelete(employeeId);
    if (result) {
      res.json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error("Error deleting a employee:", error);
    res.status(500).json({ error: "Failed to delete a employee" });
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
      name: userData.name + "'s QR",
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

// Forget password
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // generate otp
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry

    await user.save();

    // send mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chinmaybondev2@gmail.com",
        pass: "wzjx cfxu gavr wydm",
      },
    });

    const mailOptions = {
      from: "chinmaybondev2@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Hi, Your OTP for password reset is: ${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          error: "Failed to send reset token",
          errorMessage: error.message,
        });
      }
      console.log("Email sent:", info.response);
      res.json({ message: "Reset token sent to your email" });
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ error: "Forgot password failed" });
  }
});

// Reset password
app.post("/reset-password", async (req, res) => {
  try {
    const { otp, password, confirmPassword } = req.body;

    if (!otp || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Please provide OTP and new password" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ resetPasswordToken: otp });

    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(404).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
