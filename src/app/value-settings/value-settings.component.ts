import { Component, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-value-settings',
  templateUrl: './value-settings.component.html',
  styleUrls: ['./value-settings.component.scss'],
})
export class ValueSettingsComponent {
  obj: any[] = [];

  test: number = 0;

  ngOnInit(): void {
    for (let i = 0; i < Object.keys(AppComponent).length; i++) {
      let key = Object.keys(AppComponent)[i];
      if (key === 'ɵfac' || key === 'ɵcmp' || key === '__NG_ELEMENT_ID__') {
        continue;
      }
      this.obj.push({
        index: i + 1,
        name: key,
        value: Object.values(AppComponent)[i],
      });
    }
  }

  save() {
    for (let o of this.obj) {
      let num = Number(o.value.value);
      if (!isNaN(num)) {
        o.value = num;
      }
    }
    console.log(this.obj);

    for (let o of this.obj) {
      switch (o.name) {
        case 'JUMP_HEIGHT':
          AppComponent.JUMP_HEIGHT = o.value;
          break;
        case 'JUMP_SPEED':
          AppComponent.JUMP_SPEED = o.value;
          break;
        case 'GROUND':
          AppComponent.GROUND = o.value;
          break;
        case 'WALKING_SPEED':
          AppComponent.WALKING_SPEED = o.value;
          break;
        case 'PLAYER_HEIGHT':
          AppComponent.PLAYER_HEIGHT = o.value;
          break;
        case 'PLAYER_WIDTH':
          AppComponent.PLAYER_WIDTH = o.value;
          break;
        case 'UPDATE_CALL_INTERVAL':
          AppComponent.UPDATE_CALL_INTERVAL = o.value;
          break;
        case 'EGGED_PLAYER_HEIGHT':
          AppComponent.EGGED_PLAYER_HEIGHT = o.value;
          break;
        case 'EGGED_PLAYER_WIDTH':
          AppComponent.EGGED_PLAYER_WIDTH = o.value;
          break;
        case 'START_SPEED':
          AppComponent.START_SPEED = o.value;
          break;
        case 'OBSTACLE_WIDTH':
          AppComponent.OBSTACLE_WIDTH = o.value;
          break;
        case 'OBSTACLE_WIDTH':
          AppComponent.OBSTACLE_WIDTH = o.value;
          break;
        case 'SHOW_PLAYER_OBSTACLE':
          AppComponent.SHOW_PLAYER_OBSTACLE = o.value;
          break;

        default:
          console.log('Error: ' + o.name + ' is not a valid name');
          break;
      }
    }
  }
}
