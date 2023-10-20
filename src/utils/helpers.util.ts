import bcrypt from 'bcrypt'

// Hashing of password
export const hashPassword = (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

// Comparing of password
export const comparePassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}
