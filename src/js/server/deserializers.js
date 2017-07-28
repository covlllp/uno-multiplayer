export function deserializeGameData(json) {
  const { discardDeck, drawDeck, players, turn, _id } = json;
  return {
    discardDeck,
    drawDeck,
    players,
    turn,
    id: _id,
  };
}

export function deserializePlayerData(json) {
  const { cards, isReady, _id } = json;
  return {
    id: _id,
    isReady,
    cards,
  };
}
