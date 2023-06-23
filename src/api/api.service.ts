import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {AxiosRequestConfig} from 'axios';
import { GlobalVariableContainer } from '../../global-variables';

@Injectable()
export class ApiService {
    private readonly basiqAPI: string;
    private readonly aMemberAPI: string;    
    
    constructor(private readonly configService: ConfigService,
      private globalVariableContainer: GlobalVariableContainer) {
        this.basiqAPI = process.env.BASIQ_API_KEY;
        this.aMemberAPI = process.env.AMEMBER_API_KEY;
    }

    async createBasiqUser(user): Promise<any> {
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
        const { data } = await axios.post(url, {}, config);
        const basiqUserUrl = 'https://au-api.basiq.io/users';
    
        const requestData = {
          email: user.email,
          firstName: user.email.fname,
          lastName: user.lname
        };
    
        const headers: AxiosRequestConfig['headers'] = {
          Authorization: `Bearer ${data.access_token}`,
          'Content-Type': 'application/json',
        };
    
        const response = await axios.post(basiqUserUrl, requestData, { headers });
        return response;
      } catch (error) {
        console.error('Failed to create user', error.response.data);
        throw new Error(`Failed to create user: ${error.message}`);
      }
    }
    
      async createAMemberUser(user)
      {
        const url = 'https://backend.taxly.ai/api/users';
        const postData = {
          _key: this.aMemberAPI,
          email: user.email,
          name_f: user.fname,
          name_l: user.lname,
          pass: user.password
        };
        
        const headers: AxiosRequestConfig['headers'] = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };

        try {
          const response = await axios.post(url, postData, { headers });
          return response;
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
}
