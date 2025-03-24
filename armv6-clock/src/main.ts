import 'module-alias/register'
import { Config, GameEngine, Time, Fill, colors } from '@thespielplatz/wall-spark-engine'

// eslint-disable-next-line no-console
console.info('Example - Clock armv6')

let customConfigFile: string | undefined = undefined

const config = new Config({ configFile: customConfigFile })
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
