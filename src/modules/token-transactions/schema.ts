export const TransactionSchema = {
	_id: { type: 'string', format: 'uuid' },
	user_id: { type: 'string' },
	token_id: { type: 'string' },
	quantity: { type: 'number' },
	locked: { type: 'boolean' },
	created_at: { type: 'string', format: 'date-time' },
};

export const listTransactionsSchema = {
	summary: 'Transactions',
	tags: ['transaction'],
	description: 'Transactions',
	response: {
		200: {
			type: 'array',
			items: {
				properties: {
					...TransactionSchema,
					user: {
						type: 'object',
						properties: {
							_id: { type: 'string' },
							name: { type: 'string' },
							email: { type: 'string'}
						}
					},
					token: {
						type: 'object',
						properties: {
							_id: { type: 'string' },
							name: { type: 'string' },
							usd_per_unit: { type: 'number'},
							limit_per_day: { type: 'number'}
						}
					}
				}
			}
		}
	}
};

export const deleteTransactionSchema = {
	summary: 'delete Transaction',
	tags: ['transaction'],
	description: 'delete Transaction',
	params: {
		type: 'object',
		required: ['_id'],
		properties: {
			_id: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'boolean'
		}
	}
};

export const addTransactionSchema = {
	summary: 'Add Transaction',
	tags: ['transaction'],
	description: 'API that accepts that a user has won some amount of DREAM token at a particular time of a day (can be fractional tokens)',
	params: {},
	body: {
		type: 'object',
		required: ['user_id', 'token_id', 'quantity'],
		properties: {
			user_id: { type: 'string' },
			token_id: { type: 'string' },
			quantity: { type: 'number' },
		}
	},
	response: {
		200: {
			type: 'boolean'
		}
	}
};

export const readTransactionSchema = {
	summary: 'Read Transaction',
	tags: ['transaction'],
	description: 'read Transaction',
	params: {
		type: 'object',
		required: ['_id'],
		properties: {
			_id: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				_id: { type: 'string' },
				user: { type: 'string' },
				token: { type: 'string' },
				quantity: { type: 'number' }
			}
		}
	}
};