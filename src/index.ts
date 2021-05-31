import type { Pannel } from "./Pannel/types/PannelInfer";

export type { PenConstructor, PenInfer } from './Pen/types/PenInfer'
export type { Pannel as PenPannel };

export { Pen } from './Pen/Pen'


export function create(container: HTMLElement): Pannel {

    return {} as Pannel
}