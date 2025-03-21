import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useQuery } from 'react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import 'tailwindcss/tailwind.css';
import '../global.css';
import { UserRepositoryImpl } from './feature/data/repository/UserRepositoryImpl';
import { GetUsersUseCase } from './feature/domain/usecase/GetUsersUseCase';
import { User } from './feature/domain/entity/User';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const userRepository = new UserRepositoryImpl();
  const getUsersUseCase = new GetUsersUseCase(userRepository);

  const { data: users, isLoading, isError, error, refetch } = useQuery<User[], Error>('users', () =>
    getUsersUseCase.execute()
  );

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserPress = (userId: number) => {
    router.push({
      pathname: "/feature/presentation/screens/[userId]",
      params: { userId: userId.toString() }
    });
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <View className="bg-white p-6 rounded-2xl shadow-md">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-gray-600 mt-4 font-medium text-center">Loading users...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-100">
        <View className="bg-white p-6 rounded-2xl shadow-md items-center w-full max-w-sm">
          <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
            <Feather name="alert-circle" size={32} color="#ef4444" />
          </View>
          <Text className="text-gray-800 text-lg font-bold mb-2 text-center">Failed to load users</Text>
          <Text className="text-red-500 text-base mb-6 text-center">
            {error?.message || 'An error occurred'}
          </Text>
          <TouchableOpacity 
            className="bg-indigo-600 px-6 py-3 rounded-lg w-full" 
            onPress={() => refetch()}
          >
            <Text className="text-white font-bold text-center">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (id: number) => {
    const colors = [
      'bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 
      'bg-pink-500', 'bg-amber-500', 'bg-sky-500'
    ];
    return colors[id % colors.length];
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-gray-100">
        {/* Header with search */}
        <View className="bg-white px-4 py-3 shadow-sm">
          <View className="flex-row items-center justify-center">
          <Text className="text-2xl font-bold text-gray-800 mb-3">Users List</Text>
          </View>
          
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Feather name="search" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* User list */}
        <FlatList
          className="flex-1"
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="flex-row items-center mx-4 my-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              activeOpacity={0.7}
              onPress={() => handleUserPress(item.id)}
            >
              <View className={`w-14 h-14 rounded-full ${getRandomColor(item.id)} items-center justify-center mr-4`}>
                <Text className="text-white font-bold text-lg">{getInitials(item.name)}</Text>
              </View>
              <View className="flex-1 py-1">
                <Text className="text-base font-bold text-gray-800">{item.name}</Text>
                <View className="flex-row items-center mt-1">
                  <Feather name="mail" size={14} color="#6b7280" />
                  <Text className="text-sm text-gray-500 ml-1">{item.email}</Text>
                </View>
              </View>
              <View className="bg-gray-100 rounded-full p-2">
                <MaterialIcons name="chevron-right" size={20} color="#4f46e5" />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center p-8">
              <Feather name="users" size={48} color="#d1d5db" />
              <Text className="text-gray-400 mt-4 text-center">
                {searchQuery ? "No users match your search" : "No users available"}
              </Text>
            </View>
          )}
          contentContainerClassName="pb-6 pt-2"
        />
      </View>
    </SafeAreaView>
  );
}