import type { PenPannel } from "./types/PenPannel";

export type { PenConstructor, PenInfer } from './Pen/types/PenInfer'
export type { PenPannel };

export { Pen } from './Pen/Pen'

export function create(container: HTMLElement): PenPannel {

    return {} as PenPannel
}