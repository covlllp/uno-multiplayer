import { createActions } from 'redux-actions';

import {
  deserializeGameData,
  deserializePlayerData,
} from 'js/server/deserializers';

import { socket } from 'js/socket';

export const actions = {
  INDICATE_GAME_READY: 'INDICATE_GAME_READY',
  SET_GAME_INFO: 'SET_GAME_INFO',
  SET_PLAYER_ID: 'SET_PLAYER_ID',
};

export const actionCreators = createActions(...Object.keys(actions));

export function updateGameData(dispatch, gameData) {
  const data = deserializeGameData(gameData);
  dispatch(actionCreators.setGameInfo(data));
}

export function fetchAndSetGameData({ route, method, dispatch, body }) {
  return fetch(route, {
    method,
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .then((json) => {
      updateGameData(dispatch, json);
    });
}

export function createNewGame(dispatch) {
  return fetchAndSetGameData({
    route: '/api/game/create',
    method: 'POST',
    dispatch,
    body: {},
  });
}

export function startGame(dispatch, gameId) {
  return fetchAndSetGameData({
    route: `/api/game/start/${gameId}`,
    method: 'PUT',
    dispatch,
    body: {},
  });
}


export function createPlayer(dispatch) {
  return fetch('/api/player', {
    method: 'POST',
  }).then(res => res.json())
    .then((json) => {
      const { id } = deserializePlayerData(json);
      dispatch(actionCreators.setPlayerId(id));
    });
}

export function updatePlayer(dispatch, gameId, playerId, body) {
  return fetch(`/api/player/${playerId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(() => {
    socket.emit('gameUpdate', gameId);
  });
}


export function playCard(dispatch, gameId, { playerId, cardId }) {
  const body = {
    playerId,
    cardId,
  };
  return fetchAndSetGameData({
    route: `/api/game/playCard/${gameId}`,
    method: 'PUT',
    dispatch,
    body,
  });
}

export function drawCards(dispatch, gameId, { playerId, amount, playAsTurn }) {
  const body = {
    playerId,
    amount,
    playAsTurn,
  };
  return fetchAndSetGameData({
    route: `/api/game/drawCards/${gameId}`,
    method: 'PUT',
    dispatch,
    body,
  });
}

