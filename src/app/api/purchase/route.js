import { NextResponse } from "next/server";
import DBconnect from "@/lib/db";
import * as controller from "@/controllers/purchase";

DBconnect();

export async function POST(req) {
  return controller.addPurchase(req, NextResponse);
}
export async function GET(req) {
  return controller.getPurchases(req, NextResponse);
}
