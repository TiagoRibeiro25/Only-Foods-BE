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
			'A very long description that exceeds the maximum limit of 200 characters. A very long description that exceeds the maximum limit of 200 characters. A very long description that exceeds the maximum limit of 200 characters.',
		];

		invalidDescriptions.forEach(description => {
			const isValid = validateUtils.description(description);
			expect(isValid).toBe(false);
		});
	});
});

describe('recipe description', () => {
	it('should return true for a valid description', () => {
		const validDescriptions = [
			'This is a valid description.',
			'A valid description with punctuation marks: !?.,',
			'A valid description with numbers: 1234567890',
			'The perfect classic cheesecake is rich, not too dense, silky smooth, and as creamy as can be. Our recipe combines a handful of simple ingredients to make a satisfying dessert that everyone loves. You could serve this cheesecake as is for celebrations of any kind, but if you want to go the extra mile, try a drizzle of melted dark chocolate or a handful of fresh berries on top. A buttery graham cracker crust makes this dessert an instant classic. The crumbly texture is a perfect complement to the velvety smooth cream cheese filling.',
		];

		validDescriptions.forEach(description => {
			const isValid = validateUtils.recipeDescription(description);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for an invalid description', () => {
		const invalidDescriptions = [
			'Short',
			'A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters.A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters. A very long description that exceeds the maximum limit of 550 characters.',
		];

		invalidDescriptions.forEach(description => {
			const isValid = validateUtils.recipeDescription(description);
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

describe('recipeTitle', () => {
	it('should return true for a valid recipe title', () => {
		const validTitles = [
			'Delicious Recipe',
			'Recipe with numbers: 123',
			'Recipe with punctuation: !?.,',
		];

		validTitles.forEach(title => {
			const isValid = validateUtils.recipeTitle(title);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for an invalid recipe title', () => {
		const invalidTitles = [
			'',
			'A',
			'A very long recipe title that exceeds the maximum limit of 50 characters.',
		];

		invalidTitles.forEach(title => {
			const isValid = validateUtils.recipeTitle(title);
			expect(isValid).toBe(false);
		});
	});
});

describe('pagination', () => {
	it('should return true for valid pagination data', () => {
		const validData = [
			{ page: 1, limit: 10 },
			{ page: 2, limit: 20 },
			{ page: '3', limit: '30' },
		];

		validData.forEach(data => {
			const isValid = validateUtils.pagination(data);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for invalid pagination data', () => {
		const invalidData = [
			{ page: 0, limit: 10 },
			{ page: 2, limit: 0 },
			{ page: -3, limit: 30 },
			{ page: 'invalid', limit: '30' },
		];

		invalidData.forEach(data => {
			const isValid = validateUtils.pagination(data);
			expect(isValid).toBe(false);
		});
	});
});

describe('thoughtContent', () => {
	it('should return true for valid thought content', () => {
		const validThoughts = [
			'This is a valid thought content.',
			'A valid thought with punctuation marks: !?.,',
			'A valid thought with numbers: 1234567890',
		];

		validThoughts.forEach(thought => {
			const isValid = validateUtils.thoughtContent(thought);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for invalid thought content', () => {
		const invalidThoughts = [
			'', // Empty string
			'A very long thought that exceeds the maximum limit of 1000 characters. '.repeat(
				20,
			), // Too long
		];

		invalidThoughts.forEach(thought => {
			const isValid = validateUtils.thoughtContent(thought);
			expect(isValid).toBe(false);
		});
	});
});

describe('recipeNotes', () => {
	it('should return true for valid recipe notes', () => {
		const validNotes = [
			'This is a valid recipe note.',
			'A valid note with punctuation marks: !?.,',
			'A valid note with numbers: 1234567890',
		];

		validNotes.forEach(note => {
			const isValid = validateUtils.recipeNotes(note);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for invalid recipe notes', () => {
		const invalidNotes = [
			'', // Empty string
			'A', // Too short
			'A very long recipe note that exceeds the maximum limit of 2000 characters. '.repeat(
				30,
			), // Too long
		];

		invalidNotes.forEach(note => {
			const isValid = validateUtils.recipeNotes(note);
			expect(isValid).toBe(false);
		});
	});
});

describe('commentContent', () => {
	it('should return true for valid comment content', () => {
		const validComments = [
			'This is a valid comment.',
			'A valid comment with punctuation marks: !?.,',
			'A valid comment with numbers: 1234567890',
		];

		validComments.forEach(comment => {
			const isValid = validateUtils.commentContent(comment);
			expect(isValid).toBe(true);
		});
	});

	it('should return false for invalid comment content', () => {
		const invalidComments = [
			'', // Empty string
			'A', // Too short
			'A very long comment that exceeds the maximum limit of 2000 characters. '.repeat(
				30,
			), // Too long
		];

		invalidComments.forEach(comment => {
			const isValid = validateUtils.commentContent(comment);
			expect(isValid).toBe(false);
		});
	});
});
