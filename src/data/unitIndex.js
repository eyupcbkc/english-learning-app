// Central registry of all 64 units — A1 to C1 complete curriculum
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
import unit25 from './units/unit-25.json'
import unit26 from './units/unit-26.json'
import unit27 from './units/unit-27.json'
import unit28 from './units/unit-28.json'
import unit29 from './units/unit-29.json'
import unit30 from './units/unit-30.json'
import unit31 from './units/unit-31.json'
import unit32 from './units/unit-32.json'
import unit33 from './units/unit-33.json'
import unit34 from './units/unit-34.json'
import unit35 from './units/unit-35.json'
import unit36 from './units/unit-36.json'
import unit37 from './units/unit-37.json'
import unit38 from './units/unit-38.json'
import unit39 from './units/unit-39.json'
import unit40 from './units/unit-40.json'
import unit41 from './units/unit-41.json'
import unit42 from './units/unit-42.json'
import unit43 from './units/unit-43.json'
import unit44 from './units/unit-44.json'
import unit45 from './units/unit-45.json'
import unit46 from './units/unit-46.json'
import unit47 from './units/unit-47.json'
import unit48 from './units/unit-48.json'
import unit49 from './units/unit-49.json'
import unit50 from './units/unit-50.json'
import unit51 from './units/unit-51.json'
import unit52 from './units/unit-52.json'
import unit53 from './units/unit-53.json'
import unit54 from './units/unit-54.json'
import unit55 from './units/unit-55.json'
import unit56 from './units/unit-56.json'
import unit57 from './units/unit-57.json'
import unit58 from './units/unit-58.json'
import unit59 from './units/unit-59.json'
import unit60 from './units/unit-60.json'
import unit61 from './units/unit-61.json'
import unit62 from './units/unit-62.json'
import unit63 from './units/unit-63.json'
import unit64 from './units/unit-64.json'
import unit65 from './units/unit-65.json'

const units = [
  unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08,
  unit09, unit10, unit11, unit12, unit13, unit14, unit15, unit16,
  unit17, unit18, unit19, unit20, unit21, unit22, unit23, unit24,
  unit25, unit26, unit27, unit28, unit29, unit30, unit31, unit32,
  unit33, unit34, unit35, unit36, unit37, unit38, unit39, unit40,
  unit41, unit42, unit43, unit44, unit45, unit46, unit47, unit48,
  unit49, unit50, unit51, unit52, unit53, unit54, unit55, unit56,
  unit57, unit58, unit59, unit60, unit61, unit62, unit63, unit64,
  unit65,
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
