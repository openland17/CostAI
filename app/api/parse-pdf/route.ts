import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";
    let pageCount = 1;

    if (file.type === "application/pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      text = data.text;
      pageCount = data.numpages;
    } else {
      text = buffer.toString("utf-8");
    }

    return NextResponse.json({ text, pageCount });
  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to parse document",
      },
      { status: 500 }
    );
  }
}
