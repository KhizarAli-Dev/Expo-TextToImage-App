import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Buffer } from "buffer";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

export default function Index({ navigation }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!text) {
      Alert.alert("Please Enter a Prompt");
      return;
    }
    setLoading(true);
    setImage(null);
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const base64Image = `data:image/png;base64,${Buffer.from(
        response.data,
        "binary"
      ).toString("base64")}`;
      setImage(base64Image);

      await saveImage(base64Image);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert(
        "Error",
        "Failed to Generate Image: " +
          (error.response ? error.response.data : error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const saveImage = async (base64Image) => {
    try {
      const storedImages = await AsyncStorage.getItem("images");
      const imagesArray = storedImages ? JSON.parse(storedImages) : [];
      imagesArray.push(base64Image);
      await AsyncStorage.setItem("images", JSON.stringify(imagesArray));
    } catch (error) {
      console.error("Failed to save image:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]} // Gradient colors
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Text to Image Generator</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Prompt"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={generateImage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Generating..." : "Generate Image"}
          </Text>
        </TouchableOpacity>

        {/* <Link href={"/previous"} style={styles.link}>
          View Previous Images
        </Link> */}

        {loading && (
          <ActivityIndicator
            size="large"
            color="#007BFF"
            style={styles.loader}
          />
        )}
        {image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    width: "90%",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    fontSize: 16,
    color: "#fff",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  imageContainer: {
    width: 320,
    height: 320,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
