const http = require("http");
const fs = require('fs');

const host = 'localhost';
const port = 8000;

const user = {
  id: 123,
  username: 'testuser',
  password: 'qwerty',
};

const requestListener = (req, res) => {
    if (req.url === "/auth" && req.method === 'POST') {
        let data = '';
        req.on('data', chunk => {
            // console.log(chunk);
            data += chunk;
        });
        req.on('end', () => {
            console.log(JSON.parse(data));
            res.writeHead(200);
            res.end(`${JSON.parse(data)}`);
        })


    }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});