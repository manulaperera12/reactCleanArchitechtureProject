import { User } from "../entity/User";

export interface UserRepository {
    getUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User>;
}