import 'module-alias/register'
import { Config, Fill, GameEngine, colors } from '@thespielplatz/wall-spark-engine'

import { getLogo } from '@shared/logos/logo'
import loadConfigFromMultipleSouces from '@shared/lib/loadConfigFromMultipleSources'
import { FileLogger } from '@shared/lib/FileLogger'

import BlockTime from './GameObjects/BlockTime'
import create from './server/create'
import sbsDemo from './server/routes/sbs-demo'

// eslint-disable-next-line no-console
console.info('Example - BlockClock')

const fileLogger = new FileLogger()
fileLogger.log(`BlockClock started at ${new Date().toISOString()}`)
fileLogger.writePing()
fileLogger.setupExitHandlers()

const LOGO_PADDING = 1

const configFiles = ['config.json', '../config.json']
const config = loadConfigFromMultipleSouces(configFiles)
const gameEngine = new GameEngine(config.config)

const blocktime = new BlockTime({
  centerOnWidth: config.config.width,
})

const logoLeft = getLogo('Sate')
logoLeft.x = LOGO_PADDING

const logoRight = getLogo('TheSpielplatz')
logoRight.x = config.config.width - logoRight.width - LOGO_PADDING

gameEngine.addGameObject(new Fill({ color: colors.BLACK }))
gameEngine.addGameObject(logoLeft)
gameEngine.addGameObject(logoRight)
gameEngine.addGameObject(blocktime)

const { server, router } = create()
sbsDemo(gameEngine, router)

gameEngine.start()
gameEngine.on(GameEngine.EVENT_STOPPED, () => {
  server.close(() => {
    console.info('Server stopped')
    process.exit(0)
  })
})

