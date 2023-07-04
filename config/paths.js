const path = require('path')

const appSrc = path.resolve(process.cwd(), 'src')
const appMain = path.resolve(appSrc, 'main')
const appBuild = path.resolve(process.cwd(), '.vite/build')

module.exports = {
  appSrc,
  appBuild,
  appMainIndexJs: `${appMain}/index.js`,
  appPreload: `${appSrc}/preload`,
  appRenderer: `${appSrc}/renderer/app`,
  spotifyInject: `${appSrc}/spotify-inject`,
  mainPublic: `${appMain}/public`,
}
