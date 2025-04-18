import express from 'express';
import { db } from '../core/db';
import { Prisma, Statement } from '@prisma/client';

const router = express.Router();

// router.get('/', async (_, res) => {
//     const statements = await db.statement.findMany();
//     res.status(200).json({ data: statements });
// });

router.get('/root', async (_, res) => {
    const statements = await db.statement.findMany({
        where: {
            parent_id: null
        },
        orderBy: {
            createdAt: Prisma.SortOrder.desc
        }
    });
    res.status(200).json({ data: statements });
});

router.get('/recommended', async (_, res) => {
    const statements = await db.statement.findMany({
        take: 5,
        orderBy: {
            createdAt: Prisma.SortOrder.desc
        }
    });
    res.status(200).json({ data: statements });
});

router.get('/:id', async (req, res) => {
    const statementId = parseInt(req.params.id);
    const statement = await db.statement.findFirst({
        where: {
            id: statementId
        }
    });
    if (!statement) {
        res.status(404).json({ message: 'Statement not found' });
    } else {
        res.status(200).json({ data: statement });
    }
});

router.get('/:id/children', async (req, res) => {
    const statementId = parseInt(req.params.id);
    const statements = await db.statement.findMany({
        where: {
            parent_id: statementId
        }
    });
    res.status(200).json({ data: statements });
});

router.get('/:id/siblings', async (req, res) => {
    const statementId = parseInt(req.params.id);
    const statement = await db.statement.findFirst({
        where: { id: statementId }
    });
    if (!statement) {
        res.status(404).json({ message: 'Statement not found' });
        return;
    }
    let siblings: Statement[] = [statement];
    if (statement.parent_id) {
        siblings = await db.statement.findMany({
            where: {
                parent_id: statement?.parent_id
            }
        })
    }
    res.status(200).json({ data: siblings });
})

router.post('/', async (req, res) => {
    const { text, parentId } = req.body;
    const newStatement = await db.statement.create({
        data: {
            text,
            parent_id: parentId
        }
    });
    res.status(201).json({ data: newStatement });
});

export default router;