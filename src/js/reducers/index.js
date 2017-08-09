import { handleActions } from 'redux-actions';
import { actions } from 'js/actions';

const actionMap = {};
actionMap[actions.INDICATE_GAME_READY] = state => ({
  ...state, gameReady: true,
});
actionMap[actions.SET_GAME_INFO] = (state, action) => ({
  ...state, game: action.payload,
});
actionMap[actions.SET_PLAYER_ID] = (state, action) => ({
  ...state, playerId: action.payload,
});

const initialState = {
  game: {
    players: [],
    drawDeck: [],
    discardDeck: [],
  },
  gameReady: false,
  playerId: null,
};

const reducer = handleActions(actionMap, initialState);

export default reducer;
