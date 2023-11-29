/**
 * Importing the 'https' module to enable HTTP requests.
 */
const https = require('https');

/**
 * Function to fetch data from a URL using the HTTP protocol. 
 * If an error occurs, it automatically retries the request.
 * @param {string} url - The URL from which data will be retrieved.
 * @param {number} maxRetries - The maximum number of retries in case of an error. Default is 3.
 * @returns {Promise} A Promise that resolves with the data obtained from the URL or rejects in case of an error.
 */
function fetchData(url, maxRetries = 3) {
    let retries = 0;

    return new Promise((resolve, reject) => {
        const makeRequest = () => {
            https.get(url, (response) => {
                let data = '';

                response.on('data', (fragment) => {
                    data += fragment;
                });

                response.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (parseError) {
                        console.error('Error parsing JSON:', parseError);
                        reject(parseError);
                    }
                });

                response.on('error', (error) => {
                    console.error('Error in the response of the request:', error);
                    if (retries < maxRetries) {
                        retries++;
                        console.log(`Retrying... (Attempt ${retries} of ${maxRetries})`);
                        makeRequest();
                    } else {
                        console.error(`Max retries reached. Could not complete the request after ${retries} attempts.`);
                        reject(error);
                    }
                });
            }).on('error', (error) => {
                console.error('Error in the response of the request:', error);
                if (retries < maxRetries) {
                    retries++;
                    console.log(`Retrying... (Attempt ${retries} of ${maxRetries})`);
                    makeRequest();
                } else {
                    console.error(`Max retries reached. Could not complete the request after ${retries} attempts.`);
                    reject(error);
                }
            });
        };

        makeRequest();
    });
}

/**
 * Function to asynchronously retrieve users and their respective posts.
 * @returns {Promise} A Promise that resolves with an array of users, each enhanced with formatted address, company name, and their posts, or rejects in case of an error.
 */
async function getUsersAndTheirPosts() {
    try {
        const [users, posts] = await Promise.all([
            // Get user data.
            fetchData('https://jsonplaceholder.typicode.com/users'),

            // Retrieve data from the posts.
            fetchData('https://jsonplaceholder.typicode.com/posts'),
        ]);

        const usersAndPosts = mapUsersAndPosts(users, posts);

        return usersAndPosts;
    } catch (error) {
        handleDataRetrievalError(error);
        throw error;
    }
}

/**
 * Function to map users and add their respective posts.
 */
function mapUsersAndPosts(users, posts) {
    return users.map(user => {
        const formattedAddress = formatUserAddress(user);
        const userPosts = filterUserPosts(user, posts);

        return {
            ...user,
            address: formattedAddress,
            company: user.company.name,
            posts: userPosts,
        };
    });
}

/**
 * @throws {Error} Throws an error if there is an issue with formatting the address.
 */
function formatUserAddress(user) {
    try {
        return formatAddress(user.address);
    } catch (formatError) {
        console.error('Error formatting address:', formatError);
        throw formatError;
    }
}

function handleDataRetrievalError(error) {
    console.error('Error while retrieving data:', error);
    throw error;
}

/**
 * Function to filter users and add their respective posts
 */
function filterUserPosts(user, posts) {
    return posts.filter(post => post.userId === user.id).map(({ id, title, body }) => ({ id, title, body }));
}

/**
 * Function to format an address by combining its components.
 * @param {Object} address - An object containing street, suite, zipcode, and city information.
 * @returns {string} The formatted address in the format: "street, suite - zipcode city".
 */
function formatAddress(address) {
    return `${address.street}, ${address.suite} - ${address.zipcode} ${address.city}`;
}

// Uncomment the following code to retrieve and display user data along with their posts in the terminal
// getUsersAndTheirPosts()
//     .then(result => {
//         console.log(JSON.stringify(result, null, 2));
//     })
//     .catch(error => {
//         console.error('General Error:', error.message);
//     });

module.exports = { getUsersAndTheirPosts, fetchData, formatAddress };

