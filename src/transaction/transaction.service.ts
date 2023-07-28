import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction } from './entities/transaction.entity'
import { ChartOfAccount } from '../chart-of-account/entities/chart-of-account.entity'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
      private readonly transactionRepository: Repository<Transaction>,
      @InjectRepository(ChartOfAccount)
      private readonly chartOfAccountRepository: Repository<ChartOfAccount>
    ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findByCat(cat)
  {
    return this.chartOfAccountRepository.find({where: {category: cat}})
  }

  async createTransactions(userId,transactions)
  {
    var flag
    return transactions.map(async (transaction) => {
      var category = transaction.subClass.title
      const checkChart = await this.findByCat(category)
      if(checkChart.length > 0) flag = 1
      else flag = 0
      const newTransaction = new Transaction()
      newTransaction.type = category
      newTransaction.amount = transaction.amount
      newTransaction.flag = flag
      newTransaction.userId = userId
      return this.transactionRepository.save(newTransaction)
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
