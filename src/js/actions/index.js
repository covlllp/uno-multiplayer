import { createActions } from 'redux-actions';

export const actions = {
  SET_PLAYER: 'SET_PLAYER',
};

export const dispatchActions = createActions(...Object.keys(actions));
