import { NextResponse } from "next/server";
import DBconnect from "@/lib/db";
import * as controller from "@/controllers/category";

DBconnect();

export async function POST(req) {
  return controller.addCategory(req, NextResponse);
}
export async function GET(req) {
  return controller.getAll(req, NextResponse);
}
