// The structured data (schema.org) that tells search engines Igongo is a
// hotel with a museum, so it can show rich results.

import { SITE } from "./siteConfig";

/** The Hotel and TouristAttraction description of Igongo, as JSON-LD. */
export function hotelSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Hotel",
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        image: `${SITE.url}${SITE.ogImage}`,
        numberOfRooms: SITE.rooms,
        address: { "@type": "PostalAddress", streetAddress: SITE.street, addressLocality: SITE.locality, addressRegion: SITE.region, addressCountry: SITE.country },
        amenityFeature: ["Swimming pool", "Restaurant", "Conference hall", "Spa"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
      },
      { "@type": "TouristAttraction", name: "Igongo Cultural Museum", url: `${SITE.url}/museum/museum-home`, containedInPlace: { "@type": "Hotel", name: SITE.name } },
    ],
  };
}
