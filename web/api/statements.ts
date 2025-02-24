import { client } from "./client"

type CreateStatementBody = {
    text: string;
    parentId?: number;
}

export const createStatement = async (text: string, parentId?: number): Promise<api.Statement> => {
    const body: CreateStatementBody = { text };
    if (parentId) {
        body.parentId = parentId;
    }
    const response = await client.post("/statements", body);
    if (response.status === 201) {
        return response.data.data;
    } else {
        throw new Error("Failed to create statement");
    }
};

export const getStatementById = async (id: number): Promise<api.Statement> => {
    const response = await client.get(`/statements/${id}`);
    if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error("Failed to get statement");
    }
}

export const getChildrenStatementsById = async (id: number): Promise<api.Statement[]> => {
    const response = await client.get(`/statements/${id}/children`);
    if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error("Failed to get children statements");
    }
}

export const getSiblingsStatementsById = async (id: number): Promise<api.Statement[]> => {
    const response = await client.get(`/statements/${id}/siblings`);
    if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error("Failed to get sibling statements");
    }
}

export const getRecommendedStatements = async (): Promise<api.Statement[]> => {
    const response = await client.get("/statements/recommended");
    if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error("Failed to get recommended statements");
    }
}