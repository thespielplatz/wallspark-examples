// eslint-disable-next-line no-console
console.info('Exit the room')

import { createApp, createRouter, defineEventHandler, getQuery, toNodeListener } from 'h3'
import { createServer } from 'node:http'

import GameEngine from '@tsp/wse/GameEngine/GameEngine'
import { Config } from '@tsp/wse/GameEngine/Config'

import { SceneSchema } from './sceneSchema'
import Time from '@tsp/wse/GameObjects/Animations/Time'
import Countdown from '@tsp/wse/GameObjects/Animations/Countdown'
import Fill from '@tsp/wse/GameObjects/Drawing/Fill'
import { BLACK } from '@tsp/wse/GameEngine/drawing/colors'
import Blinker from '@tsp/wse/GameObjects/Animations/Blinker'
import Text from '@tsp/wse/GameObjects/Drawing/Text'


let customConfigFile: string | undefined = undefined

if (process.argv.length > 2) {
  customConfigFile = process.argv[2]
}

const config = new Config({ configFile: customConfigFile })
const gameEngine = new GameEngine(config.config)

const scene = SceneSchema.parse(config.config.scene)

const backTime = new Fill({
  color: BLACK,
})

const time = new Time({
  x: 0,
  y: 0,
  showSeconds: scene.showSeconds,
  centerOnWidth: config.config.width,
  color: 0x101010,
})

const backCountdown = new Blinker({
  colors: [0x040000, 0x000000],
  wait: 0.5,
  visible: false,
})

const countdown = new Countdown({
  x: 0,
  y: 0,
  centerOnWidth: config.config.width,
  startTime: 0,
  visible: false,
  color: 0xA0A0A0,
})

const textBackground = new Fill({
  color: BLACK,
  visible: false,
})
const text = new Text({
  x: 0,
  y: 0,
  centerOnWidth: config.config.width,
  text: '',
  visible: false,
})

gameEngine.addGameObject(backTime)
gameEngine.addGameObject(time)

gameEngine.addGameObject(backCountdown)
gameEngine.addGameObject(countdown)

gameEngine.addGameObject(textBackground)
gameEngine.addGameObject(text)

gameEngine.start()
gameEngine.on(GameEngine.EVENT_STOPPED, () => {
  process.exit(0)
})

const app = createApp()
const router = createRouter()
app.use(router)
router.get(
  '/',
  defineEventHandler(() => {
    return 'Running!'
  }),
)
router.get(
  '/timerStart',
  defineEventHandler(() => {
    countdown.setTime(60 * 60)
    backCountdown.visible = true
    countdown.visible = true
    return 'ok'
  }),
)
router.get(
  '/timerSetTime',
  defineEventHandler<{query: { time: number } }>((event) => {
    const query = getQuery(event)
    backCountdown.visible = true
    countdown.visible = true
    countdown.setTime(query.time)
    return 'ok'
  }),
)
router.get(
  '/timerOff',
  defineEventHandler(() => {
    backCountdown.visible = false
    countdown.visible = false
    return 'ok'
  }),
)
router.get(
  '/timerReduce',
  defineEventHandler<{query: { time: number } }>((event) => {
    const query = getQuery(event)
    countdown.reduceBy(query.time)
    return 'ok'
  }),
)
router.get(
  '/showText',
  defineEventHandler<{query: { text: string, duration?: number } }>((event) => {
    const query = getQuery(event)
    const duration = (query.duration || 2) * 1000
    text.text = query.text
    textBackground.visible = true
    text.visible = true
    setTimeout(() => {
      textBackground.visible = false
      text.visible = false
    }, duration)
    return 'ok'
  }),
)

createServer(toNodeListener(app)).listen(2022)
