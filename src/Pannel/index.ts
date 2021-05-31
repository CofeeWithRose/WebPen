import { Pannel } from "./Pannel";
import { PannelInfer, PannelOptions } from "./types/PannelInfer";



export function createPannel( container:HTMLElement, opt?: PannelOptions ): PannelInfer {
    return new Pannel(container, opt)
}