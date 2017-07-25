import { handleActions } from 'redux-actions';
import { actions } from 'js/actions';

const actionMap = {};
actionMap[actions.SET_PLAYER] = (state, action) => (
  Object.assign({}, state, { player: action.playload })
);

const initialState = {
  player: {},
};

const reducer = handleActions(actionMap, initialState);

export default reducer;
