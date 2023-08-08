import {
    Controller, Get, Post,
    UseGuards, Req, Res, Request
} from '@nestjs/common'
import { ApiService } from './api.service'
import { AuthGuard } from '../auth/auth.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'


@Controller('api')
export class ApiController {

    constructor(
        private readonly apiService: ApiService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) { }

    @UseGuards(AuthGuard)
    @Post('AiHelp')
    async getAiResponse(@Request() request, @Res() res) {
        const body = request.body
        const id = request.user.sub
        
        const user = await this.userRepository.findOne({
            where: {
              id
            },
          });

        if(user.credits > 0)
        {
            user.credits = (user.credits - 1)
            this.userRepository.save(user)
            
            await this.apiService.getAiResponse(id, body)
            .then(data => {
                setTimeout(() => {
                    return res.status(200).json({
                        status: 200,
                        ok: true,
                        data,
                    });
                }, 3000);
            })
            .catch(error => {
                // Handle error
                return res.status(200).json({
                    status: 500,
                    ok: false,
                    message: error,
                });
            });
        }
        else
        {
            return res.status(200).json({
                status: 500,
                ok: false,
                message: 'You have 0 Credits',
            });
        }
    }
}
