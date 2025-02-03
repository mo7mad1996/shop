import Buy from "~/Models/Buy";
import Product from "~/Models/Product";

export const addPurchase = async (req, res) => {
  const data = await req.json();
  try {
    const purchase = Buy.create(data);

    console.log(data);

    const bulkOperations = data.items.map((item) => ({
      updateOne: {
        filter: { _id: item.item },
        update: { $inc: { store: item.count } },
      },
    }));
    await Product.bulkWrite(bulkOperations, { ordered: true });

    return res.json(purchase);
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message }, { status: 500 });
  }
};

export const getPurchases = async (req, res) => {
  // query string
  const page = req.nextUrl.searchParams.get("page");
  const perPage = req.nextUrl.searchParams.get("perPage");

  try {
    const purchases = await Buy.find()
      .limit(perPage)
      .skip(perPage * page)
      .sort({ createdAt: -1 });

    return res.json(purchases);
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message }, { status: 500 });
  }
};
