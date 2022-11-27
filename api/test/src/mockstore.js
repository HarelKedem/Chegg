let mockstore;

// mockstore 
exports.mockstore = {
  read: jest.fn((id) => 'Message'),
  save: jest.fn((id, message) => {})
};