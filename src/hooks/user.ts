import { User } from "@/schema";
import { useState } from "react";
import { useDocument } from "./document";

export const useUser = () => {
    const userId = localStorage.getItem("userId");
    const [doc, changeDoc] = useDocument();
    const [user, setUser] = useState<User | null>(doc?.users.find((u) => u.id === userId) || null);

    const mySetUser = (user: User) => {
        setUser(user);
        localStorage.setItem("userId", user.id);
        changeDoc((d) => {
            const userIndex = d.users.findIndex((u) => u.id === user.id);
            if (userIndex !== -1) {
                d.users[userIndex] = user;
            } else {
                d.users.push(user);
            }
        });
    }

    return [user, mySetUser] as const;

};
