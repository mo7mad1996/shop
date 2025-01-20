import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "~/Models/Product";

connectDB();

export const PATCH = async (req, { params }) => {
  const { id } = await params;

  const payload = await req.json();

  try {
    const product = await Product.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = await params;

  try {
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const GET = async (req) => {
  const barcode = req.nextUrl.searchParams.get("barcode");
  const name = req.nextUrl.searchParams.get("name");
  if (!barcode && !name) return NextResponse.json([]);

  try {
    const products = barcode
      ? await Product.find({ barcode })
      : await Product.find({
          name: { $regex: name, $options: "i" },
        });

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
