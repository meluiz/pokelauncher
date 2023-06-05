import localforage from 'localforage'
import { create } from 'zustand'

/**
 * @typedef {Object} UserMeta - Represents a user object.
 * @property {boolean} online - The UUID of the user.
 * @property {string} type - The UUID of the user.
 */

/**
 * @typedef {Object} User - Represents a user object.
 * @property {string} access_token - The UUID of the user.
 * @property {string} client_token - The UUID of the user.
 * @property {UserMeta} meta - The UUID of the user.
 * @property {string} name - The UUID of the user.
 * @property {string} user_properties - The UUID of the user.
 * @property {string} uuid - The UUID of the user.
 */

/**
 * @typedef {Object} Auth - Contains authentication-related methods.
 * @property {function(): void} verify - Verifies saved data .
 * @property {function(User): Promise<void>} login - Logs in the user asynchronously.
 * @property {function(User[]): Promise<void>} updateAccounts - Updates the list of user accounts asynchronously.
 * @property {function(User): Promise<void>} addUserToAccounts - Adds a new user to the accounts asynchronously.
 * @property {function(User): Promise<void>} addNewAccount - Logs in a new user and adds it to the accounts asynchronously.
 * @property {function(User): Promise<void>} removeUpdateAccount - Delete and update a user account asynchronously.
 */

/**
 * @typedef {Object} AuthState - Represents the state of the authentication.
 * @property {User|null} user - The currently logged-in user or null if no user is logged in.
 * @property {User[]} accounts - An array of user accounts.
 * @property {Auth} auth - An array of user accounts.
 */

/**
 * @typedef {function(): AuthState} UseAuthStore - Represents the useAuthStore function.
 * @property {function(function(AuthState): void): void} setState - Updates the state with the provided updater function.
 * @property {function(): AuthState} getState - Retrieves the current state.
 * @property {function(function(): void): function(): void} subscribe - Subscribes to state changes and returns an unsubscribe function.
 * @property {function(): void} destroy - Cleans up the store and unsubscribes all listeners.
 */

/**
 * The useAuthStore function creates a Zustand store for authentication.
 * @type {UseAuthStore}
 */

const useAuthStore = create((set) => ({
  user: null,
  accounts: [],
  auth: {
    async verify() {
      const user = (await localforage.getItem('actived_account')) || null
      const accounts = (await localforage.getItem('access_accounts')) || []

      set({ user, accounts })
    },
    async login(user) {
      if (typeof user === 'undefined') {
        user = null
      }

      await localforage.setItem('actived_account', user)
      return set({ user })
    },
    async updateAccounts(accounts = []) {
      await localforage.setItem('access_accounts', accounts)
      return set({ accounts })
    },
    async addUserToAccounts(user) {
      set(async (state) => {
        const accounts = state.accounts

        if (!accounts.some((u) => u.name.toLowerCase() === user.name.toLowerCase())) {
          accounts.push(user)
        }

        await state.auth.updateAccounts(accounts)
      })
    },
    async addNewAccount(user) {
      set(async (state) => {
        await state.auth.login(user)
        await state.auth.addUserToAccounts(user)
      })
    },
    async removeUpdateAccount(user) {
      set(async (state) => {
        const [account, ...accounts] = state.accounts.filter(
          (u) => u.name.toLowerCase() !== user.name?.toLowerCase()
        )

        if (user.name.toLowerCase() === state.user.name.toLowerCase()) {
          await state.auth.login(account)
        }

        if (typeof account === 'undefined') {
          await state.auth.updateAccounts([])
          return
        }

        await state.auth.updateAccounts([...accounts, account])
      })
    }
  }
}))

export default useAuthStore
