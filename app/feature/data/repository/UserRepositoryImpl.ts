import { User } from "../../domain/entity/User";
import { UserRepository } from "../../domain/repository/UserRepository";
import { loadUsers, saveUsers } from "../datasource/UserLocalDataSource";
import { fetchUserById, fetchUsers } from "../datasource/UserRemoteDataSource";
import { NetworkInfo } from "../../../core/network/NetworkInfo";

export class UserRepositoryImpl implements UserRepository {
    async getUsers(): Promise<User[]> {
        return NetworkInfo.executeWithConnectivityCheck(
            // Online callback
            async () => {
                try {
                    const users = await fetchUsers();
                    await saveUsers(users); // Cache for offline use
                    return users;
                } catch (error) {
                    // Network request failed even though we're online
                    console.log('#32344 online fetch error:', error);
                    
                    // Try local cache as fallback
                    const localUsers = await loadUsers();
                    if (localUsers && localUsers.length > 0) {
                        return localUsers;
                    }
                    throw error;
                }
            },
            // Offline callback
            async () => {
                console.log('No internet connection, using local data');
                const localUsers = await loadUsers();
                if (localUsers && localUsers.length > 0) {
                    return localUsers;
                }
                throw new Error('No internet connection and no cached data available');
            }
        );
    }

    async getUserById(id: number): Promise<User> {
        return NetworkInfo.executeWithConnectivityCheck(
            // Online callback
            async () => {
                try {
                    return await fetchUserById(id);
                } catch (error) {
                    console.log(`#32345 online fetch error for user ${id}:`, error);
                    
                    // Try local cache as fallback
                    const localUsers = await loadUsers();
                    const localUser = localUsers?.find(user => user.id === id);
                    if (localUser) {
                        return localUser;
                    }
                    throw error;
                }
            },
            // Offline callback
            async () => {
                const localUsers = await loadUsers();
                const localUser = localUsers?.find(user => user.id === id);
                
                if (localUser) {
                    return localUser;
                }
                throw new Error(`No internet connection and user ${id} not found in cache`);
            }
        );
    }
}