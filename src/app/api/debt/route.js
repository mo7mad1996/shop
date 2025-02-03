import { NextResponse } from "next/server";
import DBconnect from "@/lib/db";
import * as controller from "@/controllers/debt";

DBconnect();

export function POST(req) {
  return controller.addDebt(req, NextResponse);
}
