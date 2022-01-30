const http = require("http");
const fs = require('fs');
const path = require('path');

const host = 'localhost';
const port = 8000;

const user = {
    id: 123,
    username: 'testuser',
    password: 'qwerty',
};

const cookieToObject = function (cookie) {
    return Object.fromEntries(cookie.split(';').map(value => value.trim().split('=')));
}

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
                const isAuth = `true; Expires=${(new Date(expiresDate + (1000 * timeToLiveCookie) + (1000 * timezone))).toUTCString()}; Max-Age=${timeToLiveCookie}; domain=localhost; path=/;`;
                // 8
                const userID = `${user.id}; Expires=${(new Date(expiresDate + (1000 * timeToLiveCookie) + (1000 * timezone))).toUTCString()}; Max-Age=${timeToLiveCookie}; domain=localhost; path=/;`;
                res.setHeader('Set-Cookie', [`userID=${userID}`, `authorized=${isAuth}`])
                res.writeHead(200);
                res.end(`Добро пожаловать, Вы авторизованы`);
            } else {
                res.writeHead(400);
                res.end('Неверный логин или пароль');
            }
        })
    } else if (req.url === '/post' && req.method === 'POST') {
        const cookie = req.headers.cookie;
        const cookieParse = cookieToObject(cookie);
        // Тут я решил ID привести к строке чем к числу, т.к. ID не всегда числовой, а строка я думаю будет универсальней
        if (user.id.toString() === cookieParse.userID) {
            // console.log(cookie, 'cookie')
            // console.log(cookieParse, 'cookieParse')
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                const parsedData = JSON.parse(data);
                try {
                    const dir = path.join(__dirname, 'files');
                    fs.stat(dir, function (err, stats) {
                        if (err) {
                            fs.mkdirSync(dir);
                        }
                        fs.writeFile(
                            path.join(dir, `${parsedData.filename}`),
                            parsedData.content + '\n',
                            {
                                encoding: "utf8",
                                flag: "a"
                            },
                            (err) => {
                                if (err) throw err;
                                console.log('The file has been saved!');
                            }
                        );
                        res.writeHead(200);
                        res.end(`Добро пожаловать ${user.username}`);
                    });
                } catch (err) {
                    res.writeHead(500);
                    res.end('Internal server error');
                }
            });

        } else {
            res.writeHead(401);
            res.end(`Вы не авторизованы`);
        }
    } else if (req.url === '/delete' && req.method === 'DELETE') {
        const cookie = req.headers.cookie;
        const cookieParse = cookieToObject(cookie);
        if (user.id.toString() === cookieParse.userID) {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                const parsedData = JSON.parse(data);
                try {
                    const dir = path.join(__dirname, 'files', `${parsedData.filename}`);
                    fs.stat(dir, function (err, stats) {
                        if (err) {
                            res.writeHead(404);
                            res.end('Файл или дирректория не найдены, или уже были удалены ранее');
                            return
                        } else {
                            fs.unlink(dir, (err) => {
                                if (err) throw err;
                                console.log(`файл ${parsedData.filename}  был успешно удален`);
                            });
                            res.writeHead(200);
                            res.end(`файл ${parsedData.filename}  был успешно удален`);
                        }
                    });
                } catch (err) {
                    res.writeHead(500);
                    res.end('Internal server error');
                }
            });
        } else {
            res.writeHead(401);
            res.end(`Вы не авторизованы`);
            return
        }

    } else {
        res.writeHead(405);
        res.end('HTTP method not allowed');
    }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


// {
//     "username": "testuser",
//     "password": "qwerty"
// }