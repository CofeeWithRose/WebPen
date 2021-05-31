import { Color } from '../Color'
import { BrushInfer, BrushState } from './types/PenInfer'

export const defaultState: BrushState = {
    color: new Color(),
    width: 10
}

export class Pen implements BrushInfer {

    state = defaultState
   
}