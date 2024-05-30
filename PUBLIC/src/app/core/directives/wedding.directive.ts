/**
 * WeddingDirective
 * 
 * This Angular directive dynamically applies CSS classes to the host element based on the viewport size.
 * It utilizes Angular's BreakpointObserver to detect changes in viewport size and applies appropriate
 * CSS classes to enhance responsive design capabilities.
 * 
 * Key Features:
 * - **Responsive Adaptation**: Automatically adjusts the CSS classes applied to the host element
 *   based on the current viewport size, ensuring optimal layout and styling across different devices.
 * - **Breakpoint Management**: Uses a set of predefined breakpoints (XSmall, Small, Medium, Large, XLarge)
 *   to determine the current device type and orientation.
 * - **Class Management**: Dynamically binds one or more CSS classes to the host element using Angular's
 *   HostBinding. This is primarily driven by the viewport's size and specific adaptations flagged by
 *   the component or directive consuming this directive.
 * - **Customization**: Supports customization through `@Input('AdaptViews')` which allows the consuming
 *   component to specify adaptations based on the application's needs.
 * 
 * Usage:
 * Apply this directive to any element by using the selector '[Wedding]', and control adaptations
 * through the `AdaptViews` input binding.
 * 
 * Example:
 * `<div [Wedding]="[true, false]"></div>`
 * 
 * The above example applies the WeddingDirective to a div element, enabling general adaptations
 * based on the first index of the AdaptViews input array.
 */
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Directive, HostBinding, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const CUSTOM_BREAKPOINTS = {
  width320: '(max-width: 319px;)',
  width360: '(max-width: 360px;)'
};
@Directive({
  selector: '[Wedding]',
  exportAs: 'bmkwedding'
})
export class WeddingDirective {

  @Input('AdaptViews')
  isAdapted:boolean[] = [false,false];
  Breakpoints = { ...Breakpoints, ...CUSTOM_BREAKPOINTS }; 
  currentBreakpoint:string = "";
  isMobileVP:boolean = false;
  tableAdapt: string = '';
  readonly breakpoint$: Observable<BreakpointState>;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
        Breakpoints.HandsetLandscape,
        CUSTOM_BREAKPOINTS.width320,
        CUSTOM_BREAKPOINTS.width360
      ])
      .pipe(distinctUntilChanged());
  }

  ngOnInit(): void {
    this.breakpoint$.subscribe(() => {
      this.breakpointChanged()
    });
  }
    private breakpointChanged() {  
      const breakpoints = [
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
        Breakpoints.HandsetLandscape,
        CUSTOM_BREAKPOINTS.width320,
        CUSTOM_BREAKPOINTS.width360
      ];

      this.currentBreakpoint = breakpoints.find(bp => this.breakpointObserver.isMatched(bp)) || this.currentBreakpoint;
      this.isMobileVP = [Breakpoints.XSmall, Breakpoints.Small, CUSTOM_BREAKPOINTS.width320, CUSTOM_BREAKPOINTS.width360].includes(this.currentBreakpoint);
    }
    

    @HostBinding('class')
get cssClasses(): string {
  let classes = this.gralAdapt(); // General adaptations based on isAdapted[0]

  // Append specific classes based on the current breakpoint
  // if (this.isMobileVP) {
  //   classes += ' is-mobile';
  // } else {
    switch (this.currentBreakpoint) {
      case Breakpoints.XLarge:
        classes += ' is-XLarge';
        break;
      case Breakpoints.Large:
        classes += ' is-Large';
        break;
      case Breakpoints.Medium:
        classes += ' is-Medium';
        break;
      case Breakpoints.Small:
        classes += ' is-Small';
        break;
      case Breakpoints.XSmall:
        classes += ' is-XSmall';
        break;
        case CUSTOM_BREAKPOINTS.width320:
          classes += ' is-width320';
          break;
        case CUSTOM_BREAKPOINTS.width360:
          classes += ' is-width360';
          break;
    }
  // }

  return classes.trim(); // Trim to remove any leading/trailing spaces
}
    
    //Metodo para obtener Boolean de < o > a 768px del ViewPort
    getIsMob(){
    return this.isMobileVP;
    }
    gralAdapt(){
      if(this.isAdapted[0] == true){
          switch(this.currentBreakpoint){
           case Breakpoints.XLarge: return "";
           case Breakpoints.Large: return "Large";
           case Breakpoints.Medium: return "Medium";
           case Breakpoints.Small: return "Small";
           case Breakpoints.XSmall: return "XSmall";
           case CUSTOM_BREAKPOINTS.width320: return "width320";
           case CUSTOM_BREAKPOINTS.width360: return "width360";
         }
         return "XLarge";
       }else return '';
     }
    tableMaker(){
   if(this.isAdapted[1] == true){
       switch(this.currentBreakpoint){
        case Breakpoints.XLarge: return "";
        case Breakpoints.Large: return "";
        case Breakpoints.Medium: return "";
        case Breakpoints.Small: return "is-mobile";
        case Breakpoints.XSmall: return "is-mobile";
      }
      return '';
    }else return '';
  }


    insertColName(){
      
    }
  } 
