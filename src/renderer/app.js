function init() {
  const connectButton = document.getElementById('connect-lyrics')
  const disconnectButton = document.getElementById('diconnect-lyrics')
  const signOutButton = document.getElementById('sign-out')
  const signInButton = document.getElementById('sign-in')

  let isConnecting = false
  let isDisconnecting = false

  connectButton.addEventListener('click', () => {
    window.Application.connectLyrics()
    connectButton.setAttribute('disabled', '')
    connectButton.innerText = 'Connecting lyrics...'
    isConnecting = true
  })

  disconnectButton.addEventListener('click', () => {
    window.Application.disconnectLyrics()
    disconnectButton.setAttribute('disabled', '')
    disconnectButton.innerText = 'Disconnecting lyrics...'
    isDisconnecting = true
  })

  signOutButton.addEventListener('click', () => {
    window.Auth.signOut()
  })

  signInButton.addEventListener('click', () => {
    window.Auth.signIn()
  })

  window.Auth.subscribeOnAuthChange((_, value) => {
    window.Core.log({ ctx: 'app:renderer', value })

    const { isAuthenticated } = value

    if (isAuthenticated) {
      signInButton.style.display = 'none'
      signOutButton.style.display = ''
    } else {
      signInButton.style.display = ''
      signOutButton.style.display = 'none'
    }
  })

  window.Application.subscribeOnConnectionChange((_, status) => {
    window.Core.log({ ctx: 'app:renderer', status })

    if (status.connected) {
      connectButton.style.display = 'none'
      disconnectButton.style.display = ''

      if (!isDisconnecting) {
        disconnectButton.innerText = 'Disconnect lyrics'
        disconnectButton.removeAttribute('disabled')
      }
    } else {
      connectButton.style.display = ''
      disconnectButton.style.display = 'none'

      if (!isConnecting) {
        connectButton.innerText = 'Connect lyrics'
        connectButton.removeAttribute('disabled')
      }
    }

    isConnecting = false
    isDisconnecting = false
  })
}

init()
