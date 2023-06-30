const globals = jest.createMockFromModule('globals');

globals.__dirname = 'test';
module.exports = globals;
