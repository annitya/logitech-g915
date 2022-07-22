import {Socket} from 'net';
import {EventEmitter} from "events";

EventEmitter.defaultMaxListeners = 45;

const PORT = 23;
const ADDRESS = '192.168.10.128';

/**
 * Class to connect to reciever
 */
export default class Denon {
    /** @var Socket */
    socket;

    constructor(onData, onError = console.error) {
        this.socket = new Socket({allowHalfOpen: true});

        this.socket.on('data', onData);
        this.socket.on('error', onError)
    }

    /**
     * Connect to the reciever
     */
    async connect() {
        this.socket.connect(PORT, ADDRESS, () => {
            console.log('Connected Successfully!');
        });
    }

    /**
     * Log all incoming data. Call this function when instantiating the Denon object
     */
    logData() {
        this.socket.on('data', console.log);
    }

    /**
     * Send a command to the reciever, resolve promise with response
     * @param {string} cmd
     */
    command(cmd) {
        this.socket.write(`${cmd}\r`);
    }
};
