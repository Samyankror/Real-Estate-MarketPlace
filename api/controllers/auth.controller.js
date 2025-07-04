import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password,photo} = req.body;
  const hashedPassowrd = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassowrd,photo});

  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    console.log(validUser);
    if (!validUser) {
      return next(errorHandler(404, "user not found"));
    }

    const isPasswordCorrect = bcryptjs.compareSync(
      password,
      validUser.password
    );
    if (!isPasswordCorrect) {
      return next(errorHandler(401, "invalid password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res.cookie("accessToken", token, { httpOnly: true }).status(200).json({
      success: true,
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      return res
        .cookie("accessToken", token, { httpOnly: true })
        .status(200)
        .json({
          success: true,
          user: rest,
        });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random.toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      return res
        .cookie("accessToken", token, { httpOnly: true })
        .status(200)
        .json({
          success: true,
          user: rest,
        });
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken", { httpOnly: true })
      .status(200)
      .json({ success: true, message: "user has been logout" });
  } catch (error) {
    next(error);
  }
};
