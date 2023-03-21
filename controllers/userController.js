import createError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const serverError = createError(500, "Server Error");
const userNotFound = createError(404, "User not found");

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = createError(409, "user already exists!");
      next(error);
    }
    const user = new User({
      firstName,
      lastName,
      email,

      password
    });
    await user.save();
    const userWithoutPassword = user.deleteField(user.password);

    return res
      .status(201)
      .json({ msg: "User created Successfully!", userWithoutPassword });
  } catch (error) {
    next(serverError);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = createError(404, "email not found!");
      next(error);
    }
    const matched = await user.comparePassword(password, user.password);

    if (!matched) {
      const error = createError(500, "password incorrect!");
      next(error);
    }
    const payload = { userId: user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRETKEY, {
      expiresIn: "1h"
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ msg: "you are logged in!!" });
  } catch (error) {
    next(serverError);
  }
};
