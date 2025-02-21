/* eslint-disable @typescript-eslint/no-unused-vars */
namespace api {
    type Statement = {
        id: number;
        text: string;
        createdAt: string;
        parent_id: number | null;
    }
}