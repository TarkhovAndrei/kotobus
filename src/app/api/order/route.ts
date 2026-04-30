import { NextResponse } from "next/server";

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      productLink,
      productNotes,
      fullName,
      email,
      phone,
      country,
      city,
      address,
      zip,
      inn,
    } = body;

    // Validate required fields
    if (!productLink || !fullName || !email || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderData = {
      timestamp: new Date().toISOString(),
      productLink,
      productNotes: productNotes || "",
      fullName,
      email,
      phone: phone || "",
      country: country || "",
      city: city || "",
      address,
      zip: zip || "",
      inn: inn || "",
    };

    // Send to Google Sheets via Apps Script Web App
    if (GOOGLE_SHEETS_URL) {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
    } else {
      // Log locally if no Google Sheets URL configured
      console.log("New order (Google Sheets not configured):", orderData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
