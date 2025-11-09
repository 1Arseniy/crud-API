import cluster from 'cluster';
import process from 'process';
import http from 'http';
import os from 'os';

import { createServer } from './index';

const port = Number(process.env.PORT) || 3000;
let start = 0;
const workers: number[] = [];

function startCluster() {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < os.cpus().length; i++) {
      const newPort = port + i + 1;
      workers.push(newPort);
      cluster.fork({ PORT: newPort });
    }

    const balanceWorker = http.createServer((req, res) => {
      const server = workers[start];
      start = (start + 1) % workers.length;

      const proxy = http.request(
        {
          hostname: 'localhost',
          port: server,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 0, proxyRes.headers);
          proxyRes.pipe(res);
        },
      );

      proxy.on('error', (err) => {
        console.log(`Error ${err.message}`);
        res.end();
      });

      req.pipe(proxy);
    });

    balanceWorker.listen(port, () => {
      console.log(`balanceWorker runing ${port}`);
    });

    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork({ PORT: port + start });
    });
  } else {
    createServer(Number(process.env.PORT));
  }
}

startCluster();
