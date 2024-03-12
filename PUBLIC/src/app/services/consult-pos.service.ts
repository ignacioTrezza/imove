import { Injectable } from '@angular/core';
import { IGruposListVinculado, IJoinPoint, IListVinculado, Iconsult, Ivinculado, vinculador} from '../core/interfaces/interfaces';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConsultPosService {

vincu:any;
toConsult: Iconsult[] =[];
aLine: IJoinPoint[] = [];
aLines= [];
contentImage!: CanvasRenderingContext2D;
listaVinculados: IListVinculado = {
  nombre: 'Primera', 
  evento:[],
  vinculados: []
};
gruposListaVinculados!:IListVinculado[];

  constructor() { 
    this.toConsult.push({descripcion:'AAA', x:5, y:5, red:0, blue:0, green:0, color:'rgb(0,0,0)', xstring: `${0}px`,ystring: `${0}px`,totaldif:0, seguir:false});
    this.gruposListaVinculados = [{...this.listaVinculados}]
   
    // fireEventObs$.subscribe()
  }

  public findIndToConsultDesc(descripcion:string):number{
    return this.toConsult.findIndex(x=>x.descripcion === descripcion)
  }
  private findIndVinculadoDesc(descripcion: string, indTabla:number):number{      
  return this.gruposListaVinculados[indTabla].vinculados?.findIndex((x:Ivinculado) =>(x.descripcion === descripcion))|| -1;
  } 

  public vincularA(aVincular:Iconsult,vincularCon:Iconsult, vincularEn:number ){
    console.log("vincular:", aVincular, vincularCon, vincularEn)

    const aVincularlo = this.toConsult[this.findIndToConsultDesc(aVincular.descripcion)]
    if(this.findIndVinculadoDesc(aVincularlo.descripcion, vincularEn)== -1){
      this.gruposListaVinculados[vincularEn].vinculados?.push({x:aVincularlo.x, y: aVincularlo.y, index: this.gruposListaVinculados[vincularEn].vinculados?.length || 0, descripcion: aVincularlo.descripcion})
    }
    if(this.gruposListaVinculados[vincularEn].vinculados?.findIndex((x:Ivinculado) =>(x.descripcion === vincularCon.descripcion)) == -1){
      this.gruposListaVinculados[vincularEn].vinculados?.push({x:vincularCon.x, y: vincularCon.y, index: this.gruposListaVinculados[vincularEn].vinculados?.length || 0, descripcion: vincularCon.descripcion})
    }
    // console.log("listaVinculados:",this.listaVinculados.vinculados)
  }

  public seguirExtra(consulta:Iconsult):Iconsult[]{
    let extraArray:Iconsult[] = [
      {...consulta,descripcion: `${consulta.descripcion}1`, x:{...consulta}.x, y:{...consulta}.y,totaldif:0},
      {...consulta,descripcion: `${consulta.descripcion}2`, x:{...consulta}.x, y:{...consulta}.y+2,totaldif:0},
      {...consulta,descripcion: `${consulta.descripcion}3`, x:{...consulta}.x, y:{...consulta}.y-2,totaldif:0},
      {...consulta,descripcion: `${consulta.descripcion}4`, x:{...consulta}.x+2, y:{...consulta}.y+2,totaldif:0},
      {...consulta,descripcion: `${consulta.descripcion}5`, x:{...consulta}.x+2, y:{...consulta}.y,totaldif:0},
      {...consulta,descripcion: `${consulta.descripcion}6`, x:{...consulta}.x+2, y:{...consulta}.y-2,totaldif:0},
      {...consulta,descripcion: `${consulta.descripcion}7`, x:{...consulta}.x-2, y:{...consulta}.y+2,totaldif:0},
      {...consulta,descripcion: `${consulta.descripcion}8`, x:{...consulta}.x-2, y:{...consulta}.y,totaldif:0},
      {...consulta,descripcion: `${consulta.descripcion}9`, x:{...consulta}.x-2, y:{...consulta}.y-2,totaldif:0}
    ]
    const searchFor = this.toConsult.find(c=>c.descripcion === consulta.descripcion)  
    extraArray.map((x:Iconsult) =>{
    //TODO: Validacion si es > o < distinto que el del centro
      x.red = this.contentImage.getImageData(x.x, x.y, 1, 1).data[0] - searchFor!.red,
      x.green = this.contentImage.getImageData(x.x, x.y, 1, 1).data[1]- searchFor!.green,
      x.blue = this.contentImage.getImageData(x.x, x.y, 1, 1).data[2]- searchFor!.blue,            
      x.color =  `rgb(${x.red}, ${x.green}, ${x.blue})`
    })
    extraArray.map(x=>x.totaldif=(x.red>=0?x.red:x.red*(-1) ) + (x.green>=0?x.green:x.green*(-1) ) + (x.blue>=0?x.blue:x.blue*(-1)))
    const consultaToUpdate = extraArray.sort((a,b) => a.totaldif! - (b.totaldif!))[1];
    this.gruposListaVinculados.map((x:IListVinculado)=>{x.vinculados?.map(x=> x.descripcion == consulta.descripcion)})
    
    this.updateConsulta({...consulta,x:consultaToUpdate.x, y:consultaToUpdate.y,xstring:`${consultaToUpdate.x}px`, ystring:`${consultaToUpdate.x}px`, seguir:true})
    let setPosOver = [consulta.x - consultaToUpdate.x,consulta.y - consultaToUpdate.y]
    let indexConsulta = this.getIndexConsultatoConsultPorDesc(consulta.descripcion)
    let indexes: number[] = [];
    this.gruposListaVinculados.map(x=>{if(x.vinculados?.map(v=>{v.descripcion == this.toConsult[indexConsulta || 0].descripcion?true:false})){x.vinculados.forEach(vinculado =>indexes.push(this.toConsult.findIndex(name => name.descripcion == vinculado.descripcion)))}});
    indexes.map(x=>{if(x!=indexConsulta){
      this.toConsult[x].x = {...this.toConsult[x]}.x+ (setPosOver[0]),
      this.toConsult[x].xstring = `${{...this.toConsult[x]}.x+ (setPosOver[0])}px`,
      this.toConsult[x].y = {...this.toConsult[x]}.y + (setPosOver[1]),
      this.toConsult[x].ystring = `${{...this.toConsult[x]}.y + (setPosOver[1])}px`     
      }
    }) 
    return this.updateConsulta({...consulta,x:consultaToUpdate.x, y:consultaToUpdate.y,xstring:`${consultaToUpdate.x}px`, ystring:`${consultaToUpdate.x}px`, seguir:true})
  }

  public solidificar(lista:IListVinculado){
    if(lista.vinculados){
      const modified = [];
      [...lista.vinculados].map((x, index)=>{x = {...x, diferencias: lista.vinculados}});//.forEach(xx=>{xx.x = xx.x-x.x, xx.y = xx.y-x.y})
      [...lista.vinculados].map((vinculado:Ivinculado)=>{
      [...this.toConsult].map((consult:Iconsult, index)=>{
        if(consult.descripcion==vinculado.descripcion){
          vinculado.diferencias?vinculado.diferencias.forEach(x=>{consult.x =consult.x - x.x ,consult.y = consult.y - x.y}):false
        }
        })      
      }
      )
    }
  }
  public soloUnir(lista:IListVinculado){
    // this.gruposListaVinculados[this.getIndexLista(lista)]

    lista.vinculados.forEach((x:Ivinculado) =>{
      const toPush = {
      x:this.toConsult[this.findIndToConsultDesc(x.descripcion?x.descripcion:'')].x,
      y: this.toConsult[this.findIndToConsultDesc(x.descripcion?x.descripcion:'')].y,
      red: this.toConsult[this.findIndToConsultDesc(x.descripcion?x.descripcion:'')].red,
      green: this.toConsult[this.findIndToConsultDesc(x.descripcion?x.descripcion:'')].green,
      blue:this.toConsult[this.findIndToConsultDesc(x.descripcion?x.descripcion:'')].blue
    }
     this.gruposListaVinculados[this.getIndexLista(lista)].evento[0].data.push({...toPush}) 
     this.gruposListaVinculados[this.getIndexLista(lista)].vinculados = [];
    })
    console.log('Vinculado-SOLO UNIR', this.gruposListaVinculados[this.getIndexLista(lista)])     
     }
      
  

  public pushConsult(consulta: Iconsult):Iconsult[]{
    this.toConsult.push({...consulta}) //{...consulta, xstring:`${consulta.x}px`, ystring:`${consulta.y}px`}
  return this.toConsult;
  }

  public addListaGrupo(){
    return this.gruposListaVinculados = [...this.gruposListaVinculados,{...this.gruposListaVinculados[0], nombre:`otra${this.gruposListaVinculados.length}`, vinculados:[]}]
  }

  public removeVinculadoDeListGroup(indexLista:number,indexVinculado:number){
  const vinc: Ivinculado[] =[];
  this.gruposListaVinculados[indexLista].vinculados.forEach((x,index)=>{
    if(index !=indexVinculado){vinc.push(x)}
    })
  this.gruposListaVinculados[indexLista].vinculados = [...vinc];
  }

  public deleteConsultIndex(descripcion:string):Iconsult[]{
    const result: Iconsult[] = [];
    [...this.toConsult].map((x:Iconsult) => {if(x.descripcion!==descripcion){result.push(x)}})
      this.toConsult = result
      return this.toConsult
  }

  public clearVinculadosFromListGroup (indexLista:number){
    this.gruposListaVinculados[indexLista] = {...this.gruposListaVinculados[indexLista],vinculados:[]}  
  } 

  public clearListaFromListGroup(indexLista:number){
    const nuevaListaGrupoVinculo: IListVinculado[] = [];
    this.gruposListaVinculados.forEach((x,index)=>{index!==indexLista; nuevaListaGrupoVinculo.push(x)})
    this.gruposListaVinculados = [...nuevaListaGrupoVinculo];
  }

  public getConsults(){
    return this.toConsult
  }
  private getIndexConsultatoConsultPorDesc(desc:string){
    return this.toConsult.findIndex(x=> x.descripcion == desc)
  }

  public getConsultxDesc(descripcion:string):Iconsult | undefined{
    const result = this.toConsult.find((x:Iconsult) => {x.descripcion===descripcion})
    if(result){
      return result
    }else{
      return undefined;
    }    
  }
  private getIndexLista(lista:IListVinculado):number{
  return  this.gruposListaVinculados.findIndex(x=>{x.nombre == lista.nombre}) 
  }

  public updateGruposListaVinculados(inde:number,lista:Ivinculado[]){
    this.gruposListaVinculados[inde].vinculados = lista ;
    console.log('desvincular', lista,this.gruposListaVinculados[inde]);
  }

  public updateConsultas(consultas:Iconsult[]):Iconsult[]{ 
    this.toConsult = consultas;
    return this.toConsult 
  }

  public updateConsulta(consulta:Iconsult):Iconsult[]{
    const newToConsult: Iconsult[] =[];
    [...this.toConsult].map((x:Iconsult)=>{ x.descripcion === consulta.descripcion?x={...x,x:consulta.x, y:consulta.y,xstring:`${consulta.x}px`, ystring:`${consulta.y}px`, seguir:consulta.seguir } : x;
    newToConsult.push(x)
    }) ;
    this.toConsult= [...newToConsult];
      return this.toConsult  
  }
  
public makeLine (xi:number, yi:number,xf:number, yf:number):IJoinPoint[]{
  if(!this.vincu){
  if(this.aLine.length>0){
    this.aLine = [{x:xi, y:yi}]  
  }
  else{
    let indX:number = 0
    let indY:number = 0 
    let difY = yf - yi;
    let difX = xf - xi;  
    let pendiente: number =  difX/difY; 
    do{     
      if(pendiente>0){//(x++,y++) || (x--,y--)
        if(pendiente>1){//DeltaX > DeltaY
          difX>0?indX++:indX--;
          indX % Math.round(pendiente) == 0? difY>0?indY++:indY--:indY;  
        }else{//DeltaY > DeltaX
          difY<0?indY++:indY--;
          indY % Math.round(difY/difX) == 0? difX>0?indX++:indX--:indX;  
        }       
      }else {//(x++,y--) || (x--,y++)
        if(pendiente<-1){//DeltaX > DeltaY 
          difX>0?indX++:indX--;
          indX % Math.round(-pendiente) == 0? difY>0?indY++:indY--:indY;            
        }else{//DeltaY > DeltaX 
          difY>0?indY++:indY--;
          indY % Math.round(-difY/difX) == 0? difX>0?indX++:indX--:indX; 
        }       
      }
      this.aLine.push({x:xi + indX,y:yi + indY})// indy+ 
    }while((this.aLine[this.aLine.length-1].x != xf || undefined) && this.aLine[this.aLine.length-1].y != yf);    //indX < difX || indY < difY
    console.log('aline', this.aLine) 
  }
this.aLines.push()
this.vincu = new vinculador(this.aLine) 
}

  return this.aLine
}
public setTrueStateVinculado(){
  this.vincu.setTrueState( this.mapThis(this.vincu.getlineObservedTrue()) )
}
public setFalseStateVinculado(){
  this.vincu.setFalseState( this.mapThis(this.vincu.getlineObservedFalse()) )
}
public toogleObservation(){
  // console.log('updateObservation',this.mapThis(this.vincu.getlineToObserve()))
this.vincu.toogleFireEvent();
}
public getVincu(){
  return {...this.vincu};
}
  public updateContext(content:CanvasRenderingContext2D){
    this.contentImage = content;
    let vincFunc:IListVinculado[] = [];
    [...this.gruposListaVinculados].forEach((lista:IListVinculado, index)=>{lista.vinculados?lista.vinculados.length>0:false,vincFunc.push(lista)});
    if(vincFunc[0].vinculados.length>0){
      this.makeLine(
      vincFunc[0].vinculados[0].x,
      vincFunc[0].vinculados[0].y,
      vincFunc[0].vinculados[1].x,
      vincFunc[0].vinculados[1].y
      )
    }    
    if(this.vincu? this.vincu.getFireState():false){const eventClick = this.vincu.updateObservation( this.mapThis(this.vincu.getlineToObserve()) ); if(eventClick!==0){this.fireEvent(eventClick)}}  
    [...this.toConsult].map((x:Iconsult) =>{if(x.seguir==true) this.seguirExtra(x);
      x.red = this.contentImage.getImageData(x.x, x.y, 1, 1).data[0],
      x.green = this.contentImage.getImageData(x.x, x.y, 1, 1).data[1],
      x.blue = this.contentImage.getImageData(x.x, x.y, 1, 1).data[2],            
      x.color =  `rgb(${x.red}, ${x.green}, ${x.blue})`
      x.xstring = `${x.x}px`,
      x.ystring = `${x.y}px`
    })

    // console.log('ImageData',this.contentImage.getImageData(200, 200, 1,1))
  }

  public mapThis(array:any[]):any[]{
    // console.log('arrayMap', array)
    [...array].map(x =>{
      x.red = this.contentImage.getImageData(x.x, x.y, 1, 1).data[0],
      x.green = this.contentImage.getImageData(x.x, x.y, 1, 1).data[1],
      x.blue = this.contentImage.getImageData(x.x, x.y, 1, 1).data[2],            
      x.color =  `rgb(${x.red}, ${x.green}, ${x.blue})`
      x.xstring = `${x.x}px`,
      x.ystring = `${x.y}px`
    })
    return array;
  }
  private fireEvent(eventType: number){

  }
}
