"use client";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { processBoostedTokens } from "@/lib/utils";
import type { Pair } from "@/types/token";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as React from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const statData = [
  {
    title: "Total Market Cap",
    value: "$2.1T",
    icon: "account-balance",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    change: "+5.2%",
  },
  {
    title: "24h Volume",
    value: "$89.2B",
    icon: "bar-chart",
    color: "#10B981",
    bgColor: "#ECFDF5",
    change: "+12.8%",
  },
  {
    title: "Active Pairs",
    value: "1,247",
    icon: "swap-horiz",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    change: "+3.1%",
  },
  {
    title: "Total Liquidity",
    value: "$45.6B",
    icon: "water-drop",
    color: "#8B5CF6",
    bgColor: "#F3E8FF",
    change: "+7.4%",
  },
];

export default function Index() {
  const [isPending, setIsPending] = React.useState(false);
  const [tokenProfiles, setTokenProfiles] = React.useState<Pair[]>();
  const [refreshing, setRefreshing] = React.useState(false);

  const getTokens = async () => {
    setIsPending(true);
    try {
      const data: Pair[] = await processBoostedTokens();
      setTokenProfiles(data);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setIsPending(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getTokens();
    setRefreshing(false);
  };

  React.useEffect(() => {
    getTokens();

    const interval = setInterval(() => {
      console.log("Updating tokens");
      getTokens();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <ThemedView
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 24,
            backgroundColor: "#FFFFFF",
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            marginBottom: 20,
          }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <ThemedView>
              <ThemedText
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                Believe
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  fontWeight: "500",
                }}
              >
                Decentralized Exchange
              </ThemedText>
            </ThemedView>
            <TouchableOpacity
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 20,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="notifications" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </ThemedView>

          {/* Live Status Indicator */}
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#ECFDF5",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: "flex-start",
            }}
          >
            <ThemedView
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#10B981",
                marginRight: 8,
              }}
            />
            <ThemedText
              style={{ fontSize: 12, color: "#059669", fontWeight: "600" }}
            >
              Live Data
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Stats Cards */}
        <ThemedView style={{ padding: 20, marginBottom: 24 }}>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Market Overview
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {statData.map((stat, index) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                bgColor={stat.bgColor}
                change={stat.change}
                isLast={index === statData.length - 1}
              />
            ))}
          </ScrollView>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={{ padding: 20, marginBottom: 24 }}>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </ThemedText>
          <ThemedView style={{ flexDirection: "row", gap: 12 }}>
            <Link href="/search" asChild>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <ThemedView
                  style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons name="search" size={20} color="#3B82F6" />
                </ThemedView>
                <ThemedText
                  style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}
                >
                  Search
                </ThemedText>
              </TouchableOpacity>
            </Link>

            <Link
              href="/solana/Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk"
              asChild
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
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
                  <MaterialIcons name="star" size={20} color="#10B981" />
                </ThemedView>
                <ThemedText
                  style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}
                >
                  Test Token
                </ThemedText>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
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
                <MaterialIcons name="favorite" size={20} color="#EF4444" />
              </ThemedView>
              <ThemedText
                style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}
              >
                Watchlist
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Token List */}
        <ThemedView style={{ padding: 20 }}>
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Trending Tokens
            </ThemedText>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F3F4F6",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <MaterialIcons name="filter-list" size={16} color="#6B7280" />
              <ThemedText
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginLeft: 4,
                  fontWeight: "500",
                }}
              >
                Filter
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              overflow: "hidden",
            }}
          >
            <FlatList
              data={tokenProfiles}
              keyExtractor={(item) => item.pairAddress}
              renderItem={({ item, index }) => (
                <TokenRow
                  token={item}
                  isLast={index === (tokenProfiles?.length || 0) - 1}
                />
              )}
              ListHeaderComponent={<TokenListHeader />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              ListEmptyComponent={
                isPending ? (
                  <ThemedView
                    style={{ alignItems: "center", paddingVertical: 40 }}
                  >
                    <ThemedView
                      style={{
                        backgroundColor: "#EFF6FF",
                        borderRadius: 30,
                        width: 60,
                        height: 60,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <MaterialIcons
                        name="hourglass-empty"
                        size={28}
                        color="#3B82F6"
                      />
                    </ThemedView>
                    <ThemedText
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Loading Tokens
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontSize: 14,
                        color: "#6B7280",
                        textAlign: "center",
                      }}
                    >
                      Fetching the latest market data...
                    </ThemedText>
                  </ThemedView>
                ) : (
                  <ThemedView
                    style={{ alignItems: "center", paddingVertical: 40 }}
                  >
                    <ThemedView
                      style={{
                        backgroundColor: "#F3F4F6",
                        borderRadius: 30,
                        width: 60,
                        height: 60,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <MaterialIcons
                        name="search-off"
                        size={28}
                        color="#6B7280"
                      />
                    </ThemedView>
                    <ThemedText
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      No Tokens Found
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontSize: 14,
                        color: "#6B7280",
                        textAlign: "center",
                      }}
                    >
                      Try refreshing or check back later
                    </ThemedText>
                  </ThemedView>
                )
              }
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatCard = ({
  value,
  title,
  icon,
  color,
  bgColor,
  change,
  isLast,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
  change: string;
  isLast: boolean;
}) => {
  return (
    <ThemedView
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginRight: isLast ? 0 : 16,
        minWidth: 160,
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <ThemedView
          style={{
            backgroundColor: bgColor,
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name={icon as any} size={20} color={color} />
        </ThemedView>
        <ThemedView
          style={{
            backgroundColor: "#ECFDF5",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <ThemedText
            style={{ fontSize: 10, color: "#059669", fontWeight: "600" }}
          >
            {change}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: "#111827",
          marginBottom: 4,
        }}
      >
        {value}
      </ThemedText>
      <ThemedText style={{ fontSize: 12, color: "#6B7280", fontWeight: "500" }}>
        {title}
      </ThemedText>
    </ThemedView>
  );
};

const TokenListHeader = () => (
  <ThemedView
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: "#F8FAFC",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
    }}
  >
    <ThemedText
      style={{ fontWeight: "600", fontSize: 14, color: "#374151", flex: 2 }}
    >
      Token
    </ThemedText>
    <ThemedText
      style={{
        fontWeight: "600",
        fontSize: 14,
        color: "#374151",
        textAlign: "center",
        flex: 1,
      }}
    >
      24h Change
    </ThemedText>
    <ThemedText
      style={{
        fontWeight: "600",
        fontSize: 14,
        color: "#374151",
        textAlign: "right",
        flex: 1,
      }}
    >
      Price
    </ThemedText>
  </ThemedView>
);

const TokenRow = ({ token, isLast }: { token: Pair; isLast: boolean }) => {
  const change = Number.parseFloat(
    token.priceChange["h24"]?.toString().replace("%", "") || "0"
  );
  const isPositive = change > 0;
  const iconName = isPositive ? "trending-up" : "trending-down";
  const changeColor = isPositive ? "#10B981" : "#EF4444";
  const changeBgColor = isPositive ? "#ECFDF5" : "#FEF2F2";

  return (
    <Link href={`/${token.chainId}/${token.baseToken.address}`} asChild>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: "#F1F5F9",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedView style={{ flex: 2 }}>
          <ThemedText
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#111827",
              marginBottom: 4,
            }}
          >
            {token.baseToken.symbol}
          </ThemedText>
          <ThemedText
            style={{ color: "#6B7280", fontSize: 12, fontWeight: "500" }}
          >
            MCAP: ${(token.marketCap / 1000000).toFixed(1)}M
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ flex: 1, alignItems: "center" }}>
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: changeBgColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <MaterialIcons name={iconName} size={14} color={changeColor} />
            <ThemedText
              style={{
                marginLeft: 4,
                fontSize: 12,
                fontWeight: "600",
                color: changeColor,
              }}
            >
              {Math.abs(change).toFixed(2)}%
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={{ flex: 1, alignItems: "flex-end" }}>
          <ThemedText
            style={{ color: "#111827", fontSize: 14, fontWeight: "600" }}
          >
            ${Number.parseFloat(token.priceUsd).toFixed(6)}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
};
