import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQuery } from 'react-query';
import { UserRepositoryImpl } from '../../data/repository/UserRepositoryImpl';
import { GetUserByIdUseCase } from '../../domain/usecase/GetUserByIdUseCase';
import { User } from '../../domain/entity/User';

export default function UserDetailsScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const id = Number(userId);
  
  // Set up repository and use case
  const userRepository = new UserRepositoryImpl();
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  
  // Fetch user data
  const { data: user, isLoading, isError, error, refetch } = useQuery<User, Error>(
    ['user', id],
    () => getUserByIdUseCase.execute(id)
  );

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getBackgroundColor = (id?: number) => {
    if (!id) return 'bg-indigo-500';
    const colors = [
      'bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 
      'bg-pink-500', 'bg-amber-500', 'bg-sky-500'
    ];
    return colors[id % colors.length];
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <View className="bg-white p-6 rounded-2xl shadow-md">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-gray-600 mt-4 font-medium text-center">Loading user details...</Text>
        </View>
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-100">
        <View className="bg-white p-6 rounded-2xl shadow-md items-center w-full max-w-sm">
          <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
            <Feather name="alert-circle" size={32} color="#ef4444" />
          </View>
          <Text className="text-gray-800 text-lg font-bold mb-2 text-center">Failed to load user</Text>
          <Text className="text-red-500 text-base mb-6 text-center">
            {error?.message || 'User not found'}
          </Text>
          <TouchableOpacity 
            className="bg-indigo-600 px-6 py-3 rounded-lg w-full mb-3" 
            onPress={() => refetch()}
          >
            <Text className="text-white font-bold text-center">Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-gray-200 px-6 py-3 rounded-lg w-full" 
            onPress={() => router.back()}
          >
            <Text className="text-gray-800 font-bold text-center">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white py-6 shadow-sm items-center">
        <TouchableOpacity 
          className="absolute left-4 top-6 bg-gray-100 p-2 rounded-full"
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color="#4f46e5" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">User Details</Text>
      </View>
      
      {/* User profile */}
      <View className="bg-white rounded-xl shadow-sm mx-4 my-4 overflow-hidden">
        <View className="items-center py-6 border-b border-gray-100">
          <View className={`w-24 h-24 rounded-full ${getBackgroundColor(user.id)} items-center justify-center mb-3`}>
            <Text className="text-white font-bold text-2xl">{getInitials(user.name)}</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800 mt-2">{user.name}</Text>
          <View className="flex-row items-center mt-1">
            <Feather name="mail" size={16} color="#6b7280" />
            <Text className="text-base text-gray-500 ml-2">{user.email}</Text>
          </View>
        </View>
        
        {/* User details section */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Details</Text>
          
          <DetailItem icon="hash" label="ID" value={user.id.toString()} />
          <DetailItem icon="user" label="Name" value={user.name || 'Not available'} />
          <DetailItem icon="phone" label="Phone" value={user.phone || 'Not available'} />
          <DetailItem icon="globe" label="Website" value={user.website || 'Not available'} />
          
          {user.company && (
            <>
              <Text className="text-lg font-semibold text-gray-800 mt-6 mb-3">Company</Text>
              <DetailItem icon="briefcase" label="Name" value={user.company.name || 'Not available'} />
              {/* <DetailItem icon="info" label="Catch Phrase" value={user.company.catchPhrase || 'Not available'} />
              <DetailItem icon="activity" label="Business" value={user.company.bs || 'Not available'} /> */}
            </>
          )}
          
          {user.address && (
            <>
              <Text className="text-lg font-semibold text-gray-800 mt-6 mb-3">Address</Text>
              <DetailItem icon="map-pin" label="Street" value={user.address.street || 'Not available'} />
              <DetailItem icon="home" label="Suite" value={user.address.suite || 'Not available'} />
              <DetailItem icon="map" label="City" value={user.address.city || 'Not available'} />
              <DetailItem icon="flag" label="Zipcode" value={user.address.zipcode || 'Not available'} />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// Helper component for detail items
function DetailItem({ icon, label, value }: { icon: string, label: string, value: string }) {
  return (
    <View className="flex-row items-center py-2 border-b border-gray-50">
      <View className="w-8">
        <Feather name={icon as any} size={16} color="#4f46e5" />
      </View>
      <Text className="w-24 text-gray-500">{label}</Text>
      <Text className="flex-1 text-gray-800">{value}</Text>
    </View>
  );
}