import { Injectable, Body } from '@nestjs/common'
import { Setting } from './entities/setting.entity'
import { User } from '../user/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateSettingDto } from './dto/update-setting.dto'

@Injectable()
export class SettingService {

  constructor(
  @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async update(id, request){
    // Find the user by ID
    
    var user = await this.userRepository.findOne({where:{ id }})

    var setting = user.setting

    if (!setting) {
      throw new Error('User not found');
    }

    // Update seting
    const updatedUser = await this.settingRepository.update(setting.id, request);

    user = await this.userRepository.findOne({where:{ id }})

    setting = user.setting
    
    return setting;
  }

}
