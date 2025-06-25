import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Card } from "./Card";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const { width: screenWidth } = Dimensions.get("window");

export const TrendChart = ({
  priceChange,
}: {
  priceChange: Record<string, number>;
}) => {
  const chartWidth = screenWidth - 80;
  const chartHeight = 120;
  const padding = 20;

  // Generate more accurate price data based on actual price changes
  const generatePriceData = () => {
    const basePrice = 100;
    const m5Change = priceChange.m5 || 0;
    const h1Change = priceChange.h1 || 0;
    const h6Change = priceChange.h6 || 0;
    const h24Change = priceChange.h24 || 0;

    // Create data points based on actual time intervals
    return [
      { time: "24h", price: basePrice, label: "24h ago" },
      { time: "18h", price: basePrice + h24Change * 0.25, label: "18h ago" },
      { time: "12h", price: basePrice + h24Change * 0.5, label: "12h ago" },
      { time: "6h", price: basePrice + h6Change, label: "6h ago" },
      { time: "3h", price: basePrice + h6Change * 0.7, label: "3h ago" },
      { time: "1h", price: basePrice + h1Change, label: "1h ago" },
      { time: "5m", price: basePrice + m5Change, label: "5m ago" },
      { time: "now", price: basePrice + h24Change, label: "Now" },
    ];
  };

  const data = generatePriceData();
  const maxPrice = Math.max(...data.map((d) => d.price));
  const minPrice = Math.min(...data.map((d) => d.price));
  const priceRange = maxPrice - minPrice || 1;

  const getX = (index: number) =>
    padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
  const getY = (price: number) =>
    padding + ((maxPrice - price) / priceRange) * (chartHeight - 2 * padding);

  const pathData = data
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.price);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  const isPositiveTrend = data[data.length - 1].price > data[0].price;
  const lineColor = isPositiveTrend ? "#10B981" : "#EF4444";
  const gradientColor = isPositiveTrend ? "#ECFDF5" : "#FEF2F2";

  function formatPercent(value?: number) {
    if (value === undefined || value === null)
      return <ThemedText>-</ThemedText>;
    const color = value > 0 ? "#10B981" : value < 0 ? "#EF4444" : "#6B7280";
    const bgColor = value > 0 ? "#ECFDF5" : value < 0 ? "#FEF2F2" : "#F3F4F6";
    const icon =
      value > 0
        ? "trending-up"
        : value < 0
          ? "trending-down"
          : "horizontal-rule";

    return (
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: bgColor,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          alignSelf: "flex-start",
        }}
      >
        <MaterialIcons name={icon} size={16} color={color} />
        <ThemedText
          style={{ marginLeft: 4, color, fontSize: 14, fontWeight: "600" }}
        >
          {value.toFixed(2)}%
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <Card>
      <ThemedText
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#111827",
          marginBottom: 16,
        }}
      >
        Price Trend Chart
      </ThemedText>

      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Path
            key={i}
            d={`M ${padding} ${padding + (i * (chartHeight - 2 * padding)) / 4} L ${chartWidth - padding} ${padding + (i * (chartHeight - 2 * padding)) / 4}`}
            stroke="#E5E7EB"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}

        {/* Price line */}
        <Path
          d={pathData}
          stroke={lineColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((point, index) => (
          <Circle
            key={index}
            cx={getX(index)}
            cy={getY(point.price)}
            r="4"
            fill={lineColor}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ))}
      </Svg>

      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <ThemedText style={{ fontSize: 12, color: "#6B7280" }}>
          24h ago
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: "#6B7280" }}>
          5m ago
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: "#6B7280" }}>Now</ThemedText>
      </ThemedView>

      {/* Price change indicators */}
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
        }}
      >
        <ThemedView style={{ alignItems: "center" }}>
          <ThemedText
            style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}
          >
            5 Min
          </ThemedText>
          {formatPercent(priceChange.m5)}
        </ThemedView>
        <ThemedView style={{ alignItems: "center" }}>
          <ThemedText
            style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}
          >
            1 Hour
          </ThemedText>
          {formatPercent(priceChange.h1)}
        </ThemedView>
        <ThemedView style={{ alignItems: "center" }}>
          <ThemedText
            style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}
          >
            6 Hours
          </ThemedText>
          {formatPercent(priceChange.h6)}
        </ThemedView>
        <ThemedView style={{ alignItems: "center" }}>
          <ThemedText
            style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}
          >
            24 Hours
          </ThemedText>
          {formatPercent(priceChange.h24)}
        </ThemedView>
      </ThemedView>
    </Card>
  );
};
