

export default function cookiegen(req)
{
    const cookie = {
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge: 24 * 60 * 60 * 1000 ,

    }
    return cookie
    
}