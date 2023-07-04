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
 * Validate a username (can only have letters, numbers, underscores, hyphens, no spaces, and must be between 3 and 20 characters)
 * @param usernameInput - The username to validate
 * @returns {boolean} - Whether the username is valid or not
 */
const username = (usernameInput: string): boolean => {
	const usernameRegex = /^[a-zA-Z0-9_-]{4,20}$/;
	return usernameRegex.test(usernameInput);
};

export default { email, username };
