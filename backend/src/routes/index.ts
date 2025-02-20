import statements from './statements';
import express from 'express';

interface IRoute {
    path: `/${string}`;
    handler: express.Router;
}

export const routes: IRoute[] = [
    {
        path: '/statements',
        handler: statements,
    }
];