import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

export default function Previous() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem("images");
        if (storedImages) {
          setImages(JSON.parse(storedImages));
        }
      } catch (error) {
        console.error("Failed to load images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="cover" // Use "cover" for a better fit
      />
    </View>
  );

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]} // Gradient colors
      style={styles.gradient}
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderImage}
            numColumns={2} // Set the number of columns for the grid layout
            columnWrapperStyle={styles.row} // Style for the row of columns
          />
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
    padding: 16,
    backgroundColor: "transparent", // Keep transparent to show gradient background
  },
  imageContainer: {
    flex: 1,
    margin: 8, // Add margin around each image container
    borderRadius: 16, // Rounded corners for the container
    overflow: 'hidden', // Ensure border radius is applied to image
  },
  image: {
    width: "100%",
    height: 200, // Adjust height to fit your layout
  },
  row: {
    justifyContent: 'space-between', // Space out columns evenly
  },
});
