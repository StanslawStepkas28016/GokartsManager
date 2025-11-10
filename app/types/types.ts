export type ActionData = | { success: true; message: string } | { success: false; error: string };

export type Gokart = {
	idGokart: string,
	number: number,
	horsePower: number,
	rideTime: number,
	rideStartTime: string,
	additionalNote: string,
}

export type GokartsPaged = {
	items: Gokart[],
	page: number,
	pageSize: number,
	totalCount: number,
	hasNextPage: boolean,
	hasPreviousPage: boolean,
}
