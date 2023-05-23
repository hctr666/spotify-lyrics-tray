const { EventEmitter } = require('events')

class Emittable {
  events = []
  eventEmitter = new EventEmitter()

  on = (event, fn) => {
    if (!this.eventEmitter) {
      console.error('Event emitter instance not found')
    }

    if (this.events.includes(event)) {
      return this.eventEmitter.on(event, fn)
    }

    throw new Error(`Unable to add listener for [${event}]`)
  }

  emit = (event, ...args) => {
    if (!this.events.includes(event)) {
      throw new Error('Invalid event')
    }

    return this.eventEmitter.emit(event, ...args)
  }
}

module.exports = {
  Emittable,
}
