import Product from "~/Models/Product";

export const addProduct = async (req, res) => {
  const payload = await req.json();
  try {
    const product = await Product.create(payload);

    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message }, { status: 500 });
  }
};

export const getAll = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message }, { status: 500 });
  }
};
