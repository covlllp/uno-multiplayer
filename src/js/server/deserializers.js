export function deserializeCardData(json) {
  if (!json) return null;

  const { _id, color, value, penalty } = json;
  return {
    color,
    value,
    penalty,
    id: _id,
  };
}

function getTurnInfo(gameData) {
  const {
    lastPlayedCard,
    turnInfo,
  } = gameData;
  const cardData = turnInfo || lastPlayedCard;
  return deserializeCardData(cardData);
}

export function deserializePlayerData(json) {
  const { cards, isReady, _id } = json;
  return {
    id: _id,
    isReady,
    cards: cards.map(card => deserializeCardData(card)),
  };
}

export function deserializeGameData(json) {
  const {
    discardDeck,
    drawDeck,
    players,
    turn,
    _id,
    lastPlayedCard,
  } = json;
  const turnInfo = getTurnInfo(json);
  return {
    discardDeck,
    drawDeck,
    players: players.map(player => deserializePlayerData(player)),
    turn,
    id: _id,
    lastPlayedCard: deserializeCardData(lastPlayedCard),
    turnInfo,
  };
}

export function deserializeGameDataForPlayer(json, playerId) {
  const { _id, turn } = json;
  const turnInfo = getTurnInfo(json);
  const rawPlayers = json.players;
  const players = rawPlayers.map(player => deserializePlayerData(player));
  const playerIds = players.map(player => player.id);

  const playerIndex = playerIds.indexOf(playerId);
  const player = playerIndex !== -1 ? players[playerIndex] : null;
  const playerTurn = turn === playerIndex;
  const gameState = {
    id: _id,
    turnInfo,
  };

  return {
    gameState,
    player,
    playerTurn,
  };
}
