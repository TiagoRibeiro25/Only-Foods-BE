import { Base64Img } from '../../src/types';
import validateUtils from '../../src/utils/validateData';

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
		const validUsernames = ['john_doe', 'user123', 'jane-doe', 'john doe'];

		validUsernames.forEach(username => {
			const isValid = validateUtils.username(username);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for an invalid username', () => {
		const invalidUsernames = ['123', 'user@name', 'user12345678901234567890'];

		invalidUsernames.forEach(username => {
			const isValid = validateUtils.username(username);
			expect(isValid).toBe(false);
		});
	});
});

describe('description', () => {
	it('should return true for a valid description', () => {
		const validDescriptions = [
			'This is a valid description.',
			'A valid description with punctuation marks: !?.,',
			'A valid description with numbers: 1234567890',
		];

		validDescriptions.forEach(description => {
			const isValid = validateUtils.description(description);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for an invalid description', () => {
		const invalidDescriptions = [
			'Short',
			'A description with invalid characters #@$%',
			'A very long description that exceeds the maximum limit of 200 characters. A very long description that exceeds the maximum limit of 200 characters. A very long description that exceeds the maximum limit of 200 characters.',
		];

		invalidDescriptions.forEach(description => {
			const isValid = validateUtils.description(description);
			expect(isValid).toBe(false);
		});
	});
});

describe('base64Image', () => {
	it('should return true for a valid base64 image', () => {
		const validImages: Base64Img[] = [
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAEElEQVQImWP4z8DwHwAFAAJ/uC+c8AAAAASUVORK5CYII=',
			'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk=',
		];

		validImages.forEach(image => {
			const isValid = validateUtils.base64Image(image);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for an invalid base64 image', () => {
		const invalidImages = [
			'invalid',
			'data:image/png;base64,',
			'data:image/jpg;base64,SGVsbG8gV29ybGQh',
			'data:audio/mp3;base64,SGVsbG8gV29ybGQh',
		] as Base64Img[];

		invalidImages.forEach(image => {
			const isValid = validateUtils.base64Image(image);
			expect(isValid).toBe(false);
		});
	});
});

describe('id', () => {
	it('should return true for a valid id', () => {
		const validIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, Number.MAX_SAFE_INTEGER];

		validIds.forEach(id => {
			const isValid = validateUtils.id(id);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for an invalid id', () => {
		const invalidIds = ['hello world', NaN, 0, -7, -8, -9, -10, Number.MIN_SAFE_INTEGER];

		invalidIds.forEach(id => {
			const isValid = validateUtils.id(id);
			expect(isValid).toBe(false);
		});
	});
});
