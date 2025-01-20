import Client from "~/Models/Client";

export const addClient = async (req, res) => {
  const payload = await req.json();
  const client = await Client.create(payload);

  return res.json(client);
};

export const getAll = async (req, res) => {
  try {
    const data = await Client.find();

    return res.json(data);
  } catch (err) {
    return res.json({ error: "Internal server error" }, { status: 500 });
  }
};
