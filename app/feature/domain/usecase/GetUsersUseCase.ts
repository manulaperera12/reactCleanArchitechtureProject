import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";

export class GetUsersUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(): Promise<User[]> {
        return this.userRepository.getUsers();
    }
}