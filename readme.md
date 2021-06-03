 
 
painting in broswer, support  pen with pressure.

Plan

> draw, complete.

> save/recover, complete.

> redo/undo,  complete.

> layer, todo.

> eraser, todo.

> select area and move, todo.

> useage doc, todo.

> arch doc, todo.



issue
> renderEngin init canvas should by pannelEL size.
> pointerstart event lost on ipad.
> composite layer with drawImage is slow on ipad, change another way to implement composite or reduce composite operate?

Doc


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


