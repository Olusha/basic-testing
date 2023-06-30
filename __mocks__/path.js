const path = jest.createMockFromModule('fs');
path.join = (dir, pathToFile) => {
    console.log('MOCKED CALLED ')
    return `${dir}${pathToFile}${1}`;
};

module.exports = path;
