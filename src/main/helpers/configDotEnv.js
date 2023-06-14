const path = require('path')
const fs = require('fs')

const configDotEnv = () => {
  const dotEnvFile = path.resolve(__dirname, '..', '..', '..', '.env')

  if (fs.existsSync(dotEnvFile)) {
    require('dotenv').config({ path: dotEnvFile })
  }
}

module.exports = configDotEnv
