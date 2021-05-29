import { DrawActionData } from "./DrawActionData";

export interface ActionData {

    draw:  DrawActionData
}

export type ActionType = keyof ActionData


export interface Action<T extends ActionType> {

    /**
     * 操作类型.
     */
    type: T
    
    /**
     * 操作数据.
     */
    data: ActionData[T]
}