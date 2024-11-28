import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import tw from "twrnc";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  fetchPropertiesAtom,
  propertiesAtom,
  propertiesLoadingAtom,
  propertiesErrorAtom,
} from "../data/atoms";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { useGlobalStore } from "../data/store";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

export default function HomeScreen() {
  const fetchProperties = async () => {
    const response = await fetch("http://localhost:3000/properties");
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const setSelectedProperty = useGlobalStore(
    (state: any) => state.setSelectedProperty
  );

  const [searchQuery, setSearchQuery] = useState("");

  const renderProperty = ({ item }: any) => {
    return (
      <View style={tw`bg-white rounded-lg mb-5 shadow-lg p-4`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-3`}
        >
          {item?.images.map((image: any, index: any) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={tw`w-64 h-40 mr-3 rounded-lg`}
            />
          ))}
        </ScrollView>

        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text
            style={[tw`text-lg font-bold text-gray-800`, { maxWidth: 250 }]}
          >
            {item.title}
          </Text>
          <Text style={tw`text-lg font-semibold text-pink-600`}>
            ${item.price}/month
          </Text>
        </View>
        <Text style={tw`text-sm text-gray-600 mb-2`}>
          {item.location.address}, {item.location.city}, {item.location.state}
        </Text>
        <View style={tw`flex-row flex-wrap`}>
          {item.features.map(
            (
              feature:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined,
              index: Key | null | undefined
            ) => (
              <View
                key={index}
                style={tw`bg-pink-100 px-2 py-1 rounded-full mr-2 mb-2`}
              >
                <Text style={tw`text-xs text-pink-600`}>{feature}</Text>
              </View>
            )
          )}
        </View>

        <View style={tw`flex items-center justify-center mt-2.5`}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              router.push("/explore");
              setSelectedProperty(item);
            }}
            style={tw`bg-pink-600 px-4 py-2 rounded`}
          >
            <Text style={tw`text-lg font-bold text-pink-100`}>Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredProperties = data?.filter((property: any) => {
    const titleMatch = property.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const cityMatch = property.location.city
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return titleMatch || cityMatch;
  });

  return (
    <View style={tw`flex-1 bg-gray-100 px-5 pt-10`}>
      <SafeAreaView>
        {/* Top Header */}
        <View style={tw`flex-row justify-between mb-4`}>
          <View
            style={tw`rounded-full h-8 w-8 bg-white items-center justify-center`}
          >
            <Feather name="user" size={24} color="#FF6FA3" />
          </View>
          <View
            style={tw`rounded-full h-8 w-8 bg-white items-center justify-center`}
          >
            <Ionicons name="notifications" size={24} color="#FF6FA3" />
          </View>
        </View>
        <View
          style={tw`flex-row items-center border border-gray-300 rounded-md py-2 px-3 bg-white mb-4`}
        >
          <Feather name="search" size={24} color="#6A7380" />
          <TextInput
            style={tw`text-gray-500 ml-2`}
            placeholder="Search here"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          data={filteredProperties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 180, flexGrow: 1 }}
        />

        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}
