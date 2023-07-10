import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByAmember(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        amember_id: id,
      },
    });
    return user;
  }

   async create(amemberId,basiqId) {
    const user = new User();
    user.amember_id = amemberId;
    user.basiq_id = basiqId;
    return this.userRepository.save(user);
  }

  findAll() {
    const users = this.userRepository.find()
    return users
  }

  async findOne(id: number) {
    const user = await this.userRepository.find();
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
