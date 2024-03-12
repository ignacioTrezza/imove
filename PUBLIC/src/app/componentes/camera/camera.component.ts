import { Component, HostListener ,OnDestroy, PLATFORM_ID, Inject, ViewChild, ElementRef, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Iconsult } from '../../core/interfaces/interfaces';
import { ConsultPosService } from '../../services/consult-pos.service';
// import { ConsultPosService } from 'src/app/services/consult-pos.service';
// import { Iconsult, IvincularComo } from 'src/app/core/interfaces';
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})

export class CameraComponent implements OnInit, OnDestroy, AfterViewInit {
  aConsultar!:Iconsult[];
  pixelColorArray: any[]=[0,0,0,0];
  toConsultPos!: [Iconsult] ;
  lastOver:number | undefined;
  event!:MouseEvent ;
  setPosOver!: number[] | [0,0];
  size: string = '100px';
  @ViewChild('video', { static: true })
  video!: ElementRef<HTMLVideoElement>;
  mouseX: number = 0;
  mouseY: number = 0;
  @ViewChild('mask', { static: true })
  mask!: ElementRef;
  showInfo:boolean[] = [false, false, false, false, false];
  colorPix: string = 'red';
  colorPixMask: string = 'blue';
  colorPosX:number=50;
  colorPosXMask:number=50;
  colorPosXstring:string= `${this.colorPosX}px`;
  colorPosY:number=50;
  colorPosYMask:number=50;
  colorPosYstring:string= `${0}px`;
  activate:boolean = true;
  colorPosXstringMask:string= `${this.colorPosX}px`;
  colorPosYstringMask:string= `${0}px`;
  private destroy$ = new Subject<void>();
  vincularComoOp = ['NADA','SOLIDIFICAR','OTRA'];
  selected:any;
  opcionesLista = ['+', '-', 'c'];
  

  constructor(@Inject(PLATFORM_ID) private _platform: Object,
  public _consult: ConsultPosService) { 
   
    // this.renderer.
  }

  ngOnInit() {
    console.log(navigator);
    this.selected = [0,0,0,0]//indexGrupolista,
  }

  onStart() {
    if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((ms: MediaStream) => {
        const _video = this.video.nativeElement;
        _video.srcObject = ms;
        _video.play();
        _video.className = 'body';
        this.captureFrameContinuously();
      });
    }
    this._consult.pushConsult({
      descripcion: 'ACA', x: 30, y: 30,
      red: 0,
      blue: 0,
      green: 0,
      color: '',
      xstring:'',
      ystring: '',
      totaldif: 0,
      seguir:false
    })
    this._consult.pushConsult({
      descripcion: 'AAC', x: 300, y: 300,
      red: 0,
      blue: 0,
      green: 0,
      color: '',
      xstring:'',
      ystring: '',
      totaldif: 0,
      seguir:false
    })
    this.aConsultar = this._consult.getConsults()
  }

  ngAfterViewInit(): void {
    // console.log('this.consult', this._consult.getConsults())
    // this.aConsultar = this._consult.getConsults()
  }

  onStop() {
    this.video.nativeElement.pause();
    (this.video.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
    this.video.nativeElement.srcObject = null;
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    (this.video.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
  }

  captureFrame() {
    const _video = this.video.nativeElement;

    
    createImageBitmap(_video)
      .then((imageBitmap) => {
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const context = canvas.getContext('2d',{willReadFrequently:true});

        if (context) {
          context.drawImage(imageBitmap, 0, 0);   
          this._consult.updateContext(context);  
          this.aConsultar = [...this._consult.getConsults()];
          const toFollow = this.aConsultar.findIndex(x=>x.seguir==true)
          if(toFollow>0){            
          this._consult.seguirExtra(this.aConsultar[toFollow])
          // console.log('this.aConsultar',this.aConsultar)
        }         
        }
      })
      .catch((error) => {
        console.error('Error capturing frame:', error);
      });
  }

  captureFrameContinuously() {
    interval(100) // Emits a value every 1 second, adjust the interval as needed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.captureFrame();
      });
  }
  setPos(event:MouseEvent){
    this.event=event;

    this.setPosOver =[this.event.offsetX - this.aConsultar[this.lastOver || 0].x, this.event.offsetY - this.aConsultar[this.lastOver || 0].y];
    this.aConsultar[this.lastOver || 0].x = event.offsetX;
    this.aConsultar[this.lastOver || 0].y = event.offsetY;
    this.updateConsulta(this.event)
    // console.log('getPosss',event, this._consult.getConsults(), this.aConsultar[this.lastOver || 0])
  }
  public updateConsulta(evento:MouseEvent){  
    this.updatingConsulta(evento.offsetX, evento.offsetY)
  }
public updatingConsulta(x:number, y:number){
  this.aConsultar[this.lastOver || 0].x=x;
  this.aConsultar[this.lastOver || 0].xstring=`${x}px`;
  this.aConsultar[this.lastOver || 0].y=y
  this.aConsultar[this.lastOver || 0].ystring=`${y}px`;
  let indexes: number[] = [];
  this._consult.gruposListaVinculados.map(x=>{if(x.vinculados?.map(v=>{v.descripcion == this.aConsultar[this.lastOver || 0].descripcion?true:false})){x.vinculados.forEach(vinculado =>indexes.push(this.aConsultar.findIndex(name => name.descripcion == vinculado.descripcion)))}});
  indexes.map(x=>{if(x!=this.lastOver){
    this.aConsultar[x].x = {...this.aConsultar[x]}.x+ (this.setPosOver[0]),
    this.aConsultar[x].xstring = `${{...this.aConsultar[x]}.x+ (this.setPosOver[0])}px`,
    this.aConsultar[x].y = {...this.aConsultar[x]}.y + (this.setPosOver[1]),
    this.aConsultar[x].ystring = `${{...this.aConsultar[x]}.y + (this.setPosOver[1])}px`     
    }})      
}
  public updateConsultas(consultas:Iconsult[]){
    this._consult.updateConsultas(consultas);

  }
  // this._consult.updateConsultas(consults)
  // public addConsulta(consult:Iconsult){
  public addConsulta(consult:Iconsult){
   
    // console.log('addConsulta', consult)
    this._consult.pushConsult({...this.aConsultar[0], descripcion:`${this.aConsultar[this.aConsultar.length-1].descripcion.charAt(1)}${this.aConsultar.length}`, x:5, y:5})
    this.aConsultar = this._consult.getConsults();
    // console.log('addConsulta',  this.aConsultar)
  }
  public optionController(ind:number,selectedIndex:number){
    if(ind == 0)this._consult.addListaGrupo()
    if(ind == 1)this._consult.clearListaFromListGroup(selectedIndex)
    if(ind == 2)this._consult.clearVinculadosFromListGroup(selectedIndex)
  }
 
}
