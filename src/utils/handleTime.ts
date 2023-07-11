interface Props {
	createdAt: Date;
	currentTime?: Date;
}

interface Props {
	createdAt: Date;
	currentTime?: Date;
}

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

	// Define time intervals in seconds
	const minute = 60;
	const hour = 60 * minute;
	const day = 24 * hour;
	const month = 30 * day;
	const year = 365 * day;

	// Determine the appropriate time interval based on the number of seconds

	// Less than a minute
	if (seconds < minute) {
		return formatTimeAgo(seconds, 'second');
	}

	// Less than an hour
	else if (seconds < hour) {
		return formatTimeAgo(Math.floor(seconds / minute), 'minute');
	}

	// Less than a day
	else if (seconds < day) {
		return formatTimeAgo(Math.floor(seconds / hour), 'hour');
	}

	// Less than a month
	else if (seconds < month) {
		return formatTimeAgo(Math.floor(seconds / day), 'day');
	}

	// Less than a year
	else if (seconds < year) {
		return formatTimeAgo(Math.floor(seconds / month), 'month');
	}

	// More than a year
	else {
		return formatTimeAgo(Math.floor(seconds / year), 'year');
	}
}

export default { calculateTimeAgo };
