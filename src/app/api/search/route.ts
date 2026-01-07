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

    if (!query) {
        return NextResponse.json([]);
    }

    try {
        // Use Google Places API (New) or Text Search
        // Note: For production, you'd use process.env.GOOGLE_PLACES_API_KEY
        // Since we are in dev/build phase, let's mock the search result if no key is found
        if (!process.env.GOOGLE_PLACES_API_KEY) {
            console.warn("GOOGLE_PLACES_API_KEY missing, using mock search results");
            const mockResults = [
                {
                    name: query.includes("Coffee") ? "Blue Coffee Roasters" : query,
                    placeId: "mock_place_123",
                    address: "123 Main St, New York, NY",
                    rating: 4.8
                }
            ];
            return NextResponse.json(mockResults);
        }

        const res = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_PLACES_API_KEY}`);
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
