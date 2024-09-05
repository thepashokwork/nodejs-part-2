import { MyEventEmitter } from './events.js';

const myEventEmitter: MyEventEmitter = new MyEventEmitter();
let m: number = 0;


myEventEmitter.on('pong', (): void => {
  console.log('Ping event was called!');
});
myEventEmitter.emit('pong'); // Ping event was called!


myEventEmitter.once('once', (): void => {
  ++m;
});
myEventEmitter.emit('once');
console.log('m:', m); // 1
myEventEmitter.emit('once');
console.log('m:', m); // 1


myEventEmitter.on('eventToRemove', () => {
  console.log('Event will be removed!');
});
myEventEmitter.on('eventToRemove', () => {
  console.log('Event will be removed! 11111');
});
myEventEmitter.emit('eventToRemove');
// Event will be removed!
// Event will be removed! 11111

const count = MyEventEmitter.listenerCount(myEventEmitter, 'eventToRemove');
console.log(count); // 2

myEventEmitter.removeAllListeners('eventToRemove');
// Nothing happens, we removed all the event listeners
myEventEmitter.emit('eventToRemove');
