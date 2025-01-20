import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "~/Models/User";

connectDB();

export const PATCH = async (req, { params }) => {
  const { id } = await params;

  const payload = await req.json();

  try {
    const user = await User.findByIdAndUpdate(id, payload, { new: true });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = await params;

  try {
    await User.findByIdAndDelete(id);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
