import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CollusionObject, getHexColor } from '../app.component';

@Component({
  selector: 'app-obstacle',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.scss'],
})
export class ObstacleComponent {
  width: string = '';
  height: string = '';
  x: string = '';
  y: string = '';
  color: string = '';

  call: any;

  @Input() object: CollusionObject = new CollusionObject(0, 0, 0, 0);

  ngOnInit() {
    this.draw();
    this.call = setInterval(() => {
      this.draw();
      if (this.object.active == false) clearInterval(this.call);
    }, 100);
  }

  ngOnChanges() {
    this.draw();
    console.log('ngOnChanges');
  }

  draw() {
    this.x = this.object.x + 'px';
    this.y = this.object.y + 'px';
    this.width = this.object.width + 'px';
    this.height = this.object.height + 'px';
    this.color = getHexColor(this.object.color);
  }
}
