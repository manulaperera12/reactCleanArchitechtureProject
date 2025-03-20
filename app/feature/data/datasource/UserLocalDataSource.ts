import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../domain/entity/User';

const USER_LIST_KEY = 'userList';

export const saveUsers= async (users: User[]): Promise<void> => {
    await AsyncStorage.setItem(USER_LIST_KEY, JSON.stringify(users));
};

export const loadUsers = async (): Promise<User[] | null> => {
    const usersJson = await AsyncStorage.getItem(USER_LIST_KEY);
    if (usersJson) {
        return JSON.parse(usersJson);
    }
    return null;
};