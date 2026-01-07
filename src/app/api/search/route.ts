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
        // 1. Try Geoapify (Free / No Credit Card required)
        if (process.env.GEOAPIFY_API_KEY) {
            console.log("Using Geoapify search...");
            let geoUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${process.env.GEOAPIFY_API_KEY}&limit=5&type=amenity`;

            if (lat && lng) {
                geoUrl += `&bias=proximity:${lng},${lat}`;
            }

            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();

            if (geoData.features && geoData.features.length > 0) {
                const results = geoData.features.map((f: any) => ({
                    name: f.properties.name || f.properties.formatted,
                    placeId: f.properties.place_id,
                    address: f.properties.formatted,
                    rating: 4.0
                }));
                return NextResponse.json(results);
            }
        }

        // 2. Try Google if key is present
        if (process.env.GOOGLE_PLACES_API_KEY) {
            let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
            if (lat && lng) {
                searchUrl += `&location=${lat},${lng}&radius=50000`;
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
        }

        // 3. Fallback to Mock
        const mockResults = [
            {
                name: query,
                placeId: "mock_" + Math.random().toString(36).substr(2, 9),
                address: lat ? "Located near you" : "123 Main St, New York, NY",
                rating: 4.5
            }
        ];
        return NextResponse.json(mockResults);
    } catch (error) {
        console.error("[SEARCH_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
