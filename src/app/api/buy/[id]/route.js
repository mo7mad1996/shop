import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Buy from "~/Models/Buy";
import "~/Models/Product";

connectDB();

export const GET = async (req, { params }) => {
  const { id } = await params;

  try {
    const data = await Buy.findById(id).populate([{ path: "items.item" }]);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
