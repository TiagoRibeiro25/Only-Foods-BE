/**
 * Validate an email
 * @param emailInput - The email to validate
 * @returns {boolean} - Whether the email is valid or not
 */
const email = (emailInput: string): boolean => {
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
	const usernameRegex = /^[a-zA-Z0-9_\\-]+( [a-zA-Z0-9_\\-]+)*$/;
	const isValidFormat = usernameRegex.test(usernameInput);
	const isValidLength = usernameInput.length >= 4 && usernameInput.length <= 20;
	return isValidFormat && isValidLength;
};

export default { email, username };
