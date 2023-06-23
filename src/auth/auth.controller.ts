import { Controller, Get, Req, Res, Post, Body, Param } from '@nestjs/common';
import {ApiService} from '../api/api.service';
import { Request, Response } from 'express';
import { GlobalVariableContainer } from '../../global-variables'
import { UserService } from '../user/user.service'
// import { CreateUserDto } from '../user/dto/create-user.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly apiService: ApiService,
        private globalVariableContainer: GlobalVariableContainer,
        private readonly userService: UserService
        ) {}

    @Post('signUp')
    async signUp(@Req() request: Request, @Res() response: Response)
    {
        const user = request.body;     
        const aMemberUser = await this.apiService.createAMemberUser(user);
        if(aMemberUser.status === 200)
        {
            const aMemberId = aMemberUser.data[0].login
            const email = aMemberUser.data[0].email
            const basiqUser = await this.apiService.createBasiqUser(user);
            const basiqId = basiqUser.data.id
            const data = await this.userService.create(aMemberId,basiqId)
            response.send(data);
        }
        
        
    }

}
