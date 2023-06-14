const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs/promises')
const ENV = process.env.NODE_ENV

// Creates a .env file based on existing .envrc file to be used in prod
const createProductionEnvFile = async buildPath => {
  try {
    const envrcFile = path.resolve(buildPath, '.envrc')
    const envrcContents = await fs.readFile(envrcFile, { encoding: 'utf-8' })

    let dotenvContents = envrcContents
      .split('\n')
      .map(line => line.replace(/^export\s/g, ''))

    dotenvContents.push(`NODE_ENV=${ENV}`) // append current environment
    dotenvContents = dotenvContents.join('\n')

    const dotenvFile = path.resolve(buildPath, '.env')

    await fs.writeFile(dotenvFile, dotenvContents)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  packagerConfig: {
    all: false,
    icon: path.resolve(__dirname, 'src/assets/logo.icns'),
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
    prePackage: async () => {
      await exec('yarn renderer:build')
    },
    packageAfterCopy: async (_config, buildPath) => {
      await createProductionEnvFile(buildPath)
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
}
