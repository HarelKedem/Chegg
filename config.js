const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  enviorment: process.env.NODE_ENV,
  base_url: process.env.BASE_URL,
  test_url: process.env.TEST_URL,  
  port: process.env.PORT
};