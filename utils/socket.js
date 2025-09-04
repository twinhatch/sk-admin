import SocketIOClient from 'socket.io-client';

const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'],
    forceNew: true,

    //optional
    // query: {
    //   source: 'auction:mobile',
    //   platform: Platform.OS === 'ios' ? IOS : ANDROID,
    // },
};
// const URL = 'http://localhost:3000';
const URL = 'https://apis.sadanamkayyilundo.in/';
export const socket = SocketIOClient(URL, connectionConfig);