import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

export class FileLogger {
  private readonly logPath: string
  private timer: NodeJS.Timeout | null = null

  constructor(logFileName: string = 'app.log') {
    const logDir = process.cwd() // log in current run directory
    this.logPath = path.join(logDir, logFileName)
  }

  private getTimestamp(): string {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')

    const year = now.getFullYear()
    const month = pad(now.getMonth() + 1)
    const day = pad(now.getDate())
    const hour = pad(now.getHours())
    const minute = pad(now.getMinutes())
    const second = pad(now.getSeconds())

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  public log(message: string): void {
    try {
      const timestamp = this.getTimestamp()
      const entry = `[${timestamp}] ${message}\n`
      fs.appendFileSync(this.logPath, entry, { encoding: 'utf8', flag: 'a' })
    } catch (err) {
      console.error('Failed to write to log file:', err)
    }
  }

  public writePing(intervalMs: number = 10000, raspberryPiStats: boolean = false): void {
    this.timer = setInterval(() => {
      const mem = process.memoryUsage()
      const format = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

      const memoryReport = `rss: ${format(mem.rss)}, heapUsed: ${format(mem.heapUsed)}, heapTotal: ${format(mem.heapTotal)}`
      this.log(`ping - ${memoryReport}`)
      if (raspberryPiStats) {
        try {
          const cpuTemp = execSync('vcgencmd measure_temp').toString().trim()
          const cpuLoad = execSync('vcgencmd measure_clock arm').toString().trim()
          const throttled = execSync('vcgencmd get_throttled').toString().trim()
          this.log(`Raspberry Pi Stats - cpuTemp: ${cpuTemp}, cpuLoad:${cpuLoad}, throttled:${throttled}`)
        } catch (err) {
          this.log(`Failed to get Raspberry Pi stats: ${err}`)
        }
      }
    }, intervalMs)
  }


  public setupExitHandlers(): void {
    const handleExit = (reason: string) => {
      this.log(`everything process - ${reason}`)
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }

    process.on('exit', () => this.log('everything process - exit'))
    process.on('SIGINT', () => handleExit('SIGINT'))
    process.on('SIGTERM', () => handleExit('SIGTERM'))
    process.on('uncaughtException', (err) => {
      this.log(`Uncaught Exception: ${err.stack || err.message}`)
      handleExit('uncaughtException')
    })
    process.on('unhandledRejection', (reason: any) => {
      this.log(`Unhandled Rejection: ${reason}`)
      handleExit('unhandledRejection')
    })
  }
}
