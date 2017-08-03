import { createActions } from 'redux-actions';

import {
  deserializeGameData,
  deserializePlayerData,
  deserializeGameDataForPlayer,
} from 'js/server/deserializers';

export const actions = {
  INDICATE_GAME_READY: 'INDICATE_GAME_READY',
  SET_GAME_INFO: 'SET_GAME_INFO',
  SET_PLAYER_INFO: 'SET_PLAYER_INFO',
  SET_PLAYER_CARDS: 'SET_PLAYER_CARDS',
  INDICATE_PLAYER_READY: 'INDICATE_PLAYER_READY',
  SET_PLAYER_TURN: 'SET_PLAYER_TURN',
};

export const actionCreators = createActions(...Object.keys(actions));

export function createNewGame(dispatch) {
  return fetch('/api/game/create', {
    method: 'POST',
  }).then(res => res.json())
    .then((json) => {
      const data = deserializeGameData(json);
      dispatch(actionCreators.setGameInfo(data));
    });
}

export function startGame(dispatch, gameId) {
  return fetch(`/api/game/start/${gameId}`, {
    method: 'PUT',
  }).then(res => res.json())
    .then((json) => {
      const data = deserializeGameData(json);
      dispatch(actionCreators.setGameInfo(data));
    });
}


export function createPlayer(dispatch) {
  return fetch('/api/player', {
    method: 'POST',
  }).then(res => res.json())
    .then((json) => {
      const data = deserializePlayerData(json);
      dispatch(actionCreators.setPlayerInfo(data));
    });
}

export function updatePlayer(dispatch, playerId, body) {
  return fetch(`/api/player/${playerId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .then((json) => {
      const data = deserializePlayerData(json);
      dispatch(actionCreators.setPlayerInfo(data));
    });
}

export function readGameDataForPlayer(dispatch, gameData, playerId) {
  const { player, playerTurn, gameState } = deserializeGameDataForPlayer(gameData, playerId);
  const {
    setPlayerInfo,
    setPlayerTurn,
    setGameInfo,
  } = actionCreators;
  if (player) dispatch(setPlayerInfo(player));
  dispatch(setPlayerTurn(playerTurn));
  dispatch(setGameInfo(gameState));
}

export function playCard(dispatch, gameId, { playerId, cardId }) {
  const body = {
    playerId,
    cardId,
  };
  return fetch(`/api/game/playCard/${gameId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .then((json) => {
      readGameDataForPlayer(dispatch, json, playerId);
    });
}

export function drawCards(dispatch, gameId, { playerId, amount, playAsTurn }) {
  const body = {
    playerId,
    amount,
    playAsTurn,
  };
  return fetch(`/api/game/drawCards/${gameId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .then((json) => {
      readGameDataForPlayer(dispatch, json, playerId);
    });
}

