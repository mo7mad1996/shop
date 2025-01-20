import jwt from "jsonwebtoken";

import User from "~/Models/User";
import Shop from "~/Models/Shop";

const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async (req, res) => {
  const payload = await req.json();
  const user = await User.create(payload);

  return res.json(user);
};

export const getUserData = async (req, res) => {
  const token = req.headers.get("token");
  const id = jwt.verify(token, JWT_SECRET).userId;

  const user = await User.findById(id);
  const shop = await Shop.findOne();

  return res.json({ user, shop });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.json({ users });
  } catch (err) {
    return res.json({ error: "Internal server error" }, { status: 500 });
  }
};
