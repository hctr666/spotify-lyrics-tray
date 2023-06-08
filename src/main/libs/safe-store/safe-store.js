const { safeStorage } = require('electron')
const Store = require('electron-store')

const DEFAULT_ENCODING = 'latin1'

class SafeStore {
  constructor() {
    this.store = new Store({
      name: 'app-encrypted',
      watch: true,
    })
  }

  getPassword = key => {
    try {
      const buffer = this.store.get(key)

      if (!buffer) {
        return null
      }

      return safeStorage.decryptString(Buffer.from(buffer, DEFAULT_ENCODING))
    } catch (error) {
      throw new Error(error)
    }
  }

  setPassword = (key, password) => {
    try {
      const buffer = safeStorage.encryptString(password)
      this.store.set(key, buffer.toString(DEFAULT_ENCODING))
    } catch (error) {
      throw new Error(error)
    }
  }

  deletePassword = key => {
    try {
      this.store.delete(key)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = SafeStore
