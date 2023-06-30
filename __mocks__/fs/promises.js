const promises = jest.createMockFromModule('fs/promises');

promises.readFile = async (pathToFile) => {
    return {
        toString: () => 'test'};
}

module.exports = promises;


// const fs = jest.createMockFromModule('fs');
//
// fs.existsSync = () => {
//     return false;
// }
//
// module.exports = fs;
