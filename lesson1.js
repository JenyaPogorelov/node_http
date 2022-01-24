const http = require("http");
const fs = require('fs');

const host = 'localhost';
const port = 8000;

const requestListener = (req, res) => {
    // if (req.url === '/get' && req.method === 'GET') {
    //     res.writeHead(200);
    //     res.end('success');
    // } else {
    //     res.writeHead(404);
    //     res.end('we don\'t know');
    // }

    if (req.url === '/get' && req.method === 'GET') {
        try {
            let files = fs.readdirSync('files');
            res.writeHead(200);
            res.end(files.join(', '));
        } catch (err) {
            res.writeHead(500);
            res.end('Internal server error');
        }
    } else if (req.url === '/post' && req.method === 'POST') {
        res.writeHead(200);
        res.end('success');
    } else if (req.url === '/delete' && req.method === 'DELETE') {
        res.writeHead(200);
        res.end('success');
    }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});