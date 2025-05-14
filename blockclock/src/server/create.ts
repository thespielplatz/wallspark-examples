import { createApp, createRouter, defineEventHandler, eventHandler, getQuery, handleCors, toNodeListener } from 'h3'
import { createServer } from 'node:http'

export default (port: number = 2022) => {
  const app = createApp()
  app.use(eventHandler((event) => {
    handleCors(event, {
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
    })
  }))
  const router = createRouter()
  app.use(router)
  router.get(
    '/',
    defineEventHandler(() => {
      return 'Running!'
    }),
  )
  return { 
    server: createServer(toNodeListener(app)).listen(port, () => {
      console.info('Server started on port', port)    
    }),
    router,
  }
}
