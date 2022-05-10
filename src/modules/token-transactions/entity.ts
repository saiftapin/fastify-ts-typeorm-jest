import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne
} from 'typeorm';
import { Token } from '../tokens/entity';
import { User } from '../users/entity';

@Entity()
export class TokenTransaction {
  @PrimaryGeneratedColumn('uuid')
  _id: string

  @ManyToOne(() => User, user => user.token_transactions)
  user: User

  @ManyToOne(() => Token, token => token.token_transactions)
  token: Token

  @Column()
  quantity: number

  @Column({ default: 0 })
  locked: boolean

  @CreateDateColumn()
  created_at: string
}
