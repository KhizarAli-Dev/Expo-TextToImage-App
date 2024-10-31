import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Buffer } from "buffer";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Index({ navigation }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!text) {
      Alert.alert("Please Enter Prompt");
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

      console.log("API Response:", response.data);

      // Convert binary data to base64
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
        "Failed To Generate Image: " +
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
    <View style={styles.container}>
      <Text style={styles.heading}>Text To Image Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Prompt"
        value={text}
        onChangeText={setText}
      />
      <Button
        title={loading ? "Generating Image..." : "Generate Image"}
        onPress={generateImage}
        disabled={loading}
      />

      <Link href={"/previous"}>Previous</Link>

      {loading && (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      )}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  loader: {
    marginVertical: 16,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 16,
    borderRadius: 8,
  },
});
