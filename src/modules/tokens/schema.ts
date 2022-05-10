export const tokenSchema = {
	_id: { type: 'string', format: 'uuid' },
	name: { type: 'string' },
	usd_per_unit: { type: 'number' },
	limit_per_day: { type: 'number' },
	created_at: { type: 'string', format: 'date-time' },
	updated_at: { type: 'string', format: 'date-time' }
};

export const listTokensSchema = {
	summary: 'tokens',
	tags: ['tokens'],
	description: 'tokens',
	response: {
		200: {
			type: 'array',
			items: {
				properties: tokenSchema
			}
		}
	}
};

export const deleteTokenSchema = {
	summary: 'delete Token',
	tags: ['tokens'],
	description: 'delete Token',
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

export const addTokenSchema = {
	summary: 'Add Token',
	tags: ['tokens'],
	description: 'add Token',
	params: {},
	body: {
		type: 'object',
		required: ['name', 'usd_per_unit', 'limit_per_day'],
		properties: {
			name: { type: 'string' },
			usd_per_unit: { type: 'number' },
			limit_per_day: { type: 'number' },
		}
	},
	response: {
		200: {
			type: 'boolean'
		}
	}
};

export const editTokenSchema = {
	summary: 'Edit Token',
	tags: ['tokens'],
	description: 'edit Token',
	params: {
		type: 'object',
		required: ['_id'],
		properties: {
			_id: { type: 'string' }
		}
	},
	body: {
		type: 'object',
		required: ['name', 'usd_per_unit', 'limit_per_day'],
		properties: {
			name: { type: 'string' },
			usd_per_unit: { type: 'number' },
			limit_per_day: { type: 'number' },
		}
	},
	response: {
		200: {
			type: 'boolean'
		}
	}
};

export const readTokenSchema = {
	summary: 'Read Token',
	tags: ['tokens'],
	description: 'read Token',
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