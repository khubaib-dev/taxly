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

  async createConnection(id,body)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const authToken = `Basic ${this.basiqAPI}`;
    const config = {
      headers: {
        Authorization: authToken,
        accept: 'application/json',
        'basiq-version': '3.0'
      },
    };

    const tokenData = { scope:'CLIENT_ACCESS', userId:user.basiq_id};
  
    const url = 'https://au-api.basiq.io/token';
    
      const data  = await axios.post(url, tokenData, config);
      
      
      var basiqData = JSON.stringify({
        "loginId": body.loginId,
        "password": body.password,
        "institution": {
          "id": body.institution
        }
      })

      var basiqConfig = {
        method: 'post',
        url: `https://au-api.basiq.io/users/${user.basiq_id}/connections`,
        data : basiqData,
        headers: { 
          'Authorization': `Bearer ${data.data.access_token}`, 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        },
      };

      return await axios(basiqConfig)
      .then(function (response) {
        return {
          ok: true,
          data: response
        };
      })
      .catch(function (error) {
        return {
          ok: false,
          data: error
        }
      });
  }

  async basiqUser(id)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const authToken = `Basic ${this.basiqAPI}`;
    const config = {
      headers: {
        Authorization: authToken,
        accept: 'application/json',
        'basiq-version': '3.0'
      },
    };
    
  
    const url = 'https://au-api.basiq.io/token';
    const tokenData = { scope:'CLIENT_ACCESS', userId:user.basiq_id};
    
    try {
      const data  = await axios.post(url, tokenData, config);
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
  
  
  async checkConsent(id)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const authToken = `Basic ${this.basiqAPI}`;
    const config = {
      headers: {
        Authorization: authToken,
        accept: 'application/json',
        'basiq-version': '3.0'
      },
    };
    
  
    const url = 'https://au-api.basiq.io/token';
    const tokenData = { scope:'SERVER_ACCESS'};
    
    try {
      const data  = await axios.post(url, tokenData, config);

      const consentConfig = {
        headers: {
        'Authorization': `Bearer ${data.data.access_token}`, 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        }
      };
      const consentUrl = `https://au-api.basiq.io/users/${user.basiq_id}/consents`

      const consents  = await axios.get(consentUrl, consentConfig);
      return {
        ok: true,
        consents: consents.data,
      }
  
    } catch (error) {
      console.error('Failed to create user', error.response.data);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async basiqAccounts(id)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const authToken = `Basic ${this.basiqAPI}`;
    const config = {
      headers: {
        Authorization: authToken,
        accept: 'application/json',
        'basiq-version': '3.0'
      },
    };
    
  
    const url = 'https://au-api.basiq.io/token';
    const tokenData = { scope:'SERVER_ACCESS'};
    
    try {
      const data  = await axios.post(url, tokenData, config);

      const accountConfig = {
        headers: {
        'Authorization': `Bearer ${data.data.access_token}`, 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        }
      };
      const accountUrl = `https://au-api.basiq.io/users/${user.basiq_id}/accounts`

      const accounts  = await axios.get(accountUrl, accountConfig);
      return {
        ok: true,
        accounts: accounts.data,
      }
  
    } catch (error) {
      console.error('Failed to create user', error.response.data);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  
  
  async basiqTransactions(id)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const authToken = `Basic ${this.basiqAPI}`;
    const config = {
      headers: {
        Authorization: authToken,
        accept: 'application/json',
        'basiq-version': '3.0'
      },
    };
    
  
    const url = 'https://au-api.basiq.io/token';
    const tokenData = { scope:'SERVER_ACCESS'};
    
    try {
      const data  = await axios.post(url, tokenData, config);

      const accountConfig = {
        headers: {
        'Authorization': `Bearer ${data.data.access_token}`, 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        }
      };
      const accountUrl = `https://au-api.basiq.io/users/${user.basiq_id}/transactions`

      const transactions  = await axios.get(accountUrl, accountConfig);
      return {
        ok: true,
        transactions: transactions.data,
      }
  
    } catch (error) {
      console.error('Failed to create user', error.response.data);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findOne(id) {
    const user = await this.userRepository.findOne({
      where: {
        id
      },
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
