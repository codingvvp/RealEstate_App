import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { SafeAreaView, View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import tw from "twrnc";
import { useGlobalStore } from "../data/store";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

export default function BookingMapScreen() {
  const isFocus = useIsFocused();
  const selectedProperty = useGlobalStore(
    (state: any) => state.selectedProperty
  );

  console.log("selectedPropertie", selectedProperty?.id);

  const fetchBookings = async () => {
    const response = await fetch(`http://localhost:3000/bookings`);
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  useEffect(() => {
    if (isFocus) {
      fetchBookings();
    }
  }, [isFocus]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !data || !selectedProperty?.location?.coordinates) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-red-600`}>
          Failed to load data or property details!
        </Text>
      </View>
    );
  }

  const booking = data[0];
  const { latitude, longitude } = selectedProperty?.location?.coordinates;

  console.log("DATA", booking);

  return (
    <View style={tw`flex-1`}>
      <SafeAreaView style={tw`flex-1 pt-10`}>
        {selectedProperty?.id == booking?.id ? (
          <>
            <View style={tw`mb-4 p-4`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>
                {selectedProperty?.title}
              </Text>
              <Text style={tw`text-sm text-gray-600`}>
                Check-In: {booking?.checkIn || "N/A"}
              </Text>
              <Text style={tw`text-sm text-gray-600`}>
                Check-Out: {booking?.checkOut || "N/A"}
              </Text>
              <Text style={tw`text-sm text-green-600`}>
                Status: {booking?.status || "Unknown"}
              </Text>
            </View>

            <MapView
              style={tw`flex-1`}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude, longitude }}
                title={selectedProperty?.title || "Property"}
                description={`Check-In: ${
                  booking?.checkIn || "N/A"
                }, Check-Out: ${booking?.checkOut || "N/A"}`}
              />
            </MapView>
          </>
        ) : (
          <View style={tw`flex-1 justify-center items-center`}>            
            <Text>No data found</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
