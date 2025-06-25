export interface TokenProfileResponse {
  schemaVersion: string;
  pairs: Pair[];
}

export interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: string[];
  baseToken: Token;
  quoteToken: Token;
  priceNative: string;
  priceUsd: string;
  txns: Record<string, TransactionStats>;
  volume: Record<string, number>;
  priceChange: Record<string, number>;
  liquidity: Liquidity;
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: PairInfo;
  boosts: {
    active: number;
  };
}

interface Token {
  address: string;
  name: string;
  symbol: string;
}

interface TransactionStats {
  buys: number;
  sells: number;
}

interface Liquidity {
  usd: number;
  base: number;
  quote: number;
}

interface PairInfo {
  imageUrl: string;
  websites: Website[];
  socials: Social[];
}

interface Website {
  url: string;
}

interface Social {
  type: string;
  url: string;
}
