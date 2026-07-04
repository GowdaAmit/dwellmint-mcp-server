import { z } from "zod";
import axios from "axios";
const BASE_URL = "https://dwellmint.studio/api/payloads";
export function registerTools(server) {
    server.tool("list_articles", "Lists all available articles that can be read.", {}, async () => {
        // Since we don't have a dynamic index right now on the static host,
        // we will hardcode a few primary slugs, or we could fetch an index if we uploaded one.
        // For now, let's just return a static list of the top architecture posts to demonstrate.
        const articles = [
            { slug: "vaastu-compliant-luxury-bangalore", title: "Vaastu-Compliant Luxury" },
            { slug: "pinterest-perfect-trap-functional-design-bangalore", title: "The Pinterest-Perfect Trap" },
            { slug: "ai-visualization-vs-tactile-reality", title: "AI Visualization vs Tactile Reality" }
        ];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ articles }, null, 2)
                }]
        };
    });
    server.tool("read_article", "Read the full details, keywords, and deep dives for a specific DwellMint article.", {
        slug: z.string().describe("The slug of the article (e.g., 'vaastu-compliant-luxury-bangalore')")
    }, async ({ slug }) => {
        try {
            const response = await axios.get(`${BASE_URL}/${slug}.json`);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error fetching article: ${error.message}. Please check if the slug is correct.`
                    }]
            };
        }
    });
}
