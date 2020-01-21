# Revorbaro-strummulu-Frontend
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The game is running at [https://revorbaro-ws.surge.sh](https://revorbaro-ws.surge.sh)

## How it works

### Setup

```js

// on App.js

// we create the client
const client = strummulu(REACT_APP_GAME_BACKEND_URL);

// we initialise it, on componentDidMount
client.init({
    [client.EVENTS.MESSAGE]: msg => this.messageHandler(msg),
    [client.EVENTS.ERROR]: msg => this.messageHandler(msg),
    [client.EVENTS.STATE_UPDATE]: data => this.gameStateUpdate(data)
});
```

There are 3 type of `EVENTS` that a `client` needs to handle: 
- `MESSAGE`: Simple message, used to setup the game
- `ERROR`: Will contain the errors raised by the server
- `STATE_UPDATE`: will have the new game state, it means that something has happened that made the game state update.

### Client Actions

```js
// a client can create e room
client.createRoom();

// it can join a room (given the right room id)
client.joinRoom(roomId);

// it can leave the room
client.leaveRoom(roomId);

// and can triggere game actions, those will be handled by the game logic class on the server
client.sendAction(type, joinedRoomId);

```
