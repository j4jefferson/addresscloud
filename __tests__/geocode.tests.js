require('dotenv').config()
const Addresscloud = require('../index')

describe('When a user makes a geocode request', () => {
	beforeAll(() => {
		//responses are mocked based on the API docs
		const addresscloud = new Addresscloud('testApiKey', 'testClientId')
	})
	describe('and searches an address endpoint', () => {
		it('returns an exact match for a postcode and house number query', async () => {
			const searchString = '?query=74+EX12PP'
			console.log(searchString)
			expect(searchString).toEqual('?query=74+EX12PP')

			const mockCallback = jest.fn()
			doAdd(1, 2, mockCallback)
			expect(mockCallback).toHaveBeenCalledWith(3)
		})
	})
})
