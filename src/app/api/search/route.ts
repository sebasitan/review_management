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
            console.log("DEBUG: GEOAPIFY_API_KEY found:", process.env.GEOAPIFY_API_KEY.substring(0, 5) + "...");
            let geoUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${process.env.GEOAPIFY_API_KEY}&limit=5`;

            if (lat && lng) {
                geoUrl += `&bias=proximity:${lng},${lat}`;
            }

            console.log("DEBUG: Fetching from Geoapify:", geoUrl);
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();

            console.log(`DEBUG: Geoapify found ${geoData.features?.length || 0} features`);

            if (geoData.features && geoData.features.length > 0) {
                const results = [];

                // If we have Google API key, enrich with real Google data
                if (process.env.GOOGLE_PLACES_API_KEY) {
                    for (const f of geoData.features) {
                        const businessName = f.properties.name || f.properties.formatted;
                        const address = f.properties.formatted;

                        try {
                            // Search Google Places to get the actual place_id and rating
                            const googleSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessName + ' ' + address)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
                            const googleRes = await fetch(googleSearchUrl);
                            const googleData = await googleRes.json();

                            if (googleData.results && googleData.results.length > 0) {
                                const place = googleData.results[0];
                                results.push({
                                    name: place.name,
                                    placeId: place.place_id, // Real Google Place ID
                                    address: place.formatted_address,
                                    category: f.properties.categories?.[0] || place.types?.[0] || "business",
                                    rating: place.rating || 4.0,
                                    reviewCount: place.user_ratings_total || 0
                                });
                            } else {
                                // Fallback to Geoapify data if Google doesn't find it
                                results.push({
                                    name: businessName,
                                    placeId: f.properties.place_id,
                                    address: address,
                                    category: f.properties.categories?.[0] || "business",
                                    rating: 4.0,
                                    reviewCount: 0
                                });
                            }
                        } catch (err) {
                            console.error("Error enriching with Google data:", err);
                            // Fallback to Geoapify data
                            results.push({
                                name: businessName,
                                placeId: f.properties.place_id,
                                address: address,
                                category: f.properties.categories?.[0] || "business",
                                rating: 4.0,
                                reviewCount: 0
                            });
                        }
                    }
                } else {
                    // No Google API, use Geoapify data only
                    for (const f of geoData.features) {
                        results.push({
                            name: f.properties.name || f.properties.formatted,
                            placeId: f.properties.place_id,
                            address: f.properties.formatted,
                            category: f.properties.categories?.[0] || "business",
                            rating: 4.0,
                            reviewCount: 0
                        });
                    }
                }

                return NextResponse.json(results);
            }
        } else {
            console.warn("DEBUG: GEOAPIFY_API_KEY is missing in environment");
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
