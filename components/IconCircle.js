
import React from "react";
import { View, Text } from "react-native";

export function IconCircle({
  emoji,
  backgroundColor = "lightblue",
  size = 48,
  style,
}) {
  return (
    <View
      style={[
        {
          backgroundColor,
          width: size,
          height: size,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
    </View>
  );
}
