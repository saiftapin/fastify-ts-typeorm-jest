export const userSchema = {
	_id: { type: 'string', format: 'uuid' },
	email: { type: 'string' },
	name: { type: 'string' },
	usd_per_unit: { type: 'number' },
	limit_per_day: { type: 'number' },
	created_at: { type: 'string', format: 'date-time' },
	updated_at: { type: 'string', format: 'date-time' }
};

export const listUsersSchema = {
	summary: 'users',
	tags: ['user'],
	description: 'users',
	response: {
		200: {
			type: 'array',
			items: {
				properties: userSchema
			}
		}
	}
};

export const deleteUserSchema = {
	summary: 'delete User',
	tags: ['user'],
	description: 'delete User',
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

export const addUserSchema = {
	summary: 'Add User',
	tags: ['user'],
	description: 'add User',
	params: {},
	body: {
		type: 'object',
		required: ['name', 'email'],
		properties: {
			name: { type: 'string' },
			email: { type: 'string' },
		}
	},
	response: {
		200: {
			type: 'boolean'
		}
	}
};

export const editUserSchema = {
	summary: 'Edit User',
	tags: ['user'],
	description: 'edit User',
	params: {
		type: 'object',
		required: ['_id'],
		properties: {
			_id: { type: 'string' }
		}
	},
	body: {
		type: 'object',
		required: ['name', 'email'],
		properties: {
			name: { type: 'string' },
			email: { type: 'string' },
		}
	},
	response: {
		200: {
			type: 'boolean'
		}
	}
};

export const readUserSchema = {
	summary: 'Read User',
	tags: ['user'],
	description: 'read User',
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
				name: { type: 'string' }
			}
		}
	}
};

export const readUserWithTokensSchema = {
	summary: 'Read User',
	tags: ['user'],
	description: 'read User',
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
				name: { type: 'string' },
				email: { type: 'string' },
				token_transactions: {
					type: 'array',
					items: {
						properties: {
							_id: { type: 'string' },
							quantity: { type: 'number' },
							created_at: { type: 'string', format: 'date-time' },
						}
					}
				}
			}
		}
	}
};
