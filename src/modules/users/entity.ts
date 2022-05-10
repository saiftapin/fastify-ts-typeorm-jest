import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	OneToOne,
	JoinColumn
} from 'typeorm';
import { Account } from '../accounts/entity';
import { TokenTransaction } from '../token-transactions/entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string

  @Column({ name: 'email', length: 300, nullable: true, unique: true })
  email?: string;

  @Column()
  name: string

  @OneToMany(() => TokenTransaction, token_transactions => token_transactions.user)
  token_transactions: TokenTransaction[]

  @OneToOne(() => Account) @JoinColumn()
  account: Account;

  @CreateDateColumn()
  created_at: string

  @UpdateDateColumn()
  updated_at: string
}