import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Purchase from "~/Models/Purchase";
import "~/Models/Client";
import "~/Models/Product";

connectDB();

export const GET = async (req, { params }) => {
  const { id } = await params;

  try {
    const data = await Purchase.findById(id).populate([
      { path: "client" },
      { path: "items.item" },
    ]);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
