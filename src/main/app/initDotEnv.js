import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

try {
  const dotEnvFile = path.resolve(__dirname, '.env')

  if (fs.existsSync(dotEnvFile)) {
    dotenv.config({ path: dotEnvFile })
  }
} catch (error) {
  throw new Error(error)
}
