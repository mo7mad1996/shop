import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import controller from "~/controllers/trueemit";

connectDB();

export async function GET(req) {
  return controller.get(req, NextResponse);
}
