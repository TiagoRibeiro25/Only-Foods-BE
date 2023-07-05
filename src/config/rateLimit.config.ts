import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
	// This value determines the time window within which the rate limits are enforced. It is typically set in milliseconds or seconds. The appropriate value depends on the expected frequency of requests and the desired granularity of rate limiting.
	windowMs: 1 * 60 * 1000,

	// This value represents the maximum number of requests allowed per IP address within the specified windowMs.
	max: 20,

	// Enabling this option allows the API to return rate limit information in the RateLimit-* headers. These headers can be useful for clients to understand their rate limit status and adjust their behavior accordingly.
	standardHeaders: true,

	// Disabling this option removes the X-RateLimit-* headers from the API responses. These headers are typically used by older clients or libraries that rely on them. If you don't have a specific need for legacy compatibility, it's safe to disable this option.
	legacyHeaders: false,
});

export default limiter;
