import { Color } from '../types/Color'
import { PenInfer, PenStateInfer } from './types/PenInfer'

export const defaultState: PenStateInfer = {
    color: new Color(),
    width: 10
}

export class Pen implements PenInfer {

    state = defaultState
   
}