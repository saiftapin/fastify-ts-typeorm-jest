import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne
} from 'typeorm';
import { AccountTransaction } from '../account-transactions/entity';
import { Account } from '../accounts/entity';

@Entity()
export class AccountLedger {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  debit: number;

  @Column()
  credit: number;

  @ManyToOne(() => Account, account => account.account_ledgers)
  account: Account;

  @ManyToOne(() => AccountTransaction, AccountTransactions => AccountTransactions.account_ledgers)
  account_transaction: AccountTransaction;

  @CreateDateColumn()
  created_at: string;
}