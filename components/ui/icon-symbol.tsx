// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "camera.fill": "camera-alt",
  "arrow.3.trianglepath": "recycling",
  leaf: "eco",
  "leaf.fill": "eco",
  "exclamationmark.triangle": "warning",
  cpu: "memory",
  trash: "delete",
  "trash.fill": "delete",
  qrcode: "qr-code-scanner",
  "checkmark.circle.fill": "check-circle",
  "star.fill": "star",
  "shield.fill": "security",
  globe: "public",
  "lightbulb.fill": "lightbulb",
  "tree.fill": "park",
  "drop.fill": "water-drop",
  "bolt.fill": "flash-on",
  "cloud.sun": "wb-sunny",
  ellipsis: "more-horiz",
  cube: "view-in-ar",
  "square.and.arrow.up": "share",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName | string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = (MAPPING as Record<string, string>)[name] || "help-outline";
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconName as ComponentProps<typeof MaterialIcons>["name"]}
      style={style}
    />
  );
}
