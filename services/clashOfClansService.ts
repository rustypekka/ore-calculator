import { PlayerEquipmentData } from '../types';

// This endpoint must point to your server-side proxy script (e.g., player.php from your example).
// The script will securely use your API key to fetch data from the CoC API.
// IMPORTANT: You might need to change this to a full URL if your PHP backend is hosted on a different domain.
// For example: 'https://your-website.com/api/player_ores.php'
const PROXY_ENDPOINT = 'https://clancapitalbases.com/api/player_ores.php';

/**
 * Fetches player equipment data via a server-side proxy.
 * Note: The API does not provide player ore counts.
 * @param playerTag The player's in-game tag (e.g., #2PP).
 * @returns A promise that resolves to an array of the player's equipment.
 */
export const fetchPlayerData = async (playerTag: string): Promise<PlayerEquipmentData[]> => {
    if (!playerTag) {
        throw new Error('Player Tag is required.');
    }

    const encodedTag = encodeURIComponent(playerTag);
    // The user's provided PHP script uses a 'tag' query parameter.
    const url = `${PROXY_ENDPOINT}?tag=${encodedTag}`;

    try {
        // We no longer need Authorization headers or a CORS proxy,
        // as the request goes to our own backend.
        const response = await fetch(url);

        if (!response.ok) {
            // Try to parse error from the proxy, fall back to status text
            const errorData = await response.json().catch(() => ({ reason: `Request to server failed with status ${response.status}` }));
            throw new Error(errorData.reason || `An unknown API error occurred.`);
        }

        const data = await response.json();
        
        // Handle error responses forwarded from the CoC API by the proxy
        if (data.reason) {
            if (data.reason === 'notFound') {
                throw new Error('Player not found. Please check the Player Tag.');
            }
            throw new Error(data.reason);
        }

        // The API response might have the equipment list at the top level,
        // or nested under a 'heroEquipment' or 'equipment' key.
        const rawEquipmentList = data.heroEquipment || data.equipment || (Array.isArray(data) ? data : []);

        if (!Array.isArray(rawEquipmentList)) {
             console.error("Could not find a valid equipment array in the API response.", data);
            throw new Error("Invalid data format received from the server.");
        }

        // The proxy might pre-filter for home village, removing the 'village' property.
        // We accept equipment that is explicitly for 'home' or has no village specified.
        const heroEquipment = rawEquipmentList.filter((eq: any) => eq.village === 'home' || !eq.village);
        
        return heroEquipment.map((eq: any) => ({
            name: eq.name,
            level: eq.level,
        }));

    } catch (error) {
        console.error('Error fetching player data:', error);
        if (error instanceof Error) {
            // Handle generic fetch failures with a more helpful message
            if (error.message.toLowerCase().includes('failed to fetch')) {
                throw new Error('Network error: Could not connect to the server. It might be down or misconfigured.');
            }
            throw error; // Re-throw other specific errors
        }
        throw new Error('An unknown error occurred while fetching player data.');
    }
};