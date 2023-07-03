import { createServer } from 'http';
import * as url from 'url';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { dirname } from 'path';
import { v4 as uuid, validate } from 'uuid';
import { createWriteStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseApi = '/api/users';

const getUsers = async () => {
    try {
        const filePath = getPath();
        const contents = await readFile(filePath, { encoding: 'utf8' });
        console.log(contents)
        return JSON.parse(contents || []);
    } catch (e) {
        throw e;
    }
}

const getPath = () => {
    return `${__dirname}/database/users.json`;
}

const deleteUser = async (uuid) => {
    try {
        const users = await getUsers();
        console.log('DELETE ', users)
        if (!users.find(u => u.id === uuid)) {
            throw new Error('404');
        }
        const updated = users.filter(u => u.id !== uuid);
        console.log(updated);

        updateFileContent(updated);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const updateFileContent = (content) => {
    const writeStream = createWriteStream(getPath());
    writeStream.write(JSON.stringify(content));
}

const getUser = async (uuid) => {
    const users = await getUsers();
    return users.find(user => user.id === uuid);
}


const createUser = async (user) => {
    try {
        const users = await getUsers();
        console.log(users)
        const updated = [...(users || []), {
            ...user,
            id: uuid()
        }];

        console.log(updated);

        updateFileContent(updated);

    } catch (e) {
        console.log(e);
        throw e;
    }
}

const updateUser = async (uuid, data) => {
    try {
        const users = await getUsers();
        const user = users.find(u => u.id === uuid);
        if (!user) {
            throw new Error('404');
        }
        const updated = [...(users || []), {
            ...user,
            ...data
        }];

        console.log(updated);

        updateFileContent(updated);

    } catch (e) {
        console.log(e);
        throw e;
    }
}

const validateCreateBody = (userData) => {
    return !!(!userData.username && !!userData.age && Array.isArray(userData.hobbies) && validateUpdateBody());
}

const validateUpdateBody = (userData) => {
    const isNameValid = userData.username ? typeof userData.username === 'string' : true;
    const isAgeValid = userData.age ? typeof userData.age === 'number' : true;
    const isHobbyValid =  (!userData.hobbies || userData.hobbies?.length === 0)
        ? true : userData.hobbies?.every(hobby => typeof hobby === 'string');

    return !!(isNameValid && isAgeValid && isHobbyValid);
}

const isReqById = (pathname) => {
    const splitted = pathname.split('/');
    return (splitted.slice(0, splitted.length - 1).join('/') === baseApi);
}

const getPathname = (req) => {
    return url.parse(req.url, true).pathname;
}

const getUuid = (pathname) => {
    const splitted = pathname.split('/');

    return splitted[splitted.length - 1]
}

const get = async (req, res) => {
    const pathname = getPathname(req);

    if (pathname === baseApi) {
        try {
            const users = await getUsers();
            res.write(JSON.stringify(users));
            return res.end();
        } catch (err) {
            res.writeHead(500);
            console.log(err)
            return res.end();
        }
    }

    if (isReqById(pathname)) {
        try {
            const uuid = getUuid(pathname);
            if (!validate(uuid)) {
                res.writeHead(400);
                return res.end();
            }
            const user = getUser(uuid);
            if (user) {
                res.writeHead(200, { 'Content-type': 'text/plain' });
                res.write(JSON.stringify(user));
            } else {
                res.writeHead(404);
            }

            return res.end();
        } catch (err) {
            res.writeHead(500);
            console.log(err)
            return res.end();
        }
    }


    res.writeHead(404);
    return res.end();
}

const post = async (req, res) => {
    const pathname = getPathname(req);

    if (pathname === baseApi) {
        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });
        req.on('end', async () => {
            try {
                const data = Buffer.concat(chunks);
                const body = JSON.parse(data.toString());
                const isValid = validateCreateBody(body);
                if (isValid) {
                    await createUser(body);
                    res.writeHead(201);
                    return res.end()
                } else {
                    console.log('error', 400)
                    res.writeHead(400);
                    return res.end()
                }
            } catch (e) {
                res.writeHead(500);
                console.log(e)
                return res.end();
            }
        });
    }

    res.writeHead(404);
    return res.end();
}

const put = async (req, res) => {
    const pathname = getPathname(req);

    if (isReqById(pathname)) {
        const uuid = getUuid(pathname);
        if (!validate(uuid)) {
            res.writeHead(400);
            return res.end();
        }

        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });
        req.on('end', async () => {
            try {
                const data = Buffer.concat(chunks);
                const body = JSON.parse(data.toString());
                const isValid = validateUpdateBody(body);
                if (isValid) {
                    await updateUser(uuid, body);
                    res.writeHead(201);
                    return res.end()
                } else {
                    console.log('error', 400)
                    res.writeHead(400);
                    return res.end()
                }
            } catch (e) {
                res.writeHead(500);
                console.log(e)
                return res.end();
            }
        });

    }
}

const deleteMethod = async (req, res) => {
    const pathname = getPathname(req);

    if (isReqById(pathname)) {
        const uuid = getUuid(pathname);
        if (!validate(uuid)) {
            res.writeHead(400);
            return res.end();
        }

        try {
            await deleteUser(uuid);
            res.writeHead(201);
            return res.end();
        } catch (e) {
            if (e.message === '404') {
                res.writeHead(404);
                return res.end();
            }

            res.writeHead(500);
            return res.end();
        }

    }
}

const requestListener = async function (req, res) {

    if (req.method === 'GET') {
        await get(req, res);
        return;
    }

    if (req.method === 'POST') {
        await post(req, res);
        return;
    }

    if (req.method === 'PUT') {
        put(req, res);
        return;
    }

    if (req.method === 'DELETE') {
        await deleteMethod(req, res);
        return;
    }


    res.writeHead(200);
    res.end('Hello World from Node.js HTTP Server');
}

const server = createServer(requestListener);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('To terminate it, use Ctrl+C combination');
});
