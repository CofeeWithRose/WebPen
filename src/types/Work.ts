import { Action, ActionType } from "./Actions";

export interface Work {
    /**
     * 作品名称.
     */
    name: string

    createTime: number

    updateTime: number

    size: { w: number, h: number }

    actionRecords: Action<ActionType>[]

}











