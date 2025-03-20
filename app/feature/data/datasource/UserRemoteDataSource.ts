import axios from 'axios';
import { User } from '../../domain/entity/User';
import { BASE_URL } from '@/app/utils/ApiEndpoints';

export const fetchUsers = async (): Promise<User[]> => {
    const response = await axios.get(`${BASE_URL}/users`);
    console.log("#4234 fetchUsers", response.data);
    return response.data;
};

export const fetchUserById = async (id: number): Promise<User> => {
    const response = await axios.get(`${BASE_URL}/users/${id}`);
    console.log("#4234 fetchUserById", response.data);
    return response.data;
};