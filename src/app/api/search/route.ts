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
        if (!process.env.GEOAPIFY_API_KEY) {
            console.error("GEOAPIFY_API_KEY is missing");
            return NextResponse.json({ error: "Search configuration error" }, { status: 500 });
        }

        let geoUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${process.env.GEOAPIFY_API_KEY}&limit=5&type=amenity`;

        if (lat && lng) {
            geoUrl += `&bias=proximity:${lng},${lat}`;
        }

        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (geoData.features && geoData.features.length > 0) {
            const results = geoData.features.map((f: any) => ({
                name: f.properties.name || f.properties.formatted.split(',')[0],
                address: f.properties.formatted,
                city: f.properties.city,
                country: f.properties.country,
                lat: f.properties.lat,
                lng: f.properties.lon,
                placeId: f.properties.place_id // This is a Geoapify ID
            }));

            return NextResponse.json(results);
        }

        return NextResponse.json([]);
    } catch (error) {
        console.error("[SEARCH_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

