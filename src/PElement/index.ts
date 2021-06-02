import { BrushEl } from "./BrushEl";
import { LayerEl } from "./LayerEl";
import { PannelEl } from "./PannelEl";
import { EL_TAGS, PElement, ElConstructor } from "./PElement";


export  function createEmpty() {
  const root = new PannelEl()
  root.addChild(new LayerEl())
  return root
}

export function stringifyEl(pannelEl: PannelEl|null) {
  return pannelEl? JSON.stringify(pannelEl) : ''
}


type EL_MAP = { [ index in EL_TAGS]: ElConstructor }

export function parseEl(pannelElStr?: string): PannelEl {
  if (!pannelElStr) return createEmpty()
  const elMap: EL_MAP = {
    [EL_TAGS.PANNEL]: PannelEl,
    [EL_TAGS.LAYER]: LayerEl,
    [EL_TAGS.BRUSH]:BrushEl,
  }
  const vPannelEl: PannelEl = JSON.parse(pannelElStr)
  setProptype(vPannelEl, elMap)
  return vPannelEl
}

function setProptype(vEl: PElement<PElement<any>>, elMap: EL_MAP) {
  Object.setPrototypeOf(vEl,  elMap[vEl.tag].prototype)
  vEl.getChildren().forEach( el => setProptype(el, elMap))
}