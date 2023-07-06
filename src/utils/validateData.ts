import { Base64Img } from 'types';

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
	const isValidFormat = usernameRegex.test(usernameInput);
	const isValidLength = usernameInput.length >= 4 && usernameInput.length <= 20;
	return isValidFormat && isValidLength;
};

//TODO: Fix punctuation marks validation
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

	const descriptionRegex = /^[a-zA-Z0-9\s,.!?'"\\-]+$/;
	const isValidFormat = descriptionRegex.test(descriptionInput);
	const isValidLength = descriptionInput.length >= 10 && descriptionInput.length <= 200;
	return isValidFormat && isValidLength;
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

export default { email, username, description, base64Image };
