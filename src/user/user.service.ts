import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
import { Setting } from '../setting/entities/setting.entity'
import { Criterion } from '../criteria/entities/criterion.entity'
import axios, {AxiosRequestConfig} from 'axios'
import { Occupation } from '../occupation/entities/occupation.entity'
import { UserType } from '../user-type/entities/user-type.entity'
import { Profession } from '../profession/entities/profession.entity'
import { OnBoarding } from '../on-boarding/entities/on-boarding.entity'
import { OnBoardingQuestion } from '../on-boarding/entities/on-boarding-question.entity'
import * as qs from 'qs';

@Injectable()
export class UserService {
  private readonly basiqAPI: string

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OnBoarding)
    private readonly onBoardingRepository: Repository<OnBoarding>,
    @InjectRepository(OnBoardingQuestion)
    private readonly onBoardingQuestionRepository: Repository<OnBoardingQuestion>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(Criterion)
    private readonly criteriaRepository: Repository<Criterion>,
    @InjectRepository(Occupation)
    private readonly occupationRepository: Repository<Occupation>,
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    @InjectRepository(Profession)
    private readonly professionRepository: Repository<Profession>,
    
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

  async getUserTypes(id)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const setting = user.setting

    const userTypes = await this.userTypeRepository.find()
    return {
      ok: true,
      userTypes : userTypes,
      setting: setting
    }
  }
  
  async getProfessions(id)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const setting = user.setting

    const professions = await this.professionRepository.find()
    return {
      ok: true,
      professions : professions,
      setting: setting
    }
  }

  async updateCriteria(id,request)
  {
    const question = await this.onBoardingQuestionRepository.findOne({where:{
      id: request.question},
      relations: ['on_boarding_id']
    })
    if(question.order == 1)
    {
      const dbOnBoarding = await this.onBoardingRepository.findOne({where: { id: question.on_boarding_id.id }
      })
  
      const criteria = await this.criteriaRepository.findOne({where: {
        id:dbOnBoarding.criteria_id
      }})
  
      const updatedCriteria = []
      
      var user = await this.userRepository.findOne({where:{ id }})
      
      var setting = user.setting
  
      if(setting.criteria != null)
      {
        JSON.parse(setting.criteria).map((criteria) => {
          if (!updatedCriteria.includes(criteria)) {
            updatedCriteria.push(criteria)
          }
        })
      }
  
      const values = JSON.parse(criteria.values)
      values.map((value) => {
        if (!updatedCriteria.includes(value)) {
          updatedCriteria.push(value)
        }
      })
      
      const updatedUser = await this.settingRepository.update(setting.id, {criteria: JSON.stringify(updatedCriteria)})
    }

    var user = await this.userRepository.findOne({where:{ id }})
      
    var setting = user.setting
    
    return {
      ok: true,
      totalDeduction: JSON.parse(setting.criteria).length
    }
  }
  
  async getOnBoarding(id)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const setting = user.setting

    const profession_id = Number(setting.profession)
    const profession = await this.professionRepository.findOne({ where: {id:profession_id } })
    const occupation_id = profession.occupation_id

    const onBoardings = await this.onBoardingRepository.find({where: [
      { occupation_id: occupation_id },
      { profession_id: profession_id }
    ]})

    return {
      ok: true,
      onBoardings:onBoardings
    }

    
  }

  async getDeduction(id)
  {
    const user = await this.userRepository.findOne({ where: { id } })
    const setting = user.setting

    var deduction = 0
      const data = JSON.parse(setting.criteria)
      if(data != null) deduction += data.length

    return {
      ok: true,
      deductions : deduction
    }
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

  async getAMemberUser(id)
  {
    const apiKey = process.env.AMEMBER_API_KEY
    const base_url = process.env.AMEMBER_BASEURL
    const user = await this.userRepository.findOne({ where: { id } })
    const payloadAccess = {
      params: {
      _key: apiKey,
      login:user.amember_id
    }}
    
    try {
      const aMemberUser = await axios.get(`${base_url}/check-access/by-login`,payloadAccess)
      return {
        ok: true,
        user: aMemberUser.data
      }
    } catch (error) {
        console.log(error)
    }
    
  }
}
