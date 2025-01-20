import { NextResponse } from "next/server";
import DBconnect from "@/lib/db";
import * as controller from "@/controllers/client";

DBconnect();

export async function POST(req) {
  return controller.addClient(req, NextResponse);
}
export async function GET(req) {
  return controller.getAll(req, NextResponse);
}
