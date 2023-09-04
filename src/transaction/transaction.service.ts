import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction } from './entities/transaction.entity'
import { ChartOfAccount } from '../chart-of-account/entities/chart-of-account.entity'
import { Criterion } from '../criteria/entities/criterion.entity'
import { User } from '../user/entities/user.entity'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChartOfAccount)
    private readonly chartOfAccountRepository: Repository<ChartOfAccount>,
    @InjectRepository(Criterion)
    private readonly criteriaRepository: Repository<Criterion>,
  ) { }

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findByCat(code) {
    return this.chartOfAccountRepository.findOne({ where: { code } })
  }
  
  findByTransaction(transaction_id) {
    return this.transactionRepository.findOne({ where: { transaction_id } });
  }

  async updateTransaction(id,request)
  {
    
  }

  async createTransactions(userId, transactions) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const setting = user.setting

    const deductions = JSON.parse(setting.criteria)

    var flag_coa = 0
    var flag_deduction = 0
    for (const transaction of transactions) {
      var category = transaction.subClass ? transaction.subClass.title : 'unKnown'
      var code = transaction.subClass ? transaction.subClass.code : 0
      const checkChart = await this.findByCat(code)
      if (checkChart) {
        flag_coa = 1
      } else {
        flag_coa = 0
      }

      flag_deduction = 0;

      for (const deduction of deductions) {
        if (code == deduction) {
          flag_deduction = 1
          break
        }
      }

      const transactionCheck = await this.findByTransaction(transaction.id)
      if (!transactionCheck) {
        const newTransaction = new Transaction()
        newTransaction.category = category
        newTransaction.category_id = code
        newTransaction.amount = transaction.amount
        newTransaction.class = transaction.class
        newTransaction.account = transaction.account
        newTransaction.direction = transaction.direction
        newTransaction.description = transaction.description
        newTransaction.postDate = transaction.postDate
        newTransaction.flag_coa = flag_coa
        newTransaction.flag_deduction = flag_deduction
        newTransaction.userId = userId
        newTransaction.transaction_id = transaction.id
        await this.transactionRepository.save(newTransaction)
      }
    }
    return await this.transactionRepository.find({
      where: {
        userId: userId,
        flag_deduction: 1
      }
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
