import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Image, Linking, ScrollView, TouchableOpacity } from "react-native";

import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TrendChart } from "@/components/TrendChart";
import { getDexScreenerInfo } from "@/lib/utils";
import type { Pair } from "@/types/token";
import { SafeAreaView } from "react-native-safe-area-context";

function formatUsd(value?: number | string) {
  return `$${value}`;
}

// Enhanced trend chart component with 5-minute data

export default function TokenDetail() {
  const [isPending, setIsPending] = React.useState(false);
  const { chainId, tokenAddress } = useLocalSearchParams();
  const [info, setInfo] = React.useState<Pair | null>(null);

  const fetchTokenInfo = async () => {
    setIsPending(true);
    const chainIdStr = Array.isArray(chainId) ? chainId[0] : chainId;
    const tokenAddrStr = Array.isArray(tokenAddress)
      ? tokenAddress[0]
      : tokenAddress;

    if (!chainIdStr || !tokenAddrStr) return;

    try {
      const data: Pair | null = await getDexScreenerInfo(
        chainIdStr,
        tokenAddrStr
      );
      setInfo(data);
    } catch (err) {
    } finally {
      setIsPending(false);
    }
  };

  React.useEffect(() => {
    fetchTokenInfo();
    const interval = setInterval(() => {
      console.log("Updating token info");
      fetchTokenInfo().catch((err) => {
        console.error("Error in interval fetch:", err);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [chainId, tokenAddress]);

  if (!info && isPending) {
    return (
      <SafeAreaView>
        <ThemedView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F8FAFC",
          }}
        >
          <ThemedView
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 40,
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#E5E7EB",
            }}
          >
            <ThemedView
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 30,
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <MaterialIcons name="hourglass-empty" size={28} color="#FFFFFF" />
            </ThemedView>
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#111827",
                textAlign: "center",
              }}
            >
              Loading Token Details
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 14,
                color: "#6B7280",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Please wait while we fetch the latest data...
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!info) {
    return (
      <SafeAreaView>
        <ThemedView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F8FAFC",
          }}
        >
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#111827",
              textAlign: "center",
            }}
          >
            Token not found
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const {
    baseToken,
    quoteToken,
    priceUsd,
    priceNative,
    marketCap,
    fdv,
    liquidity,
    txns,
    priceChange,
    volume,
    pairCreatedAt,
    info: pairInfo,
    boosts,
  } = info;

  const age = Math.floor((Date.now() - pairCreatedAt) / (1000 * 60 * 60 * 24));

  return (
    <SafeAreaView>
      <ScrollView
        style={{ backgroundColor: "#F8FAFC" }}
        contentContainerStyle={{
          paddingBottom: 32,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <Card style={{ alignItems: "center", marginBottom: 16 }}>
          <ThemedView
            style={{
              backgroundColor: "#F1F5F9",
              borderRadius: 50,
              width: 100,
              height: 100,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {pairInfo?.imageUrl ? (
              <Image
                source={{ uri: pairInfo.imageUrl }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                }}
              />
            ) : (
              <MaterialIcons
                name="currency-exchange"
                size={40}
                color="#6B7280"
              />
            )}
          </ThemedView>

          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#111827",
              textAlign: "center",
            }}
          >
            {baseToken.symbol}
          </ThemedText>

          <ThemedText
            style={{
              fontSize: 16,
              color: "#6B7280",
              marginTop: 4,
              textAlign: "center",
            }}
          >
            {baseToken.name}
          </ThemedText>

          <ThemedView
            style={{
              backgroundColor: "#EEF2FF",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              marginTop: 12,
            }}
          >
            <ThemedText
              style={{
                fontSize: 12,
                color: "#4F46E5",
                fontWeight: "600",
              }}
            >
              {age} days old
            </ThemedText>
          </ThemedView>
        </Card>

        {/* Price Cards */}
        <Card>
          <ThemedView style={{ flexDirection: "row", gap: 16 }}>
            <MetricCard
              title="USD Price"
              value={formatUsd(priceUsd)}
              icon="attach-money"
            />
            <MetricCard
              title="Native Price"
              value={formatUsd(priceNative)}
              icon="currency-exchange"
            />
          </ThemedView>
        </Card>

        {/* Trend Chart */}
        <TrendChart priceChange={priceChange} />

        {/* Market Data */}
        <Card>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Market Data
          </ThemedText>

          <InfoRow label="Market Cap" value={formatUsd(marketCap)} />
          <InfoRow label="Fully Diluted Value" value={formatUsd(fdv)} />
          <InfoRow label="Liquidity (USD)" value={formatUsd(liquidity.usd)} />
          <InfoRow label="Volume (24h)" value={formatUsd(volume.h24)} />
          <InfoRow label="Active Boosts" value={boosts?.active ?? 0} isLast />
        </Card>

        {/* Trading Activity */}
        <Card>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Trading Activity
          </ThemedText>

          {/* 24h Activity */}
          <ThemedView style={{ marginBottom: 20 }}>
            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 12,
              }}
            >
              24 Hour Activity
            </ThemedText>
            <ThemedView
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <ThemedView style={{ alignItems: "center" }}>
                <ThemedView
                  style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons name="trending-up" size={20} color="#10B981" />
                </ThemedView>
                <ThemedText style={{ fontSize: 12, color: "#6B7280" }}>
                  Buys
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "700", color: "#10B981" }}
                >
                  {String(txns.h24?.buys || 0)}
                </ThemedText>
              </ThemedView>

              <ThemedView style={{ alignItems: "center" }}>
                <ThemedView
                  style={{
                    backgroundColor: "#FEF2F2",
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons
                    name="trending-down"
                    size={20}
                    color="#EF4444"
                  />
                </ThemedView>
                <ThemedText style={{ fontSize: 12, color: "#6B7280" }}>
                  Sells
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "700", color: "#EF4444" }}
                >
                  {String(txns.h24?.sells || 0)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Recent Activity (5m) */}
          <ThemedView
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Recent Activity (5 min)
            </ThemedText>
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 8,
              }}
            >
              <ThemedView style={{ alignItems: "center" }}>
                <ThemedText style={{ fontSize: 12, color: "#6B7280" }}>
                  Buys
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 14, fontWeight: "600", color: "#10B981" }}
                >
                  {String(txns.m5?.buys || 0)}
                </ThemedText>
              </ThemedView>
              <ThemedView style={{ alignItems: "center" }}>
                <ThemedText style={{ fontSize: 12, color: "#6B7280" }}>
                  Sells
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 14, fontWeight: "600", color: "#EF4444" }}
                >
                  {String(txns.m5?.sells || 0)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Card>

        {/* Liquidity Details */}
        <Card>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Liquidity Details
          </ThemedText>

          <InfoRow
            label="Base Token Liquidity"
            value={liquidity.base.toFixed(2)}
          />
          <InfoRow
            label="Quote Token Liquidity"
            value={liquidity.quote.toFixed(2)}
            isLast
          />
        </Card>

        {/* Links */}
        {(pairInfo.websites.length > 0 || pairInfo.socials.length > 0) && (
          <Card>
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 16,
              }}
            >
              Links & Social
            </ThemedText>

            {pairInfo.websites.length > 0 && (
              <ThemedView style={{ marginBottom: 16 }}>
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Website
                </ThemedText>
                {pairInfo?.websites.map((w, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => Linking.openURL(w.url)}
                    style={{
                      backgroundColor: "#EEF2FF",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      marginBottom: 4,
                    }}
                  >
                    <ThemedText style={{ color: "#4F46E5", fontSize: 14 }}>
                      {w.url}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            )}

            {pairInfo?.socials.length > 0 && (
              <ThemedView>
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Social Media
                </ThemedText>
                {pairInfo.socials.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => Linking.openURL(s.url)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F8FAFC",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 8,
                      marginBottom: 4,
                    }}
                  >
                    <FontAwesome
                      name={s.type?.toLowerCase() as any}
                      size={16}
                      color="#6B7280"
                      style={{ marginRight: 10 }}
                    />
                    <ThemedText style={{ color: "#4F46E5", fontSize: 14 }}>
                      @{s.url?.split("/").pop()}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: any;
  isLast?: boolean;
}) => (
  <ThemedView
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: "#F1F5F9",
    }}
  >
    <ThemedText style={{ fontSize: 14, color: "#6B7280", fontWeight: "500" }}>
      {label}
    </ThemedText>
    <ThemedView>
      {typeof value === "string" || typeof value === "number" ? (
        <ThemedText
          style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}
        >
          {value}
        </ThemedText>
      ) : React.isValidElement(value) ? (
        value
      ) : (
        <ThemedText>-</ThemedText>
      )}
    </ThemedView>
  </ThemedView>
);

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: any;
  subtitle?: string;
  icon?: string;
}) => (
  <ThemedView
    style={{
      backgroundColor: "#F8FAFC",
      borderRadius: 12,
      padding: 16,
      flex: 1,
      marginHorizontal: 4,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#E5E7EB",
    }}
  >
    {icon && (
      <ThemedView
        style={{
          backgroundColor: "#3B82F6",
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <MaterialIcons name={icon as any} size={20} color="#FFFFFF" />
      </ThemedView>
    )}
    <ThemedText
      style={{
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "500",
        textAlign: "center",
      }}
    >
      {title}
    </ThemedText>
    {typeof value === "string" || typeof value === "number" ? (
      <ThemedText
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#111827",
          marginTop: 4,
          textAlign: "center",
        }}
      >
        {value}
      </ThemedText>
    ) : React.isValidElement(value) ? (
      value
    ) : (
      <ThemedText>-</ThemedText>
    )}
    {subtitle && (
      <ThemedText
        style={{
          fontSize: 10,
          color: "#9CA3AF",
          marginTop: 2,
          textAlign: "center",
        }}
      >
        {subtitle}
      </ThemedText>
    )}
  </ThemedView>
);
