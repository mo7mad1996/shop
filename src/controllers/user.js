import User from "~/Models/User";

export const createUser = async (req, res) => {
  const payload = await req.json();
  const user = await User.create(payload);

  return res.json(user);
};
