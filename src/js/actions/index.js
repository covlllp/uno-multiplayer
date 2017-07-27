import { createActions } from 'redux-actions';

export const actions = {
  INDICATE_GAME_READY: 'INDICATE_GAME_READY',
  SET_GAME_INFO: 'SET_GAME_INFO',
  SET_PLAYER_INFO: 'SET_PLAYER_INFO',
};

export const actionCreators = createActions(...Object.keys(actions));

function deserializeGameData(json) {
  const { discardDeck, drawDeck, players, turn, _id } = json;
  return {
    discardDeck,
    drawDeck,
    players,
    turn,
    id: _id,
  };
}

function deserializePlayerData(json) {
  const { cards, _id } = json;
  return {
    cards,
    id: _id,
  };
}

export function createNewGame(dispatch) {
  return fetch('/api/game/create', {
    method: 'POST',
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

