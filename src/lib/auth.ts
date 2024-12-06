// import { createUser, createDevice } from '@localfirst/auth'
// import { AuthProvider } from '@localfirst/auth-provider-automerge-repo'

// // Create the user & device, or retrieve them from storage.
// // These objects include secret keys, so need to be stored securely.
// const user = createUser('alice', "1")
// const device = createDevice(user, 'ALICE-MACBOOK-2023')

// // Use the same storage adapter for the `AuthProvider` and the `Repo.`
// const storage = new SomeStorageAdapter()

// // Instantiate the auth provider.
// const authProvider = new AuthProvider({ user, device, storage })

// // Use it to wrap your network adapter.
// const adapter = new SomeNetworkAdapter()
// const network = [authProvider.wrap(adapter)]

// // Instantiate the repo.
// const repo = new Repo({ network, storage })