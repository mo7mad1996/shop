import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import * as controller from "@/controllers/user";

connectDB();
export async function POST(req) {
  return controller.createUser(req, NextResponse);
}
export async function GET(req) {
  return controller.getUserData(req, NextResponse);
}
