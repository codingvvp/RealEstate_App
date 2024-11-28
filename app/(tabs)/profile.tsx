import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "../data/store";
import { useEffect } from "react";

export default function ProfileScreen() {

  const fetchProfile = async () => {
    const response = await fetch("http://localhost:3000/profile");
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  console.log("data", data)

  return (
    <View style={tw`flex-1 bg-gray-100 px-5 pt-10`}>
      <SafeAreaView>
        <View style={tw`flex-row items-center justify-between mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800`}>Profile</Text>
          <View
            style={tw`rounded-full h-8 w-8 bg-white items-center justify-center`}
          >
            <Feather name="settings" size={24} color="#FF6FA3" />
          </View>
        </View>
        <View style={tw`bg-white rounded-lg p-4 shadow`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>
            {data?.name}
          </Text>
          <Text style={tw`text-sm text-gray-600 mb-2`}>
            Email: {data?.email}
          </Text>
          <Text style={tw`text-sm text-gray-600`}>User ID: {data?.id}</Text>
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}
