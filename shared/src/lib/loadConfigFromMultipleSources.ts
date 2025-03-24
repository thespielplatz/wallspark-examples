import { Config } from '@thespielplatz/wall-spark-engine'

export default (configFiles: string[]): Config => {
  for (const configFile of configFiles) {
    try {
      const config = new Config({ configFile })
      return config
    } catch {
    }
  }

  throw new Error(`No config file found in ${configFiles.join(', ')}`)
}