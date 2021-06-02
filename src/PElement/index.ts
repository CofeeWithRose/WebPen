import { BrushEl } from "./BrushEl";
import { LayerEl } from "./LayerEl";
import { PannelEl } from "./PannelEl";
import { EL_TAGS, PElement, ElConstructor } from "./PElement";


export  function createEmpty(w: number, h: number) {
  const root = new PannelEl()
  root.width = w
  root.height = h
  root.addChild(new LayerEl())
  return root
}

export function stringifyEl(pannelEl: PannelEl|null) {
  return pannelEl? JSON.stringify(pannelEl) : ''
}


type EL_MAP = { [ index in EL_TAGS]: ElConstructor }

export function parseEl(pannelElStr?: string): PannelEl| null {
  if (!pannelElStr) return null
  const elMap: EL_MAP = {
    [EL_TAGS.PANNEL]: PannelEl,
    [EL_TAGS.LAYER]: LayerEl,
    [EL_TAGS.BRUSH]:BrushEl,
  }
  const vPannelEl: PannelEl = JSON.parse(pannelElStr)
 
  return copy(vPannelEl, elMap)
}

function copy<T extends PElement<any>>(vEl: T, elMap: EL_MAP): T {

    const el = new elMap[vEl.tag]() as T
    for(let key in vEl) {
      if (key !== 'children') {
        el[key] = vEl[key]
      }
    }
    vEl.children.forEach( vEl => {
      el.addChild( copy(vEl, elMap))
    })
    return el

}

// function buildEl(current: PElement<PElement<any>>, vEl: PElement<PElement<any>>, elMap: EL_MAP, ) {
  // for(let key in vEl) {
  //   current[key] = vEl[key]
  // }
//   current.children = []

//   vEl.children.forEach( vEl => {
//     const el = new elMap[vEl.tag]()
//     buildEl(el, vEl, elMap)
//     current.addChild(el)
//   })
// }