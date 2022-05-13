import { getRepository } from 'typeorm';
import { listTransactionsSchema, deleteTransactionSchema, addTransactionSchema, readTransactionSchema } from './schema';
import { TokenTransaction } from './entity';

export default function transactionsHandler(server, options, next) {
	server.get(
		'/',
		{ schema: listTransactionsSchema },
		async (req, res) => {
			req.log.info('list transactions from db');
			const transactions = await server.db.token_transactions.find({ relations:['user', 'token'] });
			res.send(transactions);
		}
	);

	server.get('/:_id', { schema: readTransactionSchema }, async (req, res) => {
		req.log.info('get one transactions from db');
		const transaction = await server.db.token_transactions.findOne(req.params._id, { relations:['user', 'token'] });
		res.send({
			_id: transaction._id,
			user: transaction.user.name,
			token: transaction.token.name,
			quantity: transaction.quantity
		});
	});

	server.post('/', { schema: addTransactionSchema }, async (req, res) => {
		req.log.info('Add transactions to db');

		const { user_id, token_id, quantity } = req.body;

		const user = await server.db.users.findOne(user_id);
		const token = await server.db.tokens.findOne(token_id);
		try {
			if(user && token){
				const { sum } = await getRepository(TokenTransaction)
					.createQueryBuilder('tt')
					.select('SUM(tt.quantity)', 'sum')
					// eslint-disable-next-line quotes
					.where(`DATE(tt.created_at) = strftime('%Y-%m-%d', 'now') AND tt.user_id = :user_id AND tt.token_id = :token_id`, { user_id, token_id })
					.groupBy('DATE(tt.created_at)')
					.getRawOne().then((data) => {
						if(data == undefined){
							return {sum : 0};
						}
						return data;
					});

				let new_total = 0;
				if(sum){
					new_total = sum + quantity;
				}

				if(new_total <= token.limit_per_day){
					const transaction = await server.db.token_transactions.save({
						user,
						token,
						quantity
					});
					res.status(201).send(transaction);
				} else {
					if(sum < token.limit_per_day){
						res.code(403).send({ error: `Failed!, Quantity exceeded, As you are only allowed to add upto ${(token.limit_per_day - sum).toFixed(2)} quantity for today` });
					} else {
						res.code(403).send({ error: 'Failed!, Reached Todays Limit Already' });
					}
				}
			} else {
				res.code(403).send({ error: 'Invalid Input, UserId or TokenId' });
			}
		} catch (error) {
			console.log(error);
			res.code(403).send({ error: 'Failed validation' });
		}
	});

	server.delete(
		'/:_id',
		{ schema: deleteTransactionSchema },
		async (req, res) => {
			req.log.info(`delete token ${req.params._id} from db`);
			const token = await server.db.token_transactions.findOne(req.params._id);
			if (!token.locked) {
				await server.db.token_transactions.remove(token);
				res.code(200).send({});
			} else {
				res.code(403).send({ error: 'Failed validation' });
			}
		}
	);

	next();
}
