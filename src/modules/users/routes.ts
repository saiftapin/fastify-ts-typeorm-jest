import { getRepository } from 'typeorm';
import { getToday } from '../../utils/helper';
import { TokenTransaction } from '../token-transactions/entity';
import { listUsersSchema, deleteUserSchema, addUserSchema, editUserSchema, readUserSchema, readUserWithTokensSchema } from './schema';

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
			const token_transactions = await getRepository(TokenTransaction)
				.createQueryBuilder('tt')
				.where('DATE(tt.created_at) = :date AND tt.user_id = :user_id', { date: getToday(), user_id: user._id })
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
