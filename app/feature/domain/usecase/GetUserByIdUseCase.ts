import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";

export class GetUserByIdUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(id: number): Promise<User> {
        return this.userRepository.getUserById(id);
    }
}