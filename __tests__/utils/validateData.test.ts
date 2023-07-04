import validateUtils from '../../src/utils/validateData';

describe('validateUtils', () => {
	describe('email', () => {
		it('should return true for a valid email', () => {
			const validEmails = ['test@example.com', 'user123@test.co', 'john.doe@test.com'];

			validEmails.forEach(email => {
				const isValid = validateUtils.email(email);
				expect(isValid).toBe(true);
			});
		});

		it('should return false for an invalid email', () => {
			const invalidEmails = [
				'test',
				'test@',
				'test@example',
				'test@example.',
				'test@example.c',
				'@example.com',
			];

			invalidEmails.forEach(email => {
				const isValid = validateUtils.email(email);
				expect(isValid).toBe(false);
			});
		});
	});

	describe('username', () => {
		it('should return true for a valid username', () => {
			const validUsernames = ['john_doe', 'user123', 'jane-doe'];

			validUsernames.forEach(username => {
				const isValid = validateUtils.username(username);
				expect(isValid).toBe(true);
			});
		});

		it('should return false for an invalid username', () => {
			const invalidUsernames = [
				'123',
				'user@name',
				'john doe',
				'user12345678901234567890',
			];

			invalidUsernames.forEach(username => {
				const isValid = validateUtils.username(username);
				expect(isValid).toBe(false);
			});
		});
	});
});
