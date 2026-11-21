import { getTickerItems } from "../../../../lib/api";

export async function GET() {
  try {
    const items = await getTickerItems();
    return Response.json(
      { success: true, data: items },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("Live ticker refresh failed:", error);
    return Response.json(
      { success: false, message: "লাইভ বাজার ফিড আপডেট করা যায়নি।" },
      {
        status: 502,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }
}
