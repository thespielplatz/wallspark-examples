import { colors, Fill, GameEngine, Text } from '@thespielplatz/wall-spark-engine'
import { defineEventHandler, getQuery, readBody, Router } from 'h3'

export default (gameEngine: GameEngine, router: Router) => {
  const textBackground = new Fill({
    color: colors.BLACK,
    visible: false,
  })
  const text = new Text({
    x: 1,
    y: 0,
    //centerOnWidth: config.config.width,
    text: '',
    visible: false,
  })

  gameEngine.addGameObject(textBackground)
  gameEngine.addGameObject(text)

  router.post(
    '/sbs-demo',
    defineEventHandler<{query: { duration?: number }, body: { wallet?: string, memo?: string, amountSats?: string }[] }>(async (event) => {
      const query = getQuery(event)
      const bodies = await readBody(event)
      if (bodies.length === 0) {
        return 'not ok'
      }
      const body = bodies[0]
      text.text = `${body.amountSats || '?'} sats`
      textBackground.visible = true
      text.visible = true
      setTimeout(() => {
        textBackground.visible = false
        text.visible = false
      }, 5_000)
      return 'ok'
    }),
  )
}