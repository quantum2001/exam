import jwt from "jsonwebtoken"

// Sign jwt
export const signJWT = (data: any, type: "admin" | "student" | "school"):string => {
    const secretKey = process.env.SECRET_KEY || ""
    const payload = {
        data,
        type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        iss: "krendus-exam-server",
    }
    return jwt.sign(payload, secretKey)
}

// Verify jwt
export const verifyJWT = (token: string) => {
    const secretKey = process.env.SECRET_KEY || ""
    try {
        const decoded = jwt.verify(token, secretKey) as {
            data: any,
            type: "admin" | "student" | "school",
            iat: number,
            exp: number,
            iss: string,
        };
        return decoded;
    } catch (e) {
        return null;
    }
}
