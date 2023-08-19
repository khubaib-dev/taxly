import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {AxiosRequestConfig} from 'axios';
import { GlobalVariableContainer } from '../../global-variables';
import * as nodemailer from 'nodemailer'
import { AichatService } from '../aichat/aichat.service'
// import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'


@Injectable()
export class ApiService {
    private readonly basiqAPI: string;
    private readonly aMemberAPI: string;  
    private transporter: nodemailer.Transporter;  
    
    constructor(private readonly configService: ConfigService,
      private globalVariableContainer: GlobalVariableContainer,
      private readonly aiChatService: AichatService,
      @InjectRepository(User)
        private readonly userRepository: Repository<User>
      ) {
        this.basiqAPI = process.env.BASIQ_API_KEY;
        this.aMemberAPI = process.env.AMEMBER_API_KEY;

        this.transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

    }

    async sendMail(to: string, subject: string, message: string): Promise<void> {
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_SENDER,
        to,
        subject,
        text: message,
      };
  
      try {
        await this.transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      }
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
          firstName: user.fname,
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

      async getAiResponse(id,query)
      {
        this.aiChatService.createChat(id,query.query,query.type)

        //Call AI API below
        // const url = process.env.AI_URI
        // const config = {
        //   usecase: 'ChatCall'
        // }
        // const response = await axios.post(url, query.query, config);
        // return response.data
        //End of AI API call
        this.aiChatService.createChat(id,'Response Fetched',false)
        return {
          response: 'Response Fetched'
        }
      }

      async getAllUsers()
      {
        const users = await this.userRepository.find()
        const aMemberKey = process.env.AMEMBER_API_KEY
        
        const url = 'https://backend.taxly.ai/api/check-access/by-login';
        
        for (const user of users) {
          const payloadAccess = {
            params: {
            _key: aMemberKey,
            login: user.amember_id
            }}

            const fullUser = await axios.get(url,payloadAccess)

          user['aMember'] = fullUser.data
        }
        return users
      }
}
