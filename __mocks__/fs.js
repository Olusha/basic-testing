const fs = jest.createMockFromModule('fs');

fs.existsSync = () => {
    return false;
}

module.exports = fs;
