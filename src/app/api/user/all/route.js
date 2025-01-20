import connectDB from "@/lib/db";
import * as controller from "@/controllers/user";
import { NextResponse } from "next/server";

connectDB();
export function GET(req) {
  return controller.getAllUsers(req, NextResponse);
}
