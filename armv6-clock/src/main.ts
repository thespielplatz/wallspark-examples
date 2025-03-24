import 'module-alias/register'
import { Config, GameEngine, Time, Fill, colors } from '@thespielplatz/wall-spark-engine'
import loadConfigFromMultipleSouces from '@shared/lib/loadConfigFromMultipleSources'

// eslint-disable-next-line no-console
console.info('Example - Clock armv6')

const configFiles = ['config.json', '../config.json']
const config = loadConfigFromMultipleSouces(configFiles)
const gameEngine = new GameEngine(config.config)

gameEngine.addGameObject(new Fill({ color: colors.BLACK }))

const time = new Time({
  x: 0,
  y: 0,
  centerOnWidth: config.config.width,
})
gameEngine.addGameObject(time)

gameEngine.start()
gameEngine.on(GameEngine.EVENT_STOPPED, () => {
  process.exit(0)
})
