import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Client from "~/Models/Client";

connectDB();

export const PATCH = async (req, { params }) => {
  const { id } = await params;

  const payload = await req.json();

  try {
    const client = await Client.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return NextResponse.json({ client });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = await params;

  try {
    await Client.findByIdAndDelete(id);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
