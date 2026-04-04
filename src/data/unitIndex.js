// Central registry of all units - add new units here
import unit01 from './units/unit-01.json'
import unit02 from './units/unit-02.json'
import unit03 from './units/unit-03.json'
import unit04 from './units/unit-04.json'
import unit05 from './units/unit-05.json'
import unit06 from './units/unit-06.json'
import unit07 from './units/unit-07.json'
import unit08 from './units/unit-08.json'
import unit09 from './units/unit-09.json'
import unit10 from './units/unit-10.json'
import unit11 from './units/unit-11.json'
import unit12 from './units/unit-12.json'
import unit13 from './units/unit-13.json'
import unit14 from './units/unit-14.json'
import unit15 from './units/unit-15.json'
import unit16 from './units/unit-16.json'
import unit17 from './units/unit-17.json'
import unit18 from './units/unit-18.json'
import unit19 from './units/unit-19.json'
import unit20 from './units/unit-20.json'
import unit21 from './units/unit-21.json'
import unit22 from './units/unit-22.json'
import unit23 from './units/unit-23.json'
import unit24 from './units/unit-24.json'

const units = [
  unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08,
  unit09, unit10, unit11, unit12, unit13, unit14, unit15, unit16,
  unit17, unit18, unit19, unit20, unit21, unit22, unit23, unit24,
]

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
