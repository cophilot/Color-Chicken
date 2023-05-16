import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'color-chicken';

  public static JUMP_HEIGHT = 200;
  public static JUMP_SPEED = 10;
  public static GROUND = 550;
  public static WALKING_SPEED = 15;
  public static PLAYER_HEIGHT = 150;
  public static PLAYER_WIDTH = 110;
  public static EGGED_PLAYER_HEIGHT = 75;
  public static EGGED_PLAYER_WIDTH = 110;
  public static UPDATE_CALL_INTERVAL = 10;

  color: string = Color.PURPLE;

  jumping: boolean = false;
  jumpingDown: boolean = false;

  moveLeft: boolean = false;
  moveRight: boolean = false;

  egged: boolean = false;

  chickenURL: string = 'assets/chickenPurple.png';

  updateCall: any;

  paused: boolean = false;

  score: number = 0;

  time: number = 0;

  gameOver: boolean = false;

  @ViewChild('player')
  player!: ElementRef;
  @ViewChild('pauseButton')
  pauseButton!: ElementRef;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.color = this.getRandomColor();
    this.start();
  }
  getRandomColor() {
    const colors = [Color.PURPLE, Color.ORANGE, Color.GREEN];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  updatePlayerColor() {
    if (this.color.toLocaleLowerCase() === Color.PURPLE) {
      if (this.egged) {
        this.chickenURL = 'assets/eggPurple.png';
      } else {
        this.chickenURL = 'assets/chickenPurple.png';
      }
    }
    if (this.color.toLocaleLowerCase() === Color.ORANGE) {
      if (this.egged) {
        this.chickenURL = 'assets/eggOrange.png';
      } else {
        this.chickenURL = 'assets/chickenOrange.png';
      }
    }
    if (this.color.toLocaleLowerCase() === Color.GREEN) {
      if (this.egged) {
        this.chickenURL = 'assets/eggGreen.png';
      } else {
        this.chickenURL = 'assets/chickenGreen.png';
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (this.paused) {
      return;
    }
    // jump
    if (event.key === 'ArrowUp' && !this.jumping && !this.egged) {
      this.jumping = true;
    }

    // egg
    if (event.key === 'ArrowDown' && !this.egged && !this.jumping) {
      this.egged = true;
    }

    //  move left
    if (event.key === 'ArrowLeft' && !this.moveRight) {
      this.moveLeft = true;
    }

    //move right
    if (event.key === 'ArrowRight' && !this.moveLeft) {
      this.moveRight = true;
    }

    //change color
    if (event.key === 'b') {
      this.color = Color.PURPLE;
    }
    if (event.key === 'n') {
      this.color = Color.ORANGE;
    }
    if (event.key === 'm') {
      this.color = Color.GREEN;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    if (this.paused) {
      return;
    }

    if (event.key === 'ArrowDown') {
      if (this.egged) {
        this.egged = false;
      }
    }
    if (event.key === 'ArrowLeft') {
      this.moveLeft = false;
    }
    if (event.key === 'ArrowRight') {
      this.moveRight = false;
    }
  }

  update() {
    this.updatePlayerColor();
    this.updatePlayerPosition();
    this.time += AppComponent.UPDATE_CALL_INTERVAL;
    if (this.time % 1000 === 0) {
      this.score += 1;
    }
    if (this.gameOver) {
      this.stop();
    }
  }

  updatePlayerPosition() {
    //jump
    if (this.jumping) {
      let offsetTop = this.player.nativeElement.offsetTop;
      if (!this.jumpingDown) {
        this.player.nativeElement.style.top = `${
          this.player.nativeElement.offsetTop - AppComponent.JUMP_SPEED
        }px`;
      } else {
        this.player.nativeElement.style.top = `${
          this.player.nativeElement.offsetTop + AppComponent.JUMP_SPEED
        }px`;
      }

      // if player is at the top of the jump
      if (
        offsetTop <=
        AppComponent.GROUND -
          AppComponent.PLAYER_HEIGHT -
          AppComponent.JUMP_HEIGHT
      ) {
        this.jumpingDown = true;
      }

      // if player is on the ground
      if (
        offsetTop >= AppComponent.GROUND - AppComponent.PLAYER_HEIGHT &&
        this.jumpingDown
      ) {
        this.jumping = false;
        this.jumpingDown = false;
      }
    }

    //move left
    if (
      this.moveLeft &&
      !this.egged &&
      this.player.nativeElement.offsetLeft > 0
    ) {
      this.player.nativeElement.style.left = `${
        this.player.nativeElement.offsetLeft - AppComponent.WALKING_SPEED
      }px`;
    }
    //move right
    if (
      this.moveRight &&
      !this.egged &&
      this.player.nativeElement.offsetLeft <
        window.innerWidth - AppComponent.PLAYER_WIDTH
    ) {
      this.player.nativeElement.style.left = `${
        this.player.nativeElement.offsetLeft + AppComponent.WALKING_SPEED
      }px`;
    }
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      this.pauseButton.nativeElement.innerHTML = 'Resume';
      this.stop();
    } else {
      this.paused = false;
      this.pauseButton.nativeElement.innerHTML = 'Pause';
      this.start();
    }
  }

  start() {
    this.updateCall = setInterval(() => {
      this.update();
    }, AppComponent.UPDATE_CALL_INTERVAL);
  }

  stop() {
    clearInterval(this.updateCall);
  }

  restart() {
    this.stop();
    this.gameOver = false;
    this.score = 0;
    this.time = 0;
    this.color = this.getRandomColor();
    this.start();
  }
}

export enum Color {
  PURPLE = 'purple',
  ORANGE = 'orange',
  GREEN = 'green',
}
