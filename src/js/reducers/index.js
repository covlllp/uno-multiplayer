import { handleActions } from 'redux-actions';
import { actions } from 'js/actions';

const actionMap = {};
actionMap[actions.INDICATE_GAME_READY] = state => ({
  ...state, gameReady: true,
});
actionMap[actions.SET_GAME_INFO] = (state, action) => ({
  ...state, game: action.payload,
});
actionMap[actions.SET_PLAYER_INFO] = (state, action) => ({
  ...state, player: action.payload,
});
actionMap[actions.SET_PLAYER_CARDS] = (state, action) => ({
  ...state, playerCards: action.payload,
});

const initialState = {
  game: {
    players: [],
    drawDeck: [],
  },
  gameReady: false,
  player: { isReady: false },
  playerCards: [],
};

const reducer = handleActions(actionMap, initialState);

export default reducer;
