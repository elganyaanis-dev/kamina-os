const net = require('net');

function findFreePort(startPort = 3000) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(startPort, '0.0.0.0', () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            findFreePort(startPort + 1).then(resolve);
        });
    });
}

findFreePort(2930).then(port => {
    console.log(port);
    process.exit(0);
});
