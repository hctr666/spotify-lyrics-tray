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
    const buffer = this.store.get(key)

    if (!buffer) {
      return null
    }

    return safeStorage.decryptString(Buffer.from(buffer, DEFAULT_ENCODING))
  }

  setPassword = (key, password) => {
    const buffer = safeStorage.encryptString(password)
    this.store.set(key, buffer.toString(DEFAULT_ENCODING))
  }

  deletePassword = key => {
    this.store.delete(key)
  }
}

module.exports = SafeStore
