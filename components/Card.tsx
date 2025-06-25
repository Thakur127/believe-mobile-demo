import { ThemedView } from "./ThemedView";

export const Card = ({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: any;
}) => (
  <ThemedView
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      ...style,
    }}
  >
    {children}
  </ThemedView>
);
