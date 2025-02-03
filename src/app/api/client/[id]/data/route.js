import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Debt from "~/Models/Debt";
import Purchase from "~/Models/Purchase";

connectDB();

export const GET = async (req, { params }) => {
  const { id } = await params;

  try {
    const purchases = await Purchase.find({ client: id });
    const debts = await Debt.find({ client: id });

    return NextResponse.json({ purchases, debts });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
