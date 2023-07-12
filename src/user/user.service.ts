import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
import { Setting } from '../setting/entities/setting.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
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
    const user = new User()
    user.amember_id = amemberId
    user.basiq_id = basiqId
    const storeUser = await this.userRepository.save(user)

    const setting = new Setting()
    setting.user = storeUser
    this.settingRepository.save(setting)
    
    return storeUser
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
