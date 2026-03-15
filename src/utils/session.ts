import { useSession } from "@tanstack/react-start/server";

interface SessionData {
    sub: string;
    email: string;
    name: string;
}

export function useAppSession() {
    return useSession<SessionData>({
        name: "app-session",
        password: process.env.SESSION_SECRET!,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            httpOnly: true,
            maxAge: 31536000,
        },
    })
}
