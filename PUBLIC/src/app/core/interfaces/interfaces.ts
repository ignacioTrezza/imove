import { EventEmitter, Output } from "@angular/core";

import { Observable } from "rxjs";

export interface IObjectKeys {
    [key:string]:any;
}
export interface Iconsult {//extends IObjectKeys
    descripcion:string, 
    x:number, 
    y:number,  
    red:number, 
    blue:number, 
    green:number, 
    color: string, 
    xstring?: string, 
    ystring?: string,
    totaldif?: number
    seguir?:boolean
};

export interface IBasicConsult {//extends IObjectKeys
    x:number, 
    y:number,  
    red:number, 
    blue:number, 
    green:number, 
    xstring?: string, 
    ystring?: string,
    color?: string, 
    history?:[boolean, boolean, boolean, boolean, boolean]
};

export interface Ivinculado{
    x:number,
    y:number,
    index:number,
    descripcion?:string,
    diferencias?:Ivinculado[]    
}


export interface IListVinculado extends IObjectKeys{
    nombre: string,
    evento:IEventVinculado[],
    vinculados: Ivinculado[] 
}
export interface IEventVinculado{
    nombre: string;
    tipoEvent:number,
    data: IBasicConsult[]
}
export const enum IvincularComo {
    NADA = 0,
    SOLIDIFICAR = 1,
    OTRA = 2
}
export interface IGruposListVinculado {
    listas:IListVinculado[]
}
export interface IJoinPoint {
    x:number,
    y:number
}
export class vinculador {
    lineToObserve:IJoinPoint[]=[];
    lineObservedTrue:IBasicConsult[]=[];
    lineObservedFalse:IBasicConsult[]=[];
    lineObservedFireEvents:IBasicConsult[]=[];
    fireEvent:boolean = false;//TODO observable
    clickDown: boolean = false;
    clickUp: boolean = false;

    constructor(         
        aLine:IJoinPoint[],        
        ){
        this.lineToObserve = aLine;
        aLine.forEach(x=> {
            this.lineObservedTrue.push({x: x.x, xstring:'', y:x.y, ystring:'', red:-1, green:0, blue:0});
            this.lineObservedFalse.push({x: x.x, xstring:'', y:x.y, ystring:'', red:-1, green:0, blue:0})
        })     
        const fireEventObs$ = new Observable(observer =>{
            
        })   
        }
    // private getLineObservedtrue(baseLine:IJoinPoint[]){
    // }
    public getlineToObserve():IJoinPoint[]{
        return [...this.lineToObserve];
    }
    public getlineObservedTrue():IBasicConsult[]{
        return [...this.lineObservedTrue]
    }
    public getlineObservedFalse():IBasicConsult[]{
        return [...this.lineObservedFalse]
    }
    public updateObservation(array: Iconsult[]) {
        console.log('now is observing', array, this.lineObservedFireEvents)

        array.map((x, index)=>{if({...this.lineObservedFireEvents[index]}.red > x.red ){
            this.lineObservedFireEvents[index].history?.unshift(true);
           
        }else{
            this.lineObservedFireEvents[index].history?.unshift(false)            
        } 
        return this.doTheThing();
        // if(this.lineObservedFireEvents[index].history?.length || 1 >20){
        //     this.lineObservedFireEvents[index -1].history?.pop()
        // }        
        })

    }
    private doTheThing():number{
        if(this.clickDown==true){
            this.lineObservedFireEvents.forEach((x, index) =>{if(x.history? x.history[0] == true:false){return 0}else{
                this.clickDown = false;
                this.clickUp = true;
                return -1
            }})
        }else if(this.clickUp==true){
            this.lineObservedFireEvents.forEach((x, index) =>{if(x.history? x.history[0] == false:false){return 0}else{
                this.clickUp = false;
                this.clickDown = true;
                return 1
            }})
        }
        return 0;    
    }
    public setTrueState(array: Iconsult[]){
        this.lineObservedTrue = [...array];
        if(this.lineObservedFalse[0].red > 0){
            if(this.lineObservedFalse[0].red < this.lineObservedTrue[0].red){
                array.map((x, index)=> this.lineObservedFireEvents.push({...x,history:[false, false, false, false, false],red:(
                    (x.red - this.lineObservedFalse[index].red)/2 + this.lineObservedFalse[index].red)
                } ) )
            }else{
                array.map((x, index)=> this.lineObservedFireEvents.push({...x,history:[false, false, false, false, false],red:(
                    (this.lineObservedFalse[index].red - x.red)/2 + x.red)
                } ) )
            }           
        }
        console.log('this.lineObservedTrue', this.lineObservedTrue, this.lineObservedFireEvents)
    }
    public setFalseState(array: Iconsult[]){
        this.lineObservedFalse = [...array];
        if(this.lineObservedTrue[0].red > 0){
            if(this.lineObservedFalse[0].red < this.lineObservedTrue[0].red){
            array.map((x, index)=> this.lineObservedFireEvents.push(
                {...x,history:[false, false, false, false, false],red:(
                    (x.red - this.lineObservedTrue[index].red)/2 + this.lineObservedTrue[index].red)
                }) )
            }else{  array.map((x, index)=> this.lineObservedFireEvents.push(
                {...x,history:[false, false, false, false, false],red:(
                    (this.lineObservedTrue[index].red - x.red)/2 + x.red)
                }) )
                
            }
        }
        console.log('this.lineObservedFalse', this.lineObservedFalse, this.lineObservedFireEvents)
    }
    public toogleFireEvent(){
        // console.log("logintoogleEvent", this.fireEvent)
        return this.fireEvent = !this.fireEvent;
    }
    public getFireState(){
        return this.fireEvent;
    }
}