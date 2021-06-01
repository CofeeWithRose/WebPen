export class Color {

   /**
         * 0~255
         */
    public readonly r: number

    /**
     * 0~255
     */
    public readonly g: number
    
    /**
     * 0~255
     */
    public readonly b: number
    
    /**
     * 0~1
     */
    public readonly a: number

    constructor(
        /**
         * 0~255
         */
        r: number = 0,

        /**
         * 0~255
         */
        g: number =0,
        
        /**
         * 0~255
         */
        b: number =0,
        
        /**
         * 0~1
         */
        a: number = 1,
    ){
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
}