import 'module-alias/register'
import { Config, Fill, GameEngine, colors } from '@thespielplatz/wall-spark-engine'

import { getLogo } from '@shared/logos/logo'
import loadConfigFromMultipleSouces from '@shared/lib/loadConfigFromMultipleSources'

import BlockTime from './GameObjects/BlockTime'

// eslint-disable-next-line no-console
console.info('Example - BlockClock')

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

gameEngine.start()
gameEngine.on(GameEngine.EVENT_STOPPED, () => {
  process.exit(0)
})
