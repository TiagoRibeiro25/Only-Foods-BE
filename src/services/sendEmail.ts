import axios from 'axios';

type PersonData = {
	name: string;
	email: string;
};

interface Props {
	from: PersonData;
	to: PersonData[];
	subject: string;
	content: string;
}

/**
 * Send an email using Mailjet
 * @param {Props} props The data to send the email
 * @returns {Promise<void>} A promise that resolves when the email is sent
 */
export default async (props: Props): Promise<void> => {
	// Create the data to send
	const data = JSON.stringify({
		Messages: [
			{
				From: {
					Email: process.env.MAILJET_FROM_EMAIL,
					Name: `${props.from.name} - ${props.from.email}`,
				},
				To: props.to,
				Subject: props.subject,
				HTMLPart: props.content,
			},
		],
	});

	// Send the email
	await axios({
		method: 'post',
		url: process.env.MAILJET_URL,
		headers: { 'Content-Type': 'application/json' },
		auth: {
			username: process.env.MAILJET_PUBLIC_KEY,
			password: process.env.MAILJET_SECRET_KEY,
		},
		data,
	});
};
