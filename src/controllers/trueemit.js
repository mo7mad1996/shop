import fs from "fs";

// models
import Shop from "@/Models/Shop";

const filepath = "secret";
// GET /api/trueemit/isValid
export const get = async (req, res) => {
  try {
    const shop = await Shop.findOne();
    const fileExists = fs.existsSync(filepath, "utf-8");

    // logic
    if (!fileExists && shop) {
      return checkIsExpired(res, shop);
    }
    if (fileExists && shop) {
      deleteFile();
    }

    if (fileExists && !shop) {
      return createAnewShop(res);
    }
    if (!fileExists && !shop) {
      console.log({ fileExists, shop });
    }
    return res.json({ fileExists, shop });
  } catch (err) {
    console.error(err);

    return res.json({ err: err }, { status: 403 });
  }
};

// delete file
function deleteFile() {
  fs.unlinkSync(filepath);
}
async function createAnewShop(res) {
  // 1) read file content
  const password = fs.readFileSync(filepath, "utf-8");

  // 2) create a shop
  const shop = await Shop.create({ password });

  return res.json({ redirect: true, path: "/trueemit/newClient" });
}

function checkIsExpired(res, shop) {
  const isExpired = new Date(shop.expired) < new Date();

  if (isExpired)
    return res.json({ redirect: true, path: "/trueemit/newPeriod" });
  else return res.json({ redirect: false });
}

// POST /api/trueemit/isValid
export const checkPassword = async (req, res) => {
  const { password } = await req.json();

  const shop = await Shop.findOne();
  const isValid = await shop.comparePassword(password);

  if (isValid) return res.json({ isValid });
  else return res.json({ error: "كلمة المرور خطأ" }, { status: 400 });
};

export const updateShop = async (req, res) => {
  try {
    const payload = await req.json();
    const shop = await Shop.updateOne({}, payload);

    return res.json(shop);
  } catch (err) {
    console.error(err);
    return res.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default {
  updateShop,
  checkPassword,
  get,
};
