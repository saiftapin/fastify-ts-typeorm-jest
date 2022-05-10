import { AccountLedger } from '../account-ledgers/entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany
} from 'typeorm';

@Entity()
export class AccountTransaction {
  @PrimaryGeneratedColumn()
  _id: number

  @Column()
  description: string

  @OneToMany(() => AccountLedger, account_ledger => account_ledger.account_transaction)
  account_ledgers: AccountLedger[]

  @CreateDateColumn()
  created_at: string
}
