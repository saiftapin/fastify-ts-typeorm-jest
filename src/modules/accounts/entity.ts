import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany
} from 'typeorm';
import { AccountLedger } from '../account-ledgers/entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  _id: number

  @Column()
  name: string

  @Column({default: 0})
  balance: number

  @OneToMany(() => AccountLedger, account_ledger => account_ledger.account)
  account_ledgers: AccountLedger[]

  @CreateDateColumn()
  created_at: string

  @UpdateDateColumn()
  updated_at: string
}
