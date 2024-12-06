// import { createContext, useContext, useEffect, useState } from "react";
// import { createUser, createDevice, DeviceWithSecrets, UserWithSecrets, Team } from '@localfirst/auth'
// import { AuthProvider } from '@localfirst/auth-provider-automerge-repo'
// import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
// import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
// import { Repo } from "@automerge/automerge-repo";
// import { useDocUrl } from "./document";
// import { v4 as uuidv4 } from "uuid";
// import { get } from "http";
// type User = {
//   id: string;
//   name: string;
// }

// type UserProviderProps = {
//   children: React.ReactNode;
//   // defaultUser?: User;
//   storageKey?: string;
// };

// type UserProviderState = {
//   user: UserWithSecrets | null;
//   setUser: (user: string) => void;
//   getInviteCode: () => Promise<string | undefined>;
// };

// const initialState: UserProviderState = {
//   user: null,
//   setUser: () => null,
//   getInviteCode: async () => undefined,
// };

// const UserProviderContext = createContext<UserProviderState>(initialState);

// export function UserProvider({
//   children,
//   storageKey = "migrainelog-user",
//   ...props
// }: UserProviderProps) {
//   const [user, setUser] = useState<UserWithSecrets | null>(() => {
//     const user = localStorage.getItem(storageKey);
//     if (user) {
//       return JSON.parse(user);
//     }
//     return null;
//   });
//   const [device, setDevice] = useState<DeviceWithSecrets | null>(null);
//   const [_, setRepo] = useRepo();
//   const [docUrl, __] = useDocUrl();
//   const storage = new IndexedDBStorageAdapter();
//   const [team, setTeam] = useState<Team | null>(null);
//   const getInviteCode = async () => {
//     if (!team) return;
//     const {seed: inviteCode} = await team.inviteDevice();
//     console.log(inviteCode);
//     return inviteCode;
//   }

//   useEffect(() => {
//     if (!user || !device) return;
//     const authProvider = new AuthProvider({ user: { ...user }, device, storage, server: "wss://sync.automerge.org" });
//     const adapter = new BrowserWebSocketClientAdapter("wss://sync.automerge.org");
//     const network = [authProvider.wrap(adapter)];
//     authProvider.createTeam('team A').then((team) => {
//       setTeam(team);
//     });
//     setRepo(new Repo({ network, storage }));
//     setDevice(device);
//     setUser(user);
//     localStorage.setItem(storageKey, JSON.stringify(user));
//   }, [docUrl, user, device]);

//   const value = {
//     user,
//     setUser: (user: string) => {
//       localStorage.setItem(storageKey, JSON.stringify(user));

//       setUser(createUser(user, uuidv4()));
//     },
//     getInviteCode,
//   };

//   return (
//     <UserProviderContext.Provider
//       {...props}
//       value={value}
//     >
//       {children}
//     </UserProviderContext.Provider>
//   );
// }

// export const useUser = () => {
//   const context = useContext(UserProviderContext);

//   if (context === undefined)
//     throw new Error("useUser must be used within a UserProvider");

//   return [context.user, context.setUser] as const;
// };
