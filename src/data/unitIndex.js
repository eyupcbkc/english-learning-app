// Central registry of all units - add new units here
import unit01 from './units/unit-01.json'

const units = [unit01]

export default units

export function getUnit(id) {
  return units.find(u => u.id === id)
}

export function getUnitsByModule(moduleNum) {
  return units.filter(u => u.module === moduleNum)
}

export function getUnitsByLevel(level) {
  return units.filter(u => u.level === level)
}
