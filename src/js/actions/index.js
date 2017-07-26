import { createActions } from 'redux-actions';

export const actions = {
  SET_GAME_INFO: 'SET_GAME_INFO',
};

export const actionCreators = createActions(...Object.keys(actions));

export function startGame(dispatch) {
  fetch('/api/game/start').then(res => res.json()).then((json) => {
    dispatch(actionCreators.setGameInfo(json));
  });
}
