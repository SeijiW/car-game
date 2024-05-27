class TestObject{
    constructor(){
        this.parentObject = null;
        this.transform;
        this.thing = 0;
    }
    Start(){
        this.transform = this.parentObject.GetComponent(Transform);
    }
    Update(){
        this.thing+=.05;
        /*this.transform.r = Math.cos(this.thing) * 30;*/
    }
}