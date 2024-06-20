export const formatOdds = (odds: number | string) => {
  return 1 / (typeof odds === 'number' ? odds : parseFloat(odds))
}
