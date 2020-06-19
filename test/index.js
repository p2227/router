const http = require('http');
const Router = require('../lib');

const { SPACE_NAME, GROUP_NAME, ENV_NAME } = Router;
const servers = [
  {
    host: '127.0.0.1',
    port: 8080,
  },
  {
    host: '127.0.0.1',
    port: 8080,
  },
];

const router = new Router(servers);

const addEnv = (req, res) => {
  res.on('error', () => {});
  const { headers } = req;
  headers[SPACE_NAME] = 'imweb';
  headers[GROUP_NAME] = 'avenwu';
  // headers[ENV_NAME] = encodeURIComponent('测试'); // 可选
  req.isUIRequest = /127\.0\.0\.1/.test(headers.host);
};

const server = http.createServer(async (req, res) => {
  await addEnv(req, res);
  router.proxy(req, res);
});

server.on('connect', async (req, socket) => {
  await addEnv(req, socket);
  router.proxy(req, socket);
});

server.on('upgrade', async (req, socket) => {
  await addEnv(req, socket);
  router.proxy(req, socket);
});

server.listen(5566);
