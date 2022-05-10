import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany
} from 'typeorm';
import { TokenTransaction } from '../token-transactions/entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  _id: string

  @Column()
  name: string

  @Column()
  usd_per_unit: number

  @Column()
  limit_per_day: number

  @OneToMany(() => TokenTransaction, token_transactions => token_transactions.token)
  token_transactions: TokenTransaction[]

  @CreateDateColumn()
  created_at: string

  @UpdateDateColumn()
  updated_at: string
}
