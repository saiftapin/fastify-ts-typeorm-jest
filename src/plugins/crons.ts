import 'reflect-metadata';
import fp from 'fastify-plugin';
import fastifyCron from 'fastify-cron';
import { TokenTransaction } from '../modules/token-transactions/entity';
import { User } from '../modules/users/entity';
import { IServerWithDB } from './db';
import { AccountTransaction } from '../modules/account-transactions/entity';
import { getRepository } from 'typeorm';
import { getTodayWithHour } from '../utils/helper';

export default fp(async (server : IServerWithDB) => {
	try {

		const createNewAccount = async ({name, balance}:{name: string, balance: number}) => {
			try {
				const account = await server.db.accounts.findOne({where: { name }});
				if(typeof account == 'undefined'){
					return await server.db.accounts.save({name, balance});
				}
				return account;
			} catch (error) {
				console.log(error);
			}
			return null;
		};

		const getUserAccount = async (user_id: number) => {
			try {
				let user = await server.db.users.findOne(user_id, { relations: ['account'] }) as User;
				if (typeof user.account == 'undefined' || user.account == null) {
					const account = await createNewAccount({name: `UserAcc:${user.name}`, balance: 0});
					user = await server.db.users.save({ _id: user._id, account });
					return account;
				}
				return user.account;
			} catch (error) {
				console.log(error);
			}
			return null;
		};

		const createTansaction = async (record: any) => {
			try {
				const transaction = {
					description: `${record.user_name} earned ${record.total_qty} DREAM token costs around ${record.total_usd} USD`
				};
	
				return await server.db.account_transactions.save(transaction);
			} catch (error) {
				console.log(error);
			}
			return null;
		};

		const getTokenTransactions = async () => {
			return await server.db.connection
			.getRepository(TokenTransaction)
			.createQueryBuilder('tt')
			.leftJoinAndSelect('tt.token', 'token')
			.leftJoinAndSelect('tt.user', 'user')
			.select(['user._id', 'tt._id', 'user.name', 'token.name', 'tt.created_at']) 
			.addSelect('GROUP_CONCAT(tt._id)', 'tt_ids')
			.addSelect('DATE(tt.created_at)', 'date_at')
			.addSelect('strftime(\'%H\', tt.created_at)', 'hour_at')
			.addSelect('GROUP_CONCAT(tt._id)', 'tt_ids')
			.addSelect('SUM(tt.quantity)', 'total_qty')
			.addSelect('ROUND(SUM(tt.quantity) * token.usd_per_unit, 4)', 'total_usd')
			.where("tt.locked = :locked", { locked: 0 })
			.andWhere(`tt.created_at < strftime('%Y-%m-%d %H:00:00', 'now')`)
			.groupBy('tt.user_id, tt.token_id, date_at, hour_at')
			.limit(10)
			.getRawMany();
		}

		const tokenAccount = await createNewAccount({name: 'CompanyAcc', balance: 0});


		const addToAccounts = async (record: any) => {
			console.log(record);
			return await server.db.transaction(async () => {
				const user_id = record.user__id;
				const account_transaction: AccountTransaction = await createTansaction(record);
				const userAccount = await getUserAccount(user_id);

				if(account_transaction && userAccount){
					await server.db.account_ledgers.save({
						debit: record.total_usd,
						credit: 0,
						account: tokenAccount,
						account_transaction
					});
	
					await server.db.account_ledgers.save({
						debit: 0,
						credit: record.total_usd,
						account: userAccount,
						account_transaction
					});

					await getRepository(TokenTransaction).createQueryBuilder()
					.update()
					.set({ locked: true})
					.where("_id IN (:...ids)", { ids: record.tt_ids.split(',') })
					.execute();
				}
			});
		}


		let hasRecords = true;
		while(hasRecords) {
			const tokenRecords = await getTokenTransactions();
			for await(const record of tokenRecords){
				await addToAccounts(record);
			};
			hasRecords = tokenRecords.length > 0
		} 




		// server.register(fastifyCron, {
		// 	jobs: [
		// 		{
		// 			name: 'Process Token Each Hour',
		// 			// Only these two properties are required,
		// 			// the rest is from the node-cron API:
		// 			// https://github.com/kelektiv/node-cron#api
		// 			cronTime: '1 * * * *', // Everyday at midnight UTC

		// 			// Note: the callbacks (onTick & onComplete) take the server
		// 			// as an argument, as opposed to nothing in the node-cron API:
		// 			onTick: async (server: any) => {
		// 				console.clear();
		// 				// const tokens = await server?.db?.manager.query(`
		// 				// SELECT 
		// 				// 	SUM(quantity), user_id , token_id
		// 				// FROM 
		// 				// 	token_transaction tt
		// 				// 	LEFT JOIN token t ON(t._id = tt.token_id)
		// 				// WHERE 
		// 				// 	DATE(tt.created_at) = DATE('now')
		// 				// GROUP BY 
		// 				// 	tt.user_id, tt.token_id
		// 				// `).catch(console.log);


		// 				const tokens = await server.db.connection
		// 					.getRepository(TokenTransaction)
		// 					.createQueryBuilder('tt')
		// 					.addSelect('SUM(tt.quantity)', 'total_qty')
		// 					.addSelect('SUM(tt.quantity) * token.usd_per_unit', 'total_usd')
		// 					.leftJoinAndSelect('tt.token', 'token')
		// 					.leftJoinAndSelect('tt.user', 'user')
		// 					.where('DATE(tt.created_at) = DATE(\'now\')')
		// 					.groupBy(['tt.user_id, tt.token_id'])
		// 					.getRawMany();

		// 				tokens.forEach(async (record) => {
		// 					console.log(record)
		// 					await server.db.transaction(async transactionalEntityManager => {
		// 						const user = server.db.users.findOne(tokens.user__id) as User;
		// 						if(typeof user.account == 'undefined'){
		// 							console.log("Underfined @")
		// 						}
		// 						// await transactionalEntityManager.save(users);
		// 						// await transactionalEntityManager.save(photos);
		// 						// ...
		// 					});
		// 				});

		// 				console.log(tokens);
		// 			},
		// 			startWhenReady: true
		// 		}
		// 	]
		// });
	} catch (error) {
		console.log(error);
		console.log('make sure you have set .env variables - see .env.sample');
	}
});