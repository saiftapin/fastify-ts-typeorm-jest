export const getHealthSchema = {
	summary: 'health check',
	tags: ['health'],
	description: 'health check',
	response: {
		200: {
			type: 'object',
			properties: {
				status: {
					type: 'string'
				}
			}
		}
	}
};
