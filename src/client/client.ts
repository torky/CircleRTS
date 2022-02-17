import { createSocket } from 'dgram';
import { Buffer } from 'buffer';
import { gamePortNumber } from '../utils/index.js'

const message = Buffer.from('Some bytes');
const client = createSocket('udp4');
client.send(message, gamePortNumber, 'localhost', (err) => {
  console.log(`${message}`);
  client.close();
});