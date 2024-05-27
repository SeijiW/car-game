class CameraController{
    constructor(speed, zoom){
        this.speed = speed
        this.transform;
        this.parentObject = null;
        this.startZoom = zoom;
        if(zoom == undefined) this.startZoom = 1;
        this.playerTransform;
        this.camScaleSpeed = .05
        this.camRotSpeed = 5
        this.f = 0
    }
    Start(){
        this.transform = this.parentObject.GetComponent(Transform);
        this.transform.sx = this.startZoom;
        this.playerTransform = player.GetComponent(Transform);
    }
    LateUpdate(){
        this.transform.x+= ((this.speed * Input.HorizontalWASD * Math.cos(degToRad(this.transform.r))) + (this.speed * Input.VerticalWASD * Math.cos(degToRad(this.transform.r + 90)))) / this.transform.sx
        this.transform.y+= ((this.speed * Input.HorizontalWASD * Math.sin(degToRad(this.transform.r))) + (this.speed * Input.VerticalWASD * Math.sin(degToRad(this.transform.r + 90)))) / this.transform.sx
        if(Input.GetKey('space')){
            this.transform.r = this.playerTransform.r;
            this.transform.x = this.playerTransform.x + (2*Math.cos(degToRad(this.transform.r + 90)));
            this.transform.y = this.playerTransform.y + (2*Math.sin(degToRad(this.transform.r + 90)));
        }
        if(Input.GetKey("-")){
            this.transform.sx-= this.camScaleSpeed * this.transform.sx
        }
        if(Input.GetKey("=")){
            this.transform.sx+= this.camScaleSpeed * this.transform.sx
        }
        if(Input.GetKey("3")){
            this.transform.r-= this.camRotSpeed;
        }
        if(Input.GetKey("4")){
            this.transform.r+= this.camRotSpeed;
        }
        this.transform.sy = this.transform.sx;
        this.f++;
    }
}