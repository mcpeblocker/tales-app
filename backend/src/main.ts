import { server } from './core/server';
import { config } from './utils/config';
import { routes } from './routes';
import process from 'node:process';
import { db } from './core/db';
import express from 'express';
import cors from 'cors';

server.use(cors({
    origin: ['http://localhost:3000', 'https://tales.mcpeblocker.uz'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

server.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

for (const route of routes) {
    server.use(route.path, route.handler);
    console.log(`Route initialized: ${route.path}`);
}

server.get('/*', (_, res) => {
    res.status(404).send({ message: 'Not Found' });
});

server.listen(config.PORT, (error) => {
    if (error) {
        console.error("Can't start server, got error.", error);
        process.exit(1);
    }
    console.log(`Server is listening on port ${config.PORT}`);
});

// Graceful shutdown prisma client
process.on('SIGINT', async () => {
    // Interrupt signal
    await db.$disconnect();
    process.exit(1);
});

process.on('SIGTERM', async () => {
    // Terminate signal
    await db.$disconnect();
    process.exit(0);
});