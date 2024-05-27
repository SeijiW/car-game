class Object{
    constructor(name, components, tag1, tag2, tag3){
        this.name = name
        this.tag1 = tag1
        this.tag2 = tag2
        this.tag3 = tag3
        this.components = components
        this.order;
    }
    AddComponent(component, doUnshift){
        //this method is untested so it could cause errors
        if(doUnshift){
            this.components.unshift(component);
        }
        else this.components.push(component);
        if(typeof component.parentObject != undefined){component.parentObject = this;}
        return component;
    }
    RemoveComponent(className){
        //this method is untested so it could cause errors
        for(let i = 0; i < this.components.length; i++){
            if(this.components[i] instanceof className){
                this.components.splice(i, 1);
            }
        }
    }
    GetComponent(className){
        for(let i = 0; i < this.components.length; i++){
            if(this.components[i] instanceof className) return this.components[i];
        }
        return undefined
    }
    Start(){
        for(let i = 0; i < this.components.length; i++){
            if(typeof this.components[i].Start != "undefined"){
                if(typeof this.components[i].parentObject != undefined){this.components[i].parentObject = this;}
                this.components[i].Start();
            }
        }
    }
    EarlyUpdate(){
        for(let i = 0; i < this.components.length; i++){
            if(typeof this.components[i].EarlyUpdate != "undefined"){
                this.components[i].EarlyUpdate();
            }
        }
    }
    Update(){
        for(let i = 0; i < this.components.length; i++){
            if(typeof this.components[i].Update != "undefined"){
                this.components[i].Update();
            }
        }
    }
    LateUpdate(){
        for(let i = 0; i < this.components.length; i++){
            if(typeof this.components[i].LateUpdate != "undefined"){
                this.components[i].LateUpdate();
            }
        }
    }
    LaterUpdate(){
        for(let i = 0; i < this.components.length; i++){
            if(typeof this.components[i].LaterUpdate != "undefined"){
                this.components[i].LaterUpdate();
            }
        }
    }
    RenderUpdate(){
        for(let i = 0; i < this.components.length; i++){
            if(!this.components[i].renderInPost && typeof this.components[i].RenderUpdate != "undefined"){
                this.components[i].RenderUpdate();
            }
        }
    }
    PostRenderUpdate(){
        for(let i = 0; i < this.components.length; i++){
            if(typeof this.components[i].PostRenderUpdate != "undefined"){
                this.components[i].PostRenderUpdate();
            }
            else if(this.components[i].renderInPost){
                this.components[i].RenderUpdate();
            }
        }
    }
}