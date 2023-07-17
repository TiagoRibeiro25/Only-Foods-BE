interface Props {
	createdAt: Date;
	currentTime?: Date;
}

// Define time intervals in seconds
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Format the time ago string.
 * @param {number} time - The time value.
 * @param {string} unit - The unit of time.
 * @returns {string} The formatted time ago string.
 */
function formatTimeAgo(time: number, unit: string): string {
	const singularForm = time === 1 ? '' : 's';
	return `${time} ${unit}${singularForm} ago`;
}

/**
 * Calculate the time ago based on the provided createdAt and currentTime.
 * @param {Object} props - The properties object.
 * @param {Date} props.createdAt - The date of creation.
 * @param {Date} [props.currentTime] - The current date and time (optional), defaults to the current date and time.
 * @returns {string} The time ago string.
 */
function calculateTimeAgo({ createdAt, currentTime = new Date() }: Props): string {
	// Get the difference in seconds
	const seconds = Math.floor((currentTime.getTime() - createdAt.getTime()) / 1000);

	// Determine the appropriate time interval based on the number of seconds

	// Less than a minute
	if (seconds < MINUTE) {
		return formatTimeAgo(seconds, 'second');
	}

	// Less than an hour
	else if (seconds < HOUR) {
		return formatTimeAgo(Math.floor(seconds / MINUTE), 'minute');
	}

	// Less than a day
	else if (seconds < DAY) {
		return formatTimeAgo(Math.floor(seconds / HOUR), 'hour');
	}

	// Less than a month
	else if (seconds < MONTH) {
		return formatTimeAgo(Math.floor(seconds / DAY), 'day');
	}

	// Less than a year
	else if (seconds < YEAR) {
		return formatTimeAgo(Math.floor(seconds / MONTH), 'month');
	}

	// More than a year
	else {
		return formatTimeAgo(Math.floor(seconds / YEAR), 'year');
	}
}

export default { calculateTimeAgo };
