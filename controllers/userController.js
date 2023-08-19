const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const generateEmailToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 60 * 30 });
};

const signupUser = async (req, res) => {
  const { userName, password, email } = req.body;
  try {
    if (!userName || !email || !password) {
      throw new Error("Please Provide All the neccessary fields.");
    }
    const user = await User.create({
      userName,
      email,
      password: await encryptPassword(password),
    });
    // console.log(user);
    const token = generateToken(user._id);
    res
      .status(200)
      .json({
        email: user.email,
        userName: user.userName,
        userId: user._id,
        token,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findOne({ _id });
    res.json(user);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { password, email } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Please Provide All the neccessary fields.");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("No user registered with this email.");
    }
    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      throw new Error("One of the fields is not correct, Please check again.");
    }
    const token = generateToken(user._id);
    res
      .status(200)
      .json({
        email: user.email,
        userName: user.userName,
        userId: user._id,
        token,
      });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User Not Found!");
  }

  const resetToken = generateEmailToken(user._id);

  const update = { $set: { token: resetToken } };
  const updatedUser = await User.findOneAndUpdate(user._id, update, {
    new: true,
  });

  //The Reset URL that'll be sent to the user
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  //Email Body
  const message = `
      <h2>Hello ${user.userName}!</h2>
      <p>Please use the URL below to reset your password.</p>
      <p>This link is valid for only 30 minutes.</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      <p>Regards.</p>
      <p>Task List Management Team.</p>
    `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({
      success: true,
      message: "Password Reset Email Sent!",
    });
  } catch (err) {
    res.status(400);
    throw new Error("Email failed to be sent. Please try Again.");
  }  
  } catch (error) {
    res.json({error: error.message});
  }
  
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ token });
    if (!user) {
      res.json({ message: "Unauthorized" });
    }
    const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (!isVerified) {
      throw new Error("Token has expired.");
    }
    const encryptedPassword = await encryptPassword(newPassword);
    const newUser = await User.findOneAndUpdate(
      user._id,
      { password: encryptedPassword, token: "" },
      { new: true }
    );
    res.json(newUser);
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUser
};
