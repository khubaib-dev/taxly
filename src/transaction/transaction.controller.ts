import { Controller, Get, Post, Body, Patch,
  UseGuards, Param, Delete, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @UseGuards(AuthGuard)
  @Post('createTransactions')
  async createTransactions(@Request() request) {
    const userId = request.user.sub
    return await this.transactionService.createTransactions(userId,request.body)
  }
  
  @UseGuards(AuthGuard)
  @Post('updateTransaction')
  async updateTransaction(@Request() request) {
    const userId = request.user.sub
    return await this.transactionService.updateTransaction(userId,request.body)
  }



  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
