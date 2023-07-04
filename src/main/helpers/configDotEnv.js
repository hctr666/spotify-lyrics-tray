import path from 'path'
import dotenv from 'dotenv'
import fs from 'fs'

export const configDotEnv = () => {
  try {
    const dotEnvFile = path.resolve(__dirname, '.env')

    if (fs.existsSync(dotEnvFile)) {
      dotenv.config({ path: dotEnvFile })
    }
  } catch (error) {
    throw new Error(error)
  }
}
