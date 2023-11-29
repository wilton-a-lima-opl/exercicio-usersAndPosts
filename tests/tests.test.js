const { fetchData, getUsersAndTheirPosts, formatAddress } = require('../main');

// Testing to confirm if the data is coming from the URL.
describe('fetchData function', () => {
    test('fetchData should fetch data from a URL', async () => {
        const data = await fetchData('https://jsonplaceholder.typicode.com/users');
        expect(data).toBeDefined();
    });
});

// Test to validate if the address is being formatted according to the pattern.
describe('formatAddress function', () => {
    test('formatAddress should format the address correctly', () => {
        const address = {
            street: '123 Street',
            suite: 'Suite 456',
            zipcode: '12345',
            city: 'Cityville',
        };
        const formatted = formatAddress(address);
        expect(formatted).toBe('123 Street, Suite 456 - 12345 Cityville');
    });

});

// Test to validate if the function returns an array.
describe('getUsersAndTheirPosts function', () => {
    test('getUsersAndTheirPosts function should return an array of users with posts', async () => {
        const result = await getUsersAndTheirPosts();
        expect(result).toBeInstanceOf(Array);
    });

});