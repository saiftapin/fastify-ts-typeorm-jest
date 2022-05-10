import 'reflect-metadata';
import fp from 'fastify-plugin';
import { createConnection, getConnectionOptions, Repository, Connection, EntityManager } from 'typeorm';
import { Token } from '../modules/tokens/entity';
import { User } from '../modules/users/entity';
import { TokenTransaction } from '../modules/token-transactions/entity';
import { Account } from '../modules/accounts/entity';
import { AccountTransaction } from '../modules/account-transactions/entity';
import { AccountLedger } from '../modules/account-ledgers/entity';
import { FastifyInstance } from 'fastify';

export interface IServerWithDB extends FastifyInstance{
	db: {
		tokens: Repository<Token>,
		users: Repository<User>,
		token_transactions: Repository<TokenTransaction>,

		accounts: Repository<Account>,
		account_transactions: Repository<AccountTransaction>, 
		account_ledgers: Repository<AccountLedger>,

		manager: EntityManager,
		connection: Connection,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		transaction: any
	}
}

export default fp(async server => {
	try {
		const connectionOptions = await getConnectionOptions();
		Object.assign(connectionOptions, {
			options: { encrypt: true },
			entities: [Token, User, TokenTransaction, Account, AccountTransaction, AccountLedger]
		});

		const connection = await createConnection(connectionOptions);
		console.log('database connected');

		server.decorate('db', {
			tokens: connection.getRepository(Token),
			users: connection.getRepository(User),
			token_transactions: connection.getRepository(TokenTransaction),

			accounts: connection.getRepository(Account),
			account_transactions: connection.getRepository(AccountTransaction),
			account_ledgers: connection.getRepository(AccountLedger),

			manager: connection.manager,
			connection: connection,
			transaction: connection.manager.transaction
		});
	} catch (error) {
		console.log(error);
		console.log('make sure you have set .env variables - see .env.sample');
	}
});
