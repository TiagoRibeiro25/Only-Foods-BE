import { Base64Img } from '../types';

interface PaginationProps {
	page: string | number;
	limit: string | number;
}

/**
 * Validate an email
 * - Must be a valid email address format
 * @param emailInput - The email to validate
 * @returns {boolean} - Whether the email is valid or not
 */
const email = (emailInput: string): boolean => {
	if (typeof emailInput !== 'string') {
		return false;
	}

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(emailInput);
};

/**
 * Validate a username
 * - Can only have letters, numbers, underscores, hyphens, and one space between words
 * - Must be between 4 and 20 characters
 * @param usernameInput - The username to validate
 * @returns {boolean} - Whether the username is valid or not
 */
const username = (usernameInput: string): boolean => {
	if (typeof usernameInput !== 'string') {
		return false;
	}

	const usernameRegex = /^[a-zA-Z0-9_\\-]+( [a-zA-Z0-9_\\-]+)*$/;
	const isValidFormat: boolean = usernameRegex.test(usernameInput);
	const isValidLength: boolean = usernameInput.length >= 4 && usernameInput.length <= 20;
	return isValidFormat && isValidLength;
};

/**
 * Validate a description
 * - Can have letters, numbers, spaces, and common punctuation marks
 * - Can't have more than 10 "\n" characters
 * - Must be between 10 and 150 characters
 * @param descriptionInput - The description to validate
 * @returns {boolean} - Whether the description is valid or not
 */
const description = (descriptionInput: string): boolean => {
	if (typeof descriptionInput !== 'string') {
		return false;
	}

	const description = descriptionInput.trim();

	const newLineRegex = /\n/g;
	const newLineMatches = description.match(newLineRegex);
	if (newLineMatches && newLineMatches.length > 10) {
		return false;
	}

	const isValidLength = description.length >= 10 && description.length <= 150;
	return isValidLength;
};

/**
 * Validate a recipe description
 * - Can have letters, numbers, spaces, and common punctuation marks
 * - Can't have more than 10 "\n" characters
 * - Must be between 3 and 550 characters
 * @param recipeDescriptionInput - The recipe description to validate
 * @returns {boolean} - Whether the recipe description is valid or not
 */
const recipeDescription = (recipeDescriptionInput: string): boolean => {
	if (typeof recipeDescriptionInput !== 'string') {
		return false;
	}

	const recipeDescription = recipeDescriptionInput.trim();

	const newLineRegex = /\n/g;
	const newLineMatches = recipeDescription.match(newLineRegex);
	if (newLineMatches && newLineMatches.length > 10) {
		return false;
	}

	const isValidLength = recipeDescription.length >= 10 && recipeDescription.length <= 550;
	return isValidLength;
};

/**
 *  Validate a thought content
 * - Can have letters, numbers, spaces, and common punctuation marks
 * - Must be between 1 and 1000 characters
 * @param thoughtContentInput - The thought content to validate
 * @returns {boolean} - Whether the thought content is valid or not
 */
const thoughtContent = (thoughtContentInput: string): boolean => {
	if (typeof thoughtContentInput !== 'string') {
		return false;
	}

	const thought = thoughtContentInput.trim();

	const isValidLength = thought.length >= 1 && thought.length <= 1000;
	return isValidLength;
};

/**
 * Validate a recipe title
 * - Can have letters, numbers, spaces, and common punctuation marks
 * - Must be between 4 and 50 characters
 * @param recipeTitleInput - The recipe title to validate
 * @returns {boolean} - Whether the recipe title is valid or not
 */
const recipeTitle = (recipeTitleInput: string): boolean => {
	if (typeof recipeTitleInput !== 'string') {
		return false;
	}

	const recipeTitle = recipeTitleInput.trim();

	const isValidLength = recipeTitle.length >= 4 && recipeTitle.length <= 50;
	return isValidLength;
};

/**
 * Validate a recipe notes
 * - Can have letters, numbers, spaces, and common punctuation marks
 * - Must be between 7 and 2000 characters
 * @param recipeNotesInput - The recipe notes to validate
 * @returns {boolean} - Whether the recipe notes is valid or not
 */
const recipeNotes = (recipeNotesInput: string): boolean => {
	if (typeof recipeNotesInput !== 'string') {
		return false;
	}

	const recipeNotes = recipeNotesInput.trim();

	const isValidLength = recipeNotes.length >= 7 && recipeNotes.length <= 2000;
	return isValidLength;
};

/**
 * Validate a comment content
 * - Can have letters, numbers, spaces, and common punctuation marks
 * - Must be between 10 and 200 characters
 * @param commentContentInput - The comment content to validate
 * @returns {boolean} - Whether the comment content is valid or not
 */
const commentContent = (commentContentInput: string): boolean => {
	if (typeof commentContentInput !== 'string') {
		return false;
	}

	const comment = commentContentInput.trim();

	const isValidLength = comment.length >= 4 && comment.length <= 2000;
	return isValidLength;
};

/**
 * Validate a base64 image
 * - Must be less than 1MB
 * - Must be a valid image format (png, jpg, jpeg, bmp, webp)
 * - Must have a valid base64 format
 * @param imageInput - The base64 image to validate
 * @returns {boolean} - Whether the image is valid or not
 */
const base64Image = (imageInput: Base64Img): boolean => {
	const base64Regex =
		/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9+/])+={0,2}/;

	return base64Regex.test(imageInput);
};

/**
 * Validate an id (integer bigger than 0)
 * @param idInput - The id to validate
 * @returns {boolean} - Whether the id is valid or not
 */
const id = (idInput: string | number): boolean => +idInput > 0;

/**
 * Validates pagination data.
 * @param {number} page - The page number (default: 1)
 * @param {number} limit - The limit of items per page (default: 1)
 * @returns {boolean} - Returns true if the pagination data is valid, otherwise false
 */
const pagination = ({ page = 1, limit = 1 }: PaginationProps): boolean => {
	return +page >= 1 && +limit >= 1;
};

export default {
	email,
	username,
	description,
	recipeDescription,
	thoughtContent,
	recipeTitle,
	recipeNotes,
	commentContent,
	base64Image,
	id,
	pagination,
};
