import { Image, StyleSheet, Text, View } from "react-native";

export default function DateHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.todayRow}>
        <Image
          source={require("../assets/icons/date.png")}
          style={styles.icon}
          resizeMode="contain"
        />

        <Text style={styles.todayText}>Today</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },

  todayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },

  todayText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2F2F2F",
    includeFontPadding: false,
  },
});