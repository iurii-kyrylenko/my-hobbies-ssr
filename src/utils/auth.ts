import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./session";

export interface User {
    id: string;
    email: string;
    name: string;
    shareBooks: boolean;
    shareMovies: boolean;
}

interface UserRecord extends User {
    // todo: salt + hash
    password: string;
}

const mockUsers: UserRecord[] = Array.from(
    { length: 100 },
    (_, i) => ({
        id: i.toString(),
        email: `user${i}@gmail.com`,
        name: `user${i}`,
        password: `${i}${i}`,
        shareBooks: true,
        shareMovies: true,
    })
);

const authenticateUser = (email: string, password: string) =>
    Promise.resolve(
        mockUsers.find((user) => user.email === email && user.password === password) ?? null
    );

const getUserById = (userId: string) =>
    Promise.resolve(
        mockUsers.find((user) => user.id === userId) ?? null
    );

export const loginFn = createServerFn({ method: "POST" })
    .inputValidator((data: { email: string; password: string; redirectTo: string }) => data)
    .handler(async ({ data }) => {
        const user = await authenticateUser(data.email, data.password);

        if (!user) {
            return { error: "Invalid credentials" };
        }

        // Create session
        const session = await useAppSession();
        await session.update({
            sub: user.id,
            email: user.email,
            name: user.name,
        });

        // Redirect to protected area
        throw redirect({ to: data.redirectTo });
    });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
    const session = await useAppSession();
    await session.clear();
    throw redirect({ to: '/' });
});

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
    async (): Promise<User | null> => {
        const session = await useAppSession();
        const userId = session.data.sub;
        if (!userId) {
            return null;
        }

        const user = await getUserById(userId);
        if (!user) {
            return null;
        }

        const { password, ...publicData } = user;
        return publicData;
    },
);
