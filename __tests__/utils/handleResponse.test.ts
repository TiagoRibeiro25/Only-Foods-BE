import { Response } from 'express';
import handleResponse from '../../src/utils/handleResponse';

describe('handleResponse', () => {
	it('should handle and send a success response with data', () => {
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response;

		const props = {
			res: responseMock,
			status: 'success' as const,
			statusCode: 200,
			message: 'Success',
			data: { name: 'John Doe' },
		};

		handleResponse(props);

		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.json).toHaveBeenCalledWith({
			success: true,
			message: 'Success',
			data: { name: 'John Doe' },
		});
	});

	it('should handle and send an error response without data', () => {
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response;

		const props = {
			res: responseMock,
			status: 'error' as const,
			statusCode: 500,
			message: 'Internal Server Error',
		};

		handleResponse(props);

		expect(responseMock.status).toHaveBeenCalledWith(500);
		expect(responseMock.json).toHaveBeenCalledWith({
			success: false,
			message: 'Internal Server Error',
		});
	});
});
