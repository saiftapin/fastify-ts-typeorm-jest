import { listTokensSchema, deleteTokenSchema, addTokenSchema, editTokenSchema, readTokenSchema } from './schema';

export default function tokensHandler(server, options, next) {
	server.get(
		'/',
		{ schema: listTokensSchema },
		async (req, res) => {
			req.log.info('list tokens from db');
			const tokens = await server.db.tokens.find();
			res.send(tokens);
		}
	);

	server.get('/:_id', { schema: readTokenSchema }, async (req, res) => {
		req.log.info('get one tokens from db');
		const token = await server.db.tokens.findOne(req.params._id);
		res.send(token);
	});

	server.post('/', { schema: addTokenSchema }, async (req, res) => {
		req.log.info('Add tokens to db');
		const tokens = await server.db.tokens.save(req.body);
		res.status(201).send(tokens);
	});

	server.put('/:_id', { schema: editTokenSchema }, async (req, res) => {
		req.log.info('Update token to db');
		const _id = req.params._id;
		const tokens = await server.db.tokens.save({ _id, ...req.body });
		res.status(200).send(tokens);
	});

	server.delete(
		'/:_id',
		{ schema: deleteTokenSchema },
		async (req, res) => {
			req.log.info(`delete token ${req.params._id} from db`);
			const token = await server.db.tokens.findOne(req.params._id);
			await server.db.tokens.remove(token);
			res.code(200).send({});
		}
	);

	next();
}
