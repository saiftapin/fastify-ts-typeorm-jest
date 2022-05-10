import fastify from 'fastify';
import db from './plugins/db';
import healthHandler from './modules/health/routes';
import tokensHandler from './modules/tokens/routes';
import usersHandler from './modules/users/routes';
import tokenTransactionsHandler from './modules/token-transactions/routes';
import crons from './plugins/crons';

function createServer() {
	const server = fastify();
	server.register(require('fastify-cors'));

	server.register(require('fastify-oas'), {
		routePrefix: '/',
		exposeRoute: true,
		swagger: {
			info: {
				title: 'Dreamland API',
				description: 'api documentation',
				version: '0.1.0'
			},
			servers: [
				{ url: 'http://localhost:3000', description: 'development' },
				{
					url: 'https://<production-url>',
					description: 'production'
				}
			],
			schemes: ['http'],
			consumes: ['application/json'],
			produces: ['application/json'],
		}
	});

	server.register(db);
	server.register(crons);
	server.register(healthHandler, { prefix: '/health' });
	server.register(tokensHandler, { prefix: '/token' });
	server.register(usersHandler, { prefix: '/user' });
	server.register(tokenTransactionsHandler, { prefix: '/token_transaction' });

	server.setErrorHandler((error, req, res) => {
		req.log.error(error.toString());
		res.send({ error });
	});

	return server;
}

export default createServer;
