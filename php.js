import phpServer from 'php-server';

const server = await phpServer();
console.log(`PHP server running at ${server.url}`);