import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import {
  CollusionObject,
  getHexColor,
  AppComponent,
  Color,
} from '../app.component';

@Component({
  selector: 'app-obstacle',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.scss'],
})
export class ObstacleComponent {
  url: string = 'assets/pigRed.png';
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
      if (!this.object.active) clearInterval(this.call);
      this.draw();
    }, AppComponent.UPDATE_CALL_INTERVAL);
  }

  draw() {
    this.x = this.object.x + 'px';
    this.y = this.object.y + 'px';
    this.width = this.object.width + 'px';
    this.height = this.object.height + 'px';
    this.color = getHexColor(this.object.color);
    if (this.object.color == Color.GREEN) {
      this.url = 'assets/pigGreen.png';
    }
    if (this.object.color == Color.ORANGE) {
      this.url = 'assets/pigOrange.png';
    }
    if (this.object.color == Color.PURPLE) {
      this.url = 'assets/pigPurple.png';
    }
  }
}
