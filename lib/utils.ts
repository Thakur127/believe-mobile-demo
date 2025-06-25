import { Pair } from "@/types/token";

const DEXSCREENER_API = "https://api.dexscreener.com";
const BELIEVE_BASE_URL = "https://www.believescreener.com/token";

const checkTokenOnBelieve = async (
  tokenAddress: string
): Promise<string | null> => {
  try {
    // console.log("Checking token on Believe", tokenAddress);
    const res = await fetch(`${BELIEVE_BASE_URL}/${tokenAddress}`);
    const html = await res.text();
    return html.toLowerCase().includes("token not found") ? null : tokenAddress;
  } catch (err) {
    console.error(`❌ Error verifying ${tokenAddress}`, err);
    return null;
  }
};

export const getDexScreenerInfo = async (
  chainId: string,
  tokenAddress: string
) => {
  try {
    const res = await fetch(
      `${DEXSCREENER_API}/tokens/v1/${chainId}/${tokenAddress}`
    );
    const json = ((await res.json()) as Pair[])[0];
    return json;
  } catch (err) {
    console.error(`❌ Failed to fetch info for ${tokenAddress}`, err);
    return null;
  }
};

export async function processBoostedTokens(): Promise<Pair[]> {
  try {
    // Fetch all token lists in parallel
    const [latestBoosts, topBoosts, latestProfiles] = await Promise.all([
      fetch(`${DEXSCREENER_API}/token-boosts/latest/v1`).then(async (res) => {
        const json = await res.json();
        console.log("Total latestBoosts", json.length);
        return json;
      }),
      fetch(`${DEXSCREENER_API}/token-boosts/top/v1`).then(async (res) => {
        const json = await res.json();
        console.log("Total topBoosts", json.length);
        return json;
      }),
      fetch(`${DEXSCREENER_API}/token-profiles/latest/v1`).then(async (res) => {
        const json = await res.json();
        console.log("Total latestProfiles", json.length);
        return json;
      }),
    ]);

    // Flatten and deduplicate by tokenAddress (assumes same token address means same token across chainId)
    const tokenMap = new Map<
      string,
      { chainId: string; tokenAddress: string }
    >();

    [...latestBoosts, ...topBoosts, ...latestProfiles].forEach((t: any) => {
      const key = `${t.chainId}:${t.tokenAddress}`;
      if (!tokenMap.has(key)) {
        tokenMap.set(key, {
          chainId: t.chainId,
          tokenAddress: t.tokenAddress,
        });
      }
    });

    const uniqueTokens = Array.from(tokenMap.values());

    // Verify on Believe
    const verified = await Promise.all(
      uniqueTokens.map(({ tokenAddress }) => checkTokenOnBelieve(tokenAddress))
    );

    const validTokens = uniqueTokens.filter(
      ({ tokenAddress }, idx) => verified[idx] !== null
    );

    console.log(`✅ ${validTokens.length} tokens found on BelieveScreener`);

    // Get pair info for each valid token
    const results = await Promise.all(
      validTokens.map(({ chainId, tokenAddress }) =>
        getDexScreenerInfo(chainId, tokenAddress)
      )
    );

    results.forEach((info, idx) => {
      if (info) {
        console.log(`🔍 ${validTokens[idx].tokenAddress}`);
        console.dir(info, { depth: 2 });
      }
    });

    return results.filter(Boolean) as Pair[];
  } catch (err) {
    console.error("💥 Error processing boosted tokens", err);
    return [];
  }
}
