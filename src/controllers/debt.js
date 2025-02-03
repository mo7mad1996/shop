import Debt from "~/Models/Debt";
import Client from "~/Models/Client";

export const addDebt = async (req, res) => {
  const data = await req.json();

  try {
    const debt = Debt.create(data);

    await Client.findByIdAndUpdate(data.client, {
      $inc: { debt: -data.amount },
    });

    return res.json(debt);
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message }, { status: 500 });
  }
};
