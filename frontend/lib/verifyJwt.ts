import { jwtVerify } from "jose";
export const getJwtSecretKey = () => {
const secret = process.env.JWT_SECRET;
if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET is not set.");
}
return secret;
};
export async function verifyJwtToken(token:string) {
try {
    const verified = await jwtVerify(
        token,
        new TextEncoder().encode(getJwtSecretKey())
    );
    return verified.payload;
} catch (error:any) {
    throw new Error("Your token is expired");
}
}