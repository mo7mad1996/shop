import { NextResponse } from "next/server";
import DBconnect from "@/lib/dbConnection";
import controller from "@/controllers/trueemit";

DBconnect();

export async function POST(req) {
  return controller.checkPassword(req, NextResponse);
}
export async function PATCH(req) {
  return controller.updateShop(req, NextResponse);
}
