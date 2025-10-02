// src/app/api/resume/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Params {
  filename: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Params | Promise<Params> }
) {
  try {
    // If params is a Promise, await it
    const { filename } = context.params instanceof Promise ? await context.params : context.params;

    const filePath = path.join("/tmp", filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".docx")
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (ext === ".doc") contentType = "application/msword";

    return new Response(fileBuffer, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
