import Logger from 'electron-log'

export const configLogger = ({ logToFile } = { logToFile: false }) => {
  Logger.initialize({
    preload: true,
  })

  if (!logToFile) {
    Logger.transports.file.level = false
  }

  Logger.hooks.push(message => {
    if (!logToFile) {
      return message
    }

    if (message.level === 'info') {
      Logger.transports.file.fileName = 'info.log'
    }

    if (message.level === 'error') {
      Logger.transports.file.fileName = 'error.log'
    }

    return message
  })
}

const CustomLogger = Object.assign(Logger, {
  logInfo: Logger.info,
  logError: Logger.error,
})

export default CustomLogger
