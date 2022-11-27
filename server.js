const server = require("./index");
const { port } = require('./config');


server.listen(port, () => {
  console.log(`App running on: ${port}`);
});

module.exports = server;
