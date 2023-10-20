import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt.util";

export const verifyStudent = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    const decoded = verifyJWT(token?.split(" ")[1] ?? "");
    if(decoded) {
        if(decoded.type === "student" && decoded.iss === "krendus-exam-server") {
            next();
        } else {
            res.status(401).send({
                message: "Unauthorized",
                data: null,
                status: "error"
            })
        }
    } else {
        res.status(401).send({
            message: "Unauthorized",
            data: null,
            status: "error"
        })
    }
}
export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    const decoded = verifyJWT(token?.split(" ")[1] ?? "");
    if(decoded) {
        if(decoded.type === "admin" && decoded.iss === "krendus-exam-server") {
            next();
        } else {
            res.status(401).send({
                message: "Unauthorized",
                data: null,
                status: "error"
            })
        }
    } else {
        res.status(401).send({
            message: "Unauthorized",
            data: null,
            status: "error"
        })
    }
}
export const verifySchool = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    const decoded = verifyJWT(token?.split(" ")[1] ?? "");
    if(decoded) {
        if(decoded.type === "school" && decoded.iss === "krendus-exam-server") {
            next();
        } else {
            res.status(401).send({
                message: "Unauthorized",
                data: null,
                status: "error"
            })
        }
    } else {
        res.status(401).send({
            message: "Unauthorized",
            data: null,
            status: "error"
        })
    }
}
