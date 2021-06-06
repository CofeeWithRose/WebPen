 
 
painting in broswer, support  pen with pressure.




### 功能列表

> 画板

>> 平移

>> 缩放


> 笔刷.

>> 支持压感.

>> 支持轨迹平滑.

>> 忽略touch.

>> 笔刷宽度限制在-20% ~ 20%.

>> 橡皮擦.

>> 支持touch模拟压感.

>> 支持侧峰， 转笔.


> 图层

>> 添加

>> 删除

>> 移动


> 颜色

>> 调色盘， 色相环+明度、饱和度三角.

>> 吸色.



> 导出\导出

>> 导入序列化string.

>> 导出序列化string.

>> 导出JPG.


> 操作记录

>> undo

>> redo





> save/recover, complete.

> redo/undo,  complete.

> layer, todo.

> eraser, todo.

> select area and move, todo.

> demo, todo.

> arch doc, todo.



### Issue
> ipad笔刷"漏墨"问题.
> renderEngin init canvas should by pannelEL size.

> composite layer with drawImage is slow on ipad, change another way to implement composite or reduce composite operate?


### Demo

basic.js
````
    import { createPannel, PannelInfer } from 'webpen';

    // create pannel.
    const pannel =  createPannel (
        document.querySelector('#container'), 
        {
            width: 800, 
            height: 800,
        }
    )

    // load.
    pannel.load()

````


