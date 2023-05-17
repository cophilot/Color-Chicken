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

  color: Color = Color.PURPLE;

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

  pauseImg: string = 'assets/pause.png';

  objects: Object[] = [];
  player: Object = new Object(
    0,
    0,
    AppComponent.PLAYER_WIDTH,
    AppComponent.PLAYER_HEIGHT
  );

  @ViewChild('player')
  playerElement!: ElementRef;
  @ViewChild('pauseButton')
  pauseButton!: ElementRef;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.color = this.getRandomColor();
    this.start();
    this.registerNewObject(1000, 460, 70, 70, Color.NONE);
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

    this.player.color = this.color;
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.pause();
    }
    console.log(event.key);
    if (this.paused) {
      return;
    }
    // jump
    if (event.key === 'ArrowUp') {
      this.jump();
    }

    // egg
    if (event.key === 'ArrowDown') {
      this.egg();
    }

    //  move left
    if (event.key === 'ArrowLeft') {
      this.movePlayerLeft();
    }

    //move right
    if (event.key === 'ArrowRight') {
      this.movePlayerRight();
    }

    //change color
    if (event.key === 'b') {
      this.changeColorPurple();
    }
    if (event.key === 'n') {
      this.changeColorOrange();
    }
    if (event.key === 'm') {
      this.changeColorGreen();
    }
  }

  jump() {
    if (!this.jumping && !this.egged) {
      this.jumping = true;
    }
  }

  egg() {
    if (!this.egged && !this.jumping) {
      this.egged = true;
    }
  }

  movePlayerLeft() {
    if (!this.moveRight) {
      this.moveLeft = true;
    }
  }
  movePlayerRight() {
    if (!this.moveLeft) {
      this.moveRight = true;
    }
  }

  changeColorPurple() {
    this.color = Color.PURPLE;
  }

  changeColorOrange() {
    this.color = Color.ORANGE;
  }

  changeColorGreen() {
    this.color = Color.GREEN;
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
    //Score
    this.time += AppComponent.UPDATE_CALL_INTERVAL;
    if (this.time % 1000 === 0) {
      this.score += 1;
    }

    if (this.checkCollision()) {
      this.gameOver = true;
    }

    if (this.gameOver) {
      this.stop();
    }
  }

  updatePlayerPosition() {
    //jump
    if (this.jumping) {
      let offsetTop = this.playerElement.nativeElement.offsetTop;
      if (!this.jumpingDown) {
        this.playerElement.nativeElement.style.top = `${
          this.playerElement.nativeElement.offsetTop - AppComponent.JUMP_SPEED
        }px`;
      } else {
        this.playerElement.nativeElement.style.top = `${
          this.playerElement.nativeElement.offsetTop + AppComponent.JUMP_SPEED
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
      this.playerElement.nativeElement.offsetLeft > 0
    ) {
      this.playerElement.nativeElement.style.left = `${
        this.playerElement.nativeElement.offsetLeft - AppComponent.WALKING_SPEED
      }px`;
    }
    //move right
    if (
      this.moveRight &&
      !this.egged &&
      this.playerElement.nativeElement.offsetLeft <
        window.innerWidth - AppComponent.PLAYER_WIDTH
    ) {
      this.playerElement.nativeElement.style.left = `${
        this.playerElement.nativeElement.offsetLeft + AppComponent.WALKING_SPEED
      }px`;
    }

    // update player object position
    this.player.x = this.playerElement.nativeElement.offsetLeft;
    this.player.y = this.playerElement.nativeElement.offsetTop;
  }

  registerObject(object: Object) {
    this.objects.push(object);
  }
  registerNewObject(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color = Color.NONE
  ) {
    this.objects.push(new Object(x, y, width, height, color));
  }

  checkCollision(): boolean {
    for (let obj of this.objects) {
      if (obj.isColliding(this.player)) {
        return true;
      }
    }
    return false;
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      this.egged = false;
      this.moveLeft = false;
      this.moveRight = false;
      this.pauseImg = 'assets/resume.png';
      this.stop();
    } else {
      this.paused = false;
      this.pauseImg = 'assets/pause.png';
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
    this.playerElement.nativeElement.style.left = '100px';
    this.playerElement.nativeElement.style.top = '400px';
    this.start();
  }
}

export enum Color {
  PURPLE = 'purple',
  ORANGE = 'orange',
  GREEN = 'green',
  NONE = '',
}

export class Object {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: Color = Color.NONE
  ) {}

  public isColliding(obj: Object): boolean {
    if (this.color !== Color.NONE && this.color === obj.color) {
      return false;
    }
    if (
      this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.height &&
      this.y + this.height > obj.y
    ) {
      return true;
    }
    return false;
  }
}
