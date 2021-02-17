import tracer from 'tracer'
import colors from 'colors'

export default tracer.colorConsole({
  level: 'log',
  filters: {
    log: colors.cyan,
    trace: colors.magenta,
    debug: colors.blue,
    info: colors.green,
    warn: colors.yellow,
    error: [colors.red.bold]
  },

  format: '{{path}}:{{line}} \n> {{message}}\n'
})
