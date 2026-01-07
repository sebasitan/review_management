import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!query) {
        return NextResponse.json([]);
    }

    try {
        if (!process.env.GOOGLE_PLACES_API_KEY) {
            console.warn("GOOGLE_PLACES_API_KEY missing, using mock search results");
            const mockResults = [
                {
                    name: query,
                    placeId: "mock_" + Math.random().toString(36).substr(2, 9),
                    address: lat ? "Located near you" : "123 Main St, New York, NY",
                    rating: 4.5
                }
            ];
            return NextResponse.json(mockResults);
        }

        let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

        if (lat && lng) {
            searchUrl += `&location=${lat},${lng}&radius=50000`; // 50km radius
        }

        const res = await fetch(searchUrl);
        const data = await res.json();

        const results = (data.results || []).map((p: any) => ({
            name: p.name,
            placeId: p.place_id,
            address: p.formatted_address,
            rating: p.rating
        }));

        return NextResponse.json(results);
    } catch (error) {
        console.error("[SEARCH_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
