import { Base64Img } from 'types';

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
 * - Must be between 10 and 200 characters
 * @param descriptionInput - The description to validate
 * @returns {boolean} - Whether the description is valid or not
 */
const description = (descriptionInput: string): boolean => {
	if (typeof descriptionInput !== 'string') {
		return false;
	}

	const descriptionRegex = /^[a-zA-Z0-9\s:,.!?'"\\-]+$/;
	const isValidFormat = descriptionRegex.test(descriptionInput);
	const isValidLength = descriptionInput.length >= 10 && descriptionInput.length <= 200;
	return isValidFormat && isValidLength;
};

/**
 *  Validate a thought content
 * - Can have letters, numbers, spaces, and common punctuation marks
 * - Must be between 10 and 200 characters
 * @param thoughtContentInput - The thought content to validate
 * @returns {boolean} - Whether the thought content is valid or not
 */
const thoughtContent = (thoughtContentInput: string): boolean => {
	if (typeof thoughtContentInput !== 'string') {
		return false;
	}

	// Since both thoughtContent and description have the same validation rules, we can just reuse the description validation function
	return description(thoughtContentInput);
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
	// check if the image is more than 1MB
	if (imageInput.length > 1e6) {
		return false;
	}

	const base64Regex =
		/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;
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
	thoughtContent,
	base64Image,
	id,
	pagination,
};
