import localforage from 'localforage'
import { create } from 'zustand'

/**
 * @typedef {Array} Memory - Represents a memory array.
 * @property {number} - The minimum amount of RAM to allocate.
 * @property {number} - The maximum amount of RAM to allocate.
 */

/**
 * @typedef {Object} Action - Represents an action.
 * @property {function(): void} verify - Verifies saved data .
 * @property {function(Memory[]): Promise<void>} set - Sets the memory.
 */

/**
 * @typedef {Object} MemoryState - Represents the state of the memory.
 * @property {Memory|null} memory - The memory.
 * @property {Action} action - The action.
 */

/**
 * @typedef {function(): MemoryState} useMemoryStore - Represents the useAuthStore function.
 */

/**
 * The useMemoryStore function creates a Zustand store for authentication.
 * @type {useMemoryStore}
 */

const useMemoryStore = create((set) => ({
  memory: null,
  action: {
    async verify() {
      const memory = (await localforage.getItem('system-memory')) || null
      set({ memory })
    },
    async set(memory) {
      await localforage.setItem('system-memory', memory)
      return set({ memory })
    }
  }
}))

export default useMemoryStore
