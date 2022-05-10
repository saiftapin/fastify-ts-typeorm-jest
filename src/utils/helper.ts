

export const getToday = () => {
	//const date_ob = new Date();
	const date_ob = new Date(new Date().toUTCString())
	// current date
	// adjust 0 before single digit date
	const date = ('0' + date_ob.getDate()).slice(-2);

	// current month
	const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

	// current year
	const year = date_ob.getFullYear();

	return `${year}-${month}-${date}`;

};

export const getTodayWithHour = () => {
	//const date_ob = new Date();
	const date_ob = new Date(new Date().toUTCString())
	// current date
	// adjust 0 before single digit date
	const date = ('0' + date_ob.getDate()).slice(-2);

	// current month
	const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

	// current year
	const year = date_ob.getFullYear();

	// hour
	const hour = ('0' + (new Date()).getHours()).slice(-2)

	return `${year}-${month}-${date} ${hour}:00:00`;

};