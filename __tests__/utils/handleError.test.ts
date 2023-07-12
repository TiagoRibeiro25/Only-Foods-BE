import { Response } from 'express';
import ERRORS from '../../src/data/errors.json';
import handleError from '../../src/utils/handleError';
import handleResponse from '../../src/utils/handleResponse';

interface Error {
	message: string;
	status: number;
}

jest.mock('../../src/utils/handleResponse');

describe('handleError', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should handle and send the response for a known error', () => {
		const error = new Error('Invalid username');
		const errorFound = {
			message: 'Invalid username',
			status: 400,
		};
		const responseMock = {
			res: 'mocked response',
		} as unknown as Response;

		(ERRORS as Error[]).find = jest.fn().mockReturnValueOnce(errorFound);
		(console.log as jest.Mock) = jest.fn();

		handleError({ res: responseMock, error, fileName: 'handleError.test.ts' });

		expect(ERRORS.find).toHaveBeenCalledWith(expect.any(Function));
		expect(handleResponse).toHaveBeenCalledWith({
			res: responseMock,
			status: 'error',
			statusCode: errorFound.status,
			message: errorFound.message,
		});
		expect(console.log).not.toHaveBeenCalled();
	});

	it('should handle and send the response for an unknown error', () => {
		const error = new Error('Unknown Error');
		const responseMock = {
			res: 'mocked response',
		} as unknown as Response;

		(ERRORS as Error[]).find = jest.fn().mockReturnValueOnce(undefined);
		(console.log as jest.Mock) = jest.fn();

		handleError({ res: responseMock, error, fileName: 'handleError.test.ts' });

		expect(ERRORS.find).toHaveBeenCalledWith(expect.any(Function));
		expect(handleResponse).toHaveBeenCalledWith({
			res: responseMock,
			status: 'error',
			statusCode: 500,
			message: 'Something went wrong!',
		});
		expect(console.log).toHaveBeenCalledTimes(2);
	});
});
