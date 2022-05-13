import { listUsersSchema, deleteUserSchema, addUserSchema, editUserSchema, readUserSchema, readUserWithTokensSchema, userEarningsSchema, userCurrentStatsSchema } from './schema';

export default function usersHandler(server, options, next) {
	server.get(
		'/',
		{ schema: listUsersSchema },
		async (req, res) => {
			req.log.info('list users from db');
			const users = await server.db.users.find();
			res.send(users);
		}
	);

	server.get('/:_id', { schema: readUserSchema }, async (req, res) => {
		req.log.info('get one users from db');
		const token = await server.db.users.findOne(req.params._id);
		res.send(token);
	});

	server.post('/', { schema: addUserSchema }, async (req, res) => {
		req.log.info('Add users to db');
		const users = await server.db.users.save(req.body);
		res.status(201).send(users);
	});

	server.put('/:_id', { schema: editUserSchema }, async (req, res) => {
		req.log.info('Update token to db');
		const _id = req.params._id;
		const users = await server.db.users.save({ _id, ...req.body });
		res.status(200).send(users);
	});

	server.get('/tokens_history/:_id', { schema: readUserWithTokensSchema }, async (req, res) => {
		const token_transactions = await server.db.users.findOne(req.params._id, {relations: ['token_transactions']});
		res.status(200).send(token_transactions);
	});

	server.get('/todays_tokens_history/:_id', { schema: readUserWithTokensSchema }, async (req, res) => {
		try {
			const user = await server.db.users.findOne(req.params._id);
			const token_transactions = await server.db.token_transactions.createQueryBuilder('tt')
				.where('DATE(tt.created_at) = strftime(\'%Y-%m-%d\', \'now\') AND tt.user_id = :user_id', { user_id: user._id })
				.getMany();

			res.status(200).send({
				...user,
				token_transactions
			});
		} catch (error) {
			console.log(error);
			res.status(403).send({error});
		}
	});

	server.get('/todays_earning/:_id', { schema: userEarningsSchema }, async (req, res) => {
		try {			
			const user = await server.db.users.findOne(req.params._id);
			if(user){
				const token_transactions: {
					total_usd: number
				} = await server.db.token_transactions.createQueryBuilder('tt')
					.leftJoinAndSelect('tt.token', 'token')
					.leftJoinAndSelect('tt.user', 'user')
					.addSelect('SUM(tt.quantity)', 'total_qty')
					.addSelect('ROUND(SUM(tt.quantity) * token.usd_per_unit, 4)', 'total_usd')
					.where('DATE(tt.created_at) = strftime(\'%Y-%m-%d\', \'now\') AND tt.user_id = :user_id', { user_id: user._id })
					.groupBy('tt.user_id')
					.getRawOne(); 

				res.status(200).send({
					...user,
					total: `${token_transactions.total_usd} USD`
				});
			} else {
				throw new Error('Invalid User');
			}
		} catch (error) {
			console.log(error);
			res.status(403).send({error});
		}
	});


	server.get('/stats/:_id', { schema: userCurrentStatsSchema }, async (req, res) => {
		try {			
			const user = await server.db.users.findOne(req.params._id, {relations: ['account']});

			if(user){
				const token_transactions: {
					total_tokens: number
				} = await server.db.token_transactions.createQueryBuilder('tt')
					.addSelect('SUM(tt.quantity)', 'total_tokens')
					.where('DATE(tt.created_at) = strftime(\'%Y-%m-%d\', \'now\') AND tt.user_id = :user_id', { user_id: user._id })
					.groupBy('tt.user_id')
					.getRawOne(); 

				const account_ledgers: {
					current_balance: number
				} = await server.db.account_ledgers.createQueryBuilder('al')
					.addSelect('ROUND(SUM(al.debit), 4)', 'debit_total')
					.addSelect('ROUND(SUM(al.credit), 4)', 'credit_total')
					.addSelect('ROUND(SUM(al.credit) - SUM(al.debit), 4)', 'current_balance')
					.where('al.account_id = :account_id', { account_id: user.account._id })
					.groupBy('al.account_id')
					.getRawOne(); 
					
				res.status(200).send({
					...user,
					total_tokens_today: token_transactions.total_tokens,
					current_balance: `${account_ledgers.current_balance} USD`
				});
			} else {
				throw new Error('Invalid User');
			}
		} catch (error) {
			console.log(error);
			res.status(403).send({error});
		}
	});

	server.delete(
		'/:_id',
		{ schema: deleteUserSchema },
		async (req, res) => {
			req.log.info(`delete token ${req.params._id} from db`);
			const token = await server.db.users.findOne(req.params._id);
			await server.db.users.remove(token);
			res.code(200).send({});
		}
	);

	next();
}
