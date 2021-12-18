export default function getCambio(value, ask) {
  const roundValue = Math.round((value * ask) * 100) / 100;
  return roundValue;
}
