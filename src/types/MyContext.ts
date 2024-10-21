import { Request, Response } from "express"; // Only keep this import

export interface MyContext {
    req: Request;
    res: Response;
}
