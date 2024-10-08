
    import jwt, { decode } from 'jsonwebtoken';
    import { GraphQLError } from 'graphql';
    import dotenv from 'dotenv';

    dotenv.config();

    const jwtSecret = process.env.JWT_SECRET || 'default';
export const verifyAdminToken = async (token: string): Promise<any> => {
    if (!token) {
        throw new GraphQLError('Authentication token is required', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }
    try {
        console.log("jwt secret in verifyAdminToken", jwtSecret);
        const decoded = jwt.verify(token, jwtSecret) as any;
        console.log("decoded", decoded);

        if (decoded.role !== 'admin') {
            throw new GraphQLError('Access denied: Admins only', {
                extensions: { code: 'FORBIDDEN' },
            });
        }

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new GraphQLError('Token expired', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new GraphQLError('Invalid token', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }
        throw new GraphQLError('Authentication failed', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }
};