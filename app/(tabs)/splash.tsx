import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home"); 
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable style={styles.container} onPress={() => router.replace("/(tabs)/home")}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/Splashwhite_Subtract.png")}
          style={styles.subtract}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/images/Splashwhite_Text.png")}
          style={styles.text}
          resizeMode="contain"
        />
      </View>
      <StatusBar style="dark" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  logoContainer: { width: width * 0.5, aspectRatio: 2, position: "relative" },
  subtract: { width: "50%", height: "100%", position: "absolute", left: 0, top: 0 },
  text: { width: "55%", height: "70%", position: "absolute", right: 0, top: "15%" },
});