// Must be a valid email address
const email = (emailInput: string): boolean => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(emailInput);
};

// Can only have letters, numbers, underscores, hyphens, no spaces, and must be between 3 and 20 characters
const username = (usernameInput: string): boolean => {
	console.log(usernameInput);

	const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
	return usernameRegex.test(usernameInput);
};

export default { email, username };
