export default function deepCloneBond(_object) {
  const _clone = JSON.parse(JSON.stringify(_object))
  if (_clone.startingDate) {
    _clone.startingDate = new Date(_clone.startingDate)
  } else if (_clone.bond.startingDate) {
    _clone.bond.startingDate = new Date(_clone.bond.startingDate)
  }
  return _clone
}
