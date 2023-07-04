import { isDevelopment } from '../helpers/environment'
import { configLogger } from '../libs/logger'

configLogger({ logToFile: !isDevelopment() })
