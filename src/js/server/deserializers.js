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

export function deserializeGameData(json) {
  const {
    discardDeck,
    drawDeck,
    players,
    turn,
    _id,
    lastPlayedCard,
  } = json;
  return {
    discardDeck,
    drawDeck,
    players,
    turn,
    id: _id,
    lastPlayedCard: deserializeCardData(lastPlayedCard),
  };
}

export function deserializePlayerData(json) {
  const { cards, isReady, _id } = json;
  return {
    id: _id,
    isReady,
    cards: cards.map(card => deserializeCardData(card)),
  };
}

export function deserializeGameDataForPlayer(json, playerId) {
  const { _id, turn } = json;
  const rawPlayers = json.players;
  const players = rawPlayers.map(player => deserializePlayerData(player));
  const playerIds = players.map(player => player.id);

  const playerIndex = playerIds.indexOf(playerId);
  const player = playerIndex !== -1 ? players[playerIndex] : null;
  const playerTurn = turn === playerIndex;
  const gameId = _id;

  return {
    gameId,
    player,
    playerTurn,
  };
}
