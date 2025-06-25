import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const popularTokens = [
  {
    symbol: "LAUNCHCOIN",
    chainId: "solana",
    name: "Launch Coin on Believe",
    address: "Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk",
    trend: "+5.2%",
  },
  {
    symbol: "KLED",
    chainId: "solana",
    name: "KLEDAI",
    address: "1zJX5gRnjLgmTpq5sVwkq69mNDQkCemqoasyjaPW6jm",
    trend: "+3.1%",
  },
  {
    symbol: "BONK",
    chainId: "solana",
    name: "Bonk",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    trend: "+12.8%",
  },
  {
    symbol: "WIF",
    chainId: "solana",
    name: "dogwifhat",
    address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    trend: "-2.4%",
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to token detail page
      router.push(`/solana/${searchQuery.trim()}`);
    }
  };

  const handleTokenSelect = (chainId: string, address: string) => {
    router.push(`/${chainId}/${address}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <ThemedView
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <FontAwesome name="arrow-left" size={16} color="#374151" />
          </TouchableOpacity>

          <ThemedView style={{ flex: 1 }}>
            <ThemedText
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Search Tokens
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Search Input */}
        <ThemedView
          style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 2,
              borderColor: isSearchFocused ? "#3B82F6" : "#E5E7EB",
            }}
          >
            <MaterialIcons
              name="search"
              size={20}
              color={isSearchFocused ? "#3B82F6" : "#6B7280"}
              style={{ marginRight: 12 }}
            />
            <TextInput
              placeholder="Search by token address..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              style={{
                flex: 1,
                fontSize: 16,
                color: "#111827",
                fontWeight: "500",
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={{ marginLeft: 8 }}>
                <MaterialIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </ThemedView>

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleSearch}
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 20,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <ThemedText
                style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}
              >
                Search Token
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Search Tips */}
        <ThemedView
          style={{
            marginHorizontal: 20,
            backgroundColor: "#EFF6FF",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
              padding: 8,
            }}
          >
            <MaterialIcons name="info" size={16} color="#3B82F6" />
            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1E40AF",
                marginLeft: 8,
              }}
            >
              Search Tips
            </ThemedText>
          </ThemedView>
          <ThemedText
            style={{ fontSize: 12, color: "#1E40AF", lineHeight: 18 }}
          >
            • Enter a token address for precise results{"\n"}• Make sure the
            address is valid and on Solana network
          </ThemedText>
        </ThemedView>

        {/* Popular Tokens */}
        <ThemedView style={{ padding: 20, marginBottom: 32 }}>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Popular Tokens
          </ThemedText>

          <ThemedView
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              overflow: "hidden",
            }}
          >
            {popularTokens.map((token, index) => {
              const isPositive = token.trend.startsWith("+");
              const trendColor = isPositive ? "#10B981" : "#EF4444";
              const trendBgColor = isPositive ? "#ECFDF5" : "#FEF2F2";

              return (
                <TouchableOpacity
                  key={token.address}
                  onPress={() =>
                    handleTokenSelect(token.chainId, token.address)
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderBottomWidth:
                      index === popularTokens.length - 1 ? 0 : 1,
                    borderBottomColor: "#F1F5F9",
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
                      marginRight: 12,
                    }}
                  >
                    <MaterialIcons
                      name="trending-up"
                      size={18}
                      color="#3B82F6"
                    />
                  </ThemedView>
                  <ThemedView style={{ flex: 1 }}>
                    <ThemedText
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#111827",
                        marginBottom: 2,
                      }}
                    >
                      {token.symbol}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: "#6B7280" }}>
                      {token.name}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={{ alignItems: "flex-end" }}>
                    <ThemedView
                      style={{
                        backgroundColor: trendBgColor,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginBottom: 4,
                      }}
                    >
                      <ThemedText
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: trendColor,
                        }}
                      >
                        {token.trend}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </TouchableOpacity>
              );
            })}
          </ThemedView>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={{ padding: 20, marginBottom: 32 }}>
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
                  backgroundColor: "#F3E8FF",
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialIcons
                  name="qr-code-scanner"
                  size={20}
                  color="#8B5CF6"
                />
              </ThemedView>
              <ThemedText
                style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}
              >
                Scan QR
              </ThemedText>
            </TouchableOpacity>

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
                  backgroundColor: "#FFFBEB",
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <FontAwesome name="paste" size={20} color="#F59E0B" />
              </ThemedView>
              <ThemedText
                style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}
              >
                Paste
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
