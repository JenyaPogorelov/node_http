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
            data += chunk;
        });
        req.on('end', () => {
            const auth = JSON.parse(data);
            const expiresDate = Date.now();
            const timezone = 60 * 60 * (new Date().getTimezoneOffset() / -60);
            const timeToLiveCookie = 60 * 60 * 24 * 2;

            if (user.username === auth.username && user.password === auth.password) {
                const isAuth = `true, Expires=${(new Date(expiresDate + (1000 * timeToLiveCookie) + (1000 * timezone))).toUTCString()}; max_age=${timeToLiveCookie}; domain=localhost; path=/;`;
                8
                const userID = `${user.id}, Expires=${(new Date(expiresDate + (1000 * timeToLiveCookie) + (1000 * 60 * 60 * 3))).toUTCString()}; max_age=${timeToLiveCookie}; domain=localhost; path=/;`;
                res.setHeader('Set-Cookie', [`userId=${userID}`, `authorized=${isAuth}`])
                res.writeHead(200);
                res.end(`Добро пожаловать`);
            }

        })


    }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});