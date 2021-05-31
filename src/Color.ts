export class Color {

    constructor(
        /**
         * 0~255
         */
        public readonly r: number =0,

        /**
         * 0~255
         */
        public readonly g: number =0,
        
        /**
         * 0~255
         */
        public readonly b: number =0,
        
        /**
         * 0~1
         */
        public readonly a: number = 1,
    ){}
}