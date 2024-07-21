import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-z-index-1',
  standalone: false,
  templateUrl: './z-index-1.component.html',
  styleUrl: './z-index-1.component.scss'
})
export class ZIndex1Component implements OnInit {
  form: FormGroup;
  currColor: string = '#000000ff';
  currWave: number = 0;
  sineWavePoints: {x: number, y: number}[] = [];
  functions: any[] = [this.sineWavePoints];
  displayWaveCount: number = 1;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      amplitude: [80],
      frequency: [3],
      points: [100],
      width: [5],
      height: [5],
      color: ['#000000ff'],
      rastro: [false],
      addWave: [false]
    });

   }

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      debounceTime(20) // adjust this value as needed
    ).subscribe(() => {
      this.updateSineWave();
    });
    this.generateSineWave(); 
  }

  generateSineWave(): void {
    if (!this.form.value.rastro) {
      this.sineWavePoints = [];
    }
    for (let i = 0; i <= this.form.value.points; i++) {
      let x = i / this.form.value.points * 100; // x position (percentage of the container width)
      let y = this.form.value.amplitude * Math.sin((i / this.form.value.points) * 2 * Math.PI * this.form.value.frequency) + this.form.value.amplitude; // y position
 
      this.sineWavePoints.push({x, y});
    }
  }

  updateSineWave(): void {
    console.log('Updating sine wave with current form values', this.form.value);
    this.generateSineWave(); // This generates the new points based on current form values

    if (this.functions.length > 0) {
      // Update the last wave's points with the newly generated points
      this.functions[this.functions.length - 1] = {
        points: [...this.sineWavePoints],
        settings: {...this.form.value}
      };
    }
  }
  
  selectWave(index: number): void {
    this.currWave = index; // Set the current wave index
    const selectedWaveSettings = this.functions[index].settings;
    this.form.setValue({
      amplitude: selectedWaveSettings.amplitude,
      frequency: selectedWaveSettings.frequency,
      points: selectedWaveSettings.points,
      width: selectedWaveSettings.width,
      height: selectedWaveSettings.height,
      color: selectedWaveSettings.color,
      rastro: selectedWaveSettings.rastro,
      addWave: selectedWaveSettings.addWave
    });
  }

  addWave(): void {
    // Save current wave settings and points
    this.functions.push({
      points: [...this.sineWavePoints],
      settings: this.form.value
    });

    // Reset the current wave points and increment the wave count
    this.sineWavePoints = [];
    this.displayWaveCount++; // Increase the number of waves to display

    // Optionally reset the form or specific fields here if needed
  }

  trackByFn(index: number, item: { x: number; y: number }) {
    return `${index}-${item.x}-${item.y}`; // Constructing a unique identifier based on index and coordinates
  }
}