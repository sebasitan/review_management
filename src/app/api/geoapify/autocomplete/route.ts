import { NextRequest, NextResponse } from 'next/server';

/**
 * Geoapify Autocomplete API
 * Fetches business location suggestions based on user input
 * COMPLIANCE: Uses ONLY Geoapify, NO Google APIs
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const text = searchParams.get('text');
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');

        if (!text) {
            return NextResponse.json({ error: 'Text parameter required' }, { status: 400 });
        }

        const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

        if (!GEOAPIFY_API_KEY) {
            return NextResponse.json(
                { error: 'Geoapify API key not configured' },
                { status: 500 }
            );
        }

        // Build Geoapify Autocomplete URL
        let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${GEOAPIFY_API_KEY}`;

        // Add bias location if provided (for better local results)
        if (lat && lon) {
            url += `&bias=proximity:${lon},${lat}`;
        }

        // Filter for commercial/business places
        url += '&type=amenity';
        url += '&limit=10';

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Geoapify API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform Geoapify response to our format
        const results = data.features?.map((feature: any) => ({
            name: feature.properties.name || feature.properties.formatted,
            address: feature.properties.formatted,
            city: feature.properties.city || feature.properties.county,
            country: feature.properties.country,
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            placeId: feature.properties.place_id || `geo_${feature.properties.lon}_${feature.properties.lat}`,
            source: 'geoapify',
            googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`,
        })) || [];

        return NextResponse.json(results);

    } catch (error) {
        console.error('Geoapify autocomplete error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch location suggestions' },
            { status: 500 }
        );
    }
}
