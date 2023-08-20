const jwtConfig = {
	expiresIn: 86_400_000, // 24 hours
	expiresInRememberMe: 2_592_000_000, // 30 days
	generateNewTokenInterval: 1_800_000, // 30 minutes
};

export default jwtConfig;
