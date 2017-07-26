import { handleActions } from 'redux-actions';
import { actions } from 'js/actions';

const actionMap = {};
actionMap[actions.SET_GAME_INFO] = (state, action) => (
  Object.assign({}, state, { game: action.payload })
);

const initialState = {
  gameReady: false,
  game: {},
};

const reducer = handleActions(actionMap, initialState);

export default reducer;
