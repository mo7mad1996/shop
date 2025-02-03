import Purchase from "~/Models/Purchase";
import Product from "~/Models/Product";
import Client from "~/Models/Client";

export const addPurchase = async (req, res) => {
  const data = await req.json();
  try {
    const purchase = Purchase.create(data);

    const bulkOperations = data.items.map((item) => ({
      updateOne: {
        filter: { _id: item.item },
        update: { $inc: { store: -item.count } },
      },
    }));
    await Product.bulkWrite(bulkOperations, { ordered: true });
    await Client.findByIdAndUpdate(data.client, {
      $inc: { debt: data.total },
    });

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
    const purchases = await Purchase.find()
      .populate("client")
      .limit(perPage)
      .skip(perPage * page)
      .sort({ createdAt: -1 });

    return res.json(purchases);
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message }, { status: 500 });
  }
};
