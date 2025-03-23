import { getQuery, H3Event } from 'h3'

export default (event: H3Event, key: string): null | string => {
  const query = getQuery(event)
  return query[key] ?? null
}
