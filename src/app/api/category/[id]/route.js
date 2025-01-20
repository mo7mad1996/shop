import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "~/Models/Category";

connectDB();

export const PATCH = async (req, { params }) => {
  const { id } = await params;

  const payload = await req.json();

  try {
    const category = await Category.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return NextResponse.json({ category });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = await params;

  try {
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
