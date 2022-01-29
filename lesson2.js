const http = require("http");
const fs = require('fs');

const host = 'localhost';
const port = 8000;

const user = {
  id: 123,
  username: testuser,
  password: qwerty,
};

const requestListener = (req, res) => {

};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});