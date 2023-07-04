const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs/promises')

const {
  appSrc,
  appPreload,
  appMainIndexJs,
  spotifyInject,
} = require('./config/paths')

// Creates a .env file based on existing .envrc
const createEnvFile = async (buildPath, env) => {
  try {
    const envrcFile = path.resolve(buildPath, '.envrc')
    const envrcContents = await fs.readFile(envrcFile, { encoding: 'utf-8' })

    let dotenvContents = envrcContents
      .split('\n')
      .map(line => line.replace(/^export\s/g, ''))

    dotenvContents.push(`NODE_ENV=${env}`) // append current environment
    dotenvContents = dotenvContents.join('\n')

    const dotenvFile = path.resolve(buildPath, `.vite/build/.env`)

    await fs.writeFile(dotenvFile, dotenvContents)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  packagerConfig: {
    all: false,
    icon: `${appSrc}/assets/logo.icns`,
    asar: {
      unpackDir: 'bin',
    },
    packageManager: 'yarn',
    overwrite: true,
    ignore: path => {
      const ignorePath = ['.', 'node_modules', '.git'].some(s =>
        path.startsWith(s)
      )
      return ignorePath
    },
  },
  rebuildConfig: {},
  hooks: {
    packageAfterCopy: async (_config, buildPath) => {
      await createEnvFile(buildPath, process.env.NODE_ENV)
      await exec(`cd ${buildPath} && yarn install --production`)
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: appMainIndexJs,
            config: 'config/vite/main.config.ts',
          },
          {
            entry: `${appPreload}/app.js`,
            config: 'config/vite/preload.config.ts',
          },
          {
            entry: `${appPreload}/spotify-web.js`,
            config: 'config/vite/preload.config.ts',
          },
          {
            entry: `${appPreload}/core.js`,
            config: 'config/vite/preload.config.ts',
          },
          {
            entry: `${spotifyInject}/index.js`,
            config: 'config/vite/spotify-inject.config.ts',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'config/vite/renderer.config.ts',
          },
        ],
      },
    },
  ],
}
