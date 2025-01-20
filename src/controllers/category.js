import Category from "~/Models/Category";

export const addCategory = async (req, res) => {
  const payload = await req.json();
  try {
    const category = await Category.create(payload);

    return res.json(category);
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message }, { status: 500 });
  }
};

export const getAll = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.json(categories);
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message }, { status: 500 });
  }
};
