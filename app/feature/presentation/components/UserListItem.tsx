import { View, Text } from 'react-native'
import React from 'react'
import { User } from '../../domain/entity/User';

interface UserListItemProps {
    user: User;
}

export const UserListItem: React.FC<UserListItemProps> = ({ user }) => {
    return (
        <View className='p-4 border-b border-gray-200'>
            <Text className='text-lg font-semibold'>{user.name}</Text>
            <Text className='text-sm text-gray-500'>{user.email}</Text>
            <Text className='text-sm text-gray-500'>{user.phone}</Text>
        </View>
    )
}

// export default UserListItem