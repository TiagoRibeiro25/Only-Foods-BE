import handleTime from '../../src/utils/handleTime';

describe('calculateTimeAgo', () => {
	describe('should return the correct time ago string for less than a minute', () => {
		it('singular', () => {
			const createdAt = new Date('2023-07-01T11:00:00Z');
			const currentTime = new Date('2023-07-01T11:00:01Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('1 second ago');
		});

		it('plural', () => {
			const createdAt = new Date('2023-07-01T11:00:00Z');
			const currentTime = new Date('2023-07-01T11:00:30Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('30 seconds ago');
		});
	});

	describe('should return the correct time ago string for less than an hour', () => {
		it('singular', () => {
			const createdAt = new Date('2023-07-01T11:00:00Z');
			const currentTime = new Date('2023-07-01T11:01:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('1 minute ago');
		});

		it('plural', () => {
			const createdAt = new Date('2023-07-01T11:00:00Z');
			const currentTime = new Date('2023-07-01T11:30:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('30 minutes ago');
		});
	});

	describe('should return the correct time ago string for less than a day', () => {
		it('singular', () => {
			const createdAt = new Date('2023-07-01T00:00:00Z');
			const currentTime = new Date('2023-07-01T01:00:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('1 hour ago'); //TODO: fix this (received: NaN years ago")
		});

		it('plural', () => {
			const createdAt = new Date('2023-07-01T00:00:00Z');
			const currentTime = new Date('2023-07-01T23:00:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('23 hours ago');
		});
	});

	describe('should return the correct time ago string for less than a month', () => {
		it('singular', () => {
			const createdAt = new Date('2023-06-01T00:00:00Z');
			const currentTime = new Date('2023-06-02T00:00:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('1 day ago');
		});

		it('plural', () => {
			const createdAt = new Date('2023-06-01T00:00:00Z');
			const currentTime = new Date('2023-06-30T00:00:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('29 days ago');
		});
	});

	describe('should return the correct time ago string for less than a year', () => {
		it('singular', () => {
			const createdAt = new Date('2023-07-01T00:00:00Z');
			const currentTime = new Date('2023-08-01T00:00:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('1 month ago');
		});

		it('plural', () => {
			const createdAt = new Date('2022-07-01T00:00:00Z');
			const currentTime = new Date('2023-06-01T00:00:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('11 months ago');
		});
	});

	describe('should return the correct time ago string for more than a year', () => {
		it('singular', () => {
			const createdAt = new Date('2022-01-01T00:00:00Z');
			const currentTime = new Date('2023-07-01T00:00:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('1 year ago');
		});

		it('plural', () => {
			const createdAt = new Date('2022-01-01T00:00:00Z');
			const currentTime = new Date('2023-01-01T00:00:00Z');
			const result = handleTime.calculateTimeAgo({ createdAt, currentTime });
			expect(result).toBe('1 year ago');
		});
	});
});
