import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
import { Setting } from '../setting/entities/setting.entity'
import axios, {AxiosRequestConfig} from 'axios'
import * as qs from 'qs';

@Injectable()
export class UserService {
  private readonly basiqAPI: string

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {
    this.basiqAPI = process.env.BASIQ_API_KEY;
  }

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

  async basiqUser(id)
  {
    const authToken = `Basic ${this.basiqAPI}`;
    const config = {
      headers: {
        Authorization: authToken,
        accept: 'application/json',
        'basiq-version': '3.0'
      },
    };
  
    const url = 'https://au-api.basiq.io/token';
    
    try {
      const data  = await axios.post(url, qs.stringify({ scope: 'SERVER_ACCESS' }), config);
      const user = await this.userRepository.findOne({ where: { id } })
      return {
        ok: true,
        token: data.data.access_token,
        basiq_id: user.basiq_id
      }
  
    } catch (error) {
      console.error('Failed to create user', error.response.data);
      throw new Error(`Failed to create user: ${error.message}`);
    }
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
