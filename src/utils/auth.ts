import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { useAppSession } from "./session";

interface User {
    id: string;
    email: string;
    password: string;
}

const mockUsers: User[] = Array.from(
    { length: 100 },
    (_, i) => ({
        id: i.toString(),
        email: `user${i}@gmail.com`,
        password: `${i}${i}`,
    })
);

const authenticateUser = (email: string, password: string) =>
    Promise.resolve(
        mockUsers.find((user) => user.email === email && user.password === password)
    );

const getUserById = (userId: string) =>
    Promise.resolve(
        mockUsers.find((user) => user.id === userId)
    );

export const loginFn = createServerFn({ method: "POST" })
    .inputValidator((data: FormData) => {
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        return { email, password };
    })
    .handler(async ({ data }) => {
        const user = await authenticateUser(data.email, data.password);

        if (!user) {
            throw Response.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Create session
        const session = await useAppSession();
        await session.update({
            userId: user.id,
            email: user.email,
        });

        // Redirect to protected area
        const request = getRequest();
        const url = new URL(request.url);
        const redirectTo = url.searchParams.get("redirect") || "/protected-1";
        throw redirect({ to: redirectTo });
    });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
    const session = await useAppSession();
    await session.clear();
    throw redirect({ to: '/' });
});

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const session = await useAppSession();
        const userId = session.data.userId;

        if (!userId) {
            return null;
        }

        return await getUserById(userId);
    },
);
