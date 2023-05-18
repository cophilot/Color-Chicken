import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'color-chicken';

  public static JUMP_HEIGHT = 230;
  public static JUMP_SPEED = 7;
  public static GROUND = 550;
  public static WALKING_SPEED = 15;
  public static PLAYER_HEIGHT = 150;
  public static PLAYER_WIDTH = 110;
  public static EGGED_PLAYER_HEIGHT = 75;
  public static EGGED_PLAYER_WIDTH = 60;
  public static UPDATE_CALL_INTERVAL = 10;
  public static START_SPEED = 5;
  public static SPEED = AppComponent.START_SPEED;

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

  checkCollusion: boolean = true;

  pb: boolean = false;

  showInstructions: boolean = true;
  showKeys: boolean = true;

  groundOffsetTop: string = AppComponent.GROUND - 10 + 'px';
  playerOffsetTop: number = AppComponent.GROUND - AppComponent.PLAYER_HEIGHT;
  playerOffsetLeft: number = 100;

  obstacles: CollusionObject[] = [];

  player: CollusionObject[] = [];

  playerStanding: CollusionObject[] = [];
  playerEgged: CollusionObject[] = [];

  showPlayerObstacle: boolean = false;

  @ViewChild('playerImg')
  playerElement!: ElementRef;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    let color = this.getRandomColor(false);
    this.color = color;
    this.start();

    if (window.innerHeight <= 700) {
      this.showKeys = true;
      this.showInstructions = false;
      AppComponent.GROUND = window.innerHeight - 50;
      this.groundOffsetTop = AppComponent.GROUND - 10 + 'px';
      this.playerOffsetTop = AppComponent.GROUND - AppComponent.PLAYER_HEIGHT;
      AppComponent.START_SPEED = 3;
      AppComponent.SPEED = AppComponent.START_SPEED;
    }

    this.player.push(
      new CollusionObject(
        0,
        0,
        AppComponent.PLAYER_WIDTH,
        AppComponent.EGGED_PLAYER_HEIGHT,
        this.color
      )
    );

    this.initPlayerPosition();

    setTimeout(() => {
      this.showInstructions = false;
    }, 5000);
  }

  initPlayerPosition() {
    this.playerEgged = [];
    this.playerStanding = [];
    //body
    this.playerStanding.push(
      new CollusionObject(
        this.playerOffsetLeft + AppComponent.PLAYER_WIDTH * 0.05,
        this.playerOffsetTop + AppComponent.PLAYER_HEIGHT * 0.33,
        AppComponent.PLAYER_WIDTH * 0.9,
        AppComponent.PLAYER_HEIGHT * 0.47,
        this.color
      )
    );
    //head
    this.playerStanding.push(
      new CollusionObject(
        this.playerOffsetLeft + AppComponent.PLAYER_WIDTH * 0.5,
        this.playerOffsetTop,
        AppComponent.PLAYER_WIDTH * 0.4,
        AppComponent.PLAYER_HEIGHT * 0.4,
        this.color
      )
    );
    //legs
    this.playerStanding.push(
      new CollusionObject(
        this.playerOffsetLeft + AppComponent.PLAYER_WIDTH * 0.2,
        this.playerOffsetTop + AppComponent.PLAYER_HEIGHT * 0.7,
        AppComponent.PLAYER_WIDTH * 0.5,
        AppComponent.PLAYER_HEIGHT * 0.3,
        this.color
      )
    );
    //egg
    this.playerEgged.push(
      new CollusionObject(
        this.playerOffsetLeft +
          (AppComponent.PLAYER_WIDTH - AppComponent.EGGED_PLAYER_WIDTH) * 0.5,
        this.playerOffsetTop +
          AppComponent.PLAYER_HEIGHT -
          AppComponent.EGGED_PLAYER_HEIGHT,
        AppComponent.EGGED_PLAYER_WIDTH,
        AppComponent.EGGED_PLAYER_HEIGHT,
        this.color
      )
    );
  }

  getRandomColor(withNone: boolean) {
    const colors = [Color.PURPLE, Color.ORANGE, Color.GREEN];
    if (withNone) {
      colors.push(Color.NONE);
    }
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.pause();
    }
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

    if (event.key === 'p') {
      this.pb = !this.pb;
    }
    if (event.key === 'h' && this.pb) {
      this.checkCollusion = !this.checkCollusion;
      this.pb = false;
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

  eggStop() {
    this.egged = false;
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
  movePlayerLeftStop() {
    this.moveLeft = false;
  }
  movePlayerRightStop() {
    this.moveRight = false;
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
    /* if (this.time % 500 === 0) {
      this.color = this.getRandomColor(false);
    } */
    this.updatePlayerColor();
    this.updatePlayerPosition();
    this.updateObstaclesPosition();
    this.deactivatedObstacles();

    //Scored
    if (!this.showInstructions) {
      this.generateObstacles();
      this.time += AppComponent.UPDATE_CALL_INTERVAL;
      if (this.time % 1000 === 0) {
        this.score += 1;
        if (this.score % 10 === 0 && this.score !== 0) {
          AppComponent.SPEED += 1;
        }
      }
    }

    if (this.checkCollision() && this.checkCollusion) {
      this.gameOver = true;
    }

    if (this.gameOver) {
      this.stop();
    }
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

    for (let i of this.player) {
      i.color = this.color;
    }
    for (let i of this.playerEgged) {
      i.color = this.color;
    }
    for (let i of this.playerStanding) {
      i.color = this.color;
    }
  }

  updateObstaclesPosition() {
    this.obstacles.forEach((obstacle) => {
      obstacle.x -= AppComponent.SPEED;
    });
  }

  updatePlayerPosition() {
    let vectorY = 0;
    let vectorX = 0;
    //jump
    if (this.jumping) {
      let offsetTop = this.playerElement.nativeElement.offsetTop;
      if (!this.jumpingDown) {
        this.playerElement.nativeElement.style.top = `${
          this.playerElement.nativeElement.offsetTop - AppComponent.JUMP_SPEED
        }px`;
        vectorY = -1 * AppComponent.JUMP_SPEED;
      } else {
        this.playerElement.nativeElement.style.top = `${
          this.playerElement.nativeElement.offsetTop + AppComponent.JUMP_SPEED
        }px`;
        vectorY = AppComponent.JUMP_SPEED;
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
      vectorX = -1 * AppComponent.WALKING_SPEED;
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
      vectorX = AppComponent.WALKING_SPEED;
    }

    for (let p of this.playerStanding) {
      p.x += vectorX;
      p.y += vectorY;
    }
    for (let p of this.playerEgged) {
      p.x += vectorX;
      p.y += vectorY;
    }
    if (this.egged) {
      this.player = this.playerEgged;
    } else {
      this.player = this.playerStanding;
    }
  }

  registerobstacle(object: CollusionObject) {
    this.obstacles.push(object);
  }
  registerNewObstacle(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color = Color.NONE
  ) {
    this.obstacles.push(new CollusionObject(x, y, width, height, color));
  }

  checkCollision(): boolean {
    for (let p of this.player) {
      for (let obj of this.obstacles) {
        if (obj.isColliding(p)) {
          return true;
        }
      }
    }
    return false;
  }

  pause() {
    if (this.gameOver) {
      return;
    }
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
    this.egged = false;
    this.jumping = false;
    this.score = 0;
    this.time = 0;
    AppComponent.SPEED = AppComponent.START_SPEED;
    this.color = this.getRandomColor(false);
    this.playerElement.nativeElement.style.left = this.playerOffsetLeft + 'px';
    this.playerElement.nativeElement.style.top = this.playerOffsetTop + 'px';
    this.deactivatedAllObstacles();
    this.obstacles = [];
    this.initPlayerPosition();
    this.start();
  }

  generateObstacles() {
    if (this.time % 2000 === 0) {
      //get random number between 1 and 3
      let type = Math.floor(Math.random() * 5) + 1;
      this.generateObstacleType(type);
    }
  }

  generateObstacleType(type: number) {
    let x = window.innerWidth;
    let width = 70;

    let y, height, color;

    switch (type) {
      case 1:
        height = AppComponent.JUMP_HEIGHT;
        y = AppComponent.GROUND - 10 - height;
        color = this.getRandomColor(false);
        this.registerobstacle(new CollusionObject(x, y, width, height, color));
        break;
      case 2:
        height = AppComponent.JUMP_HEIGHT / 2;
        y = AppComponent.GROUND - 10 - height;
        this.registerobstacle(new CollusionObject(x, y, width, height));
        break;
      case 3:
        //down part
        height = AppComponent.JUMP_HEIGHT / 2;
        y = AppComponent.GROUND - 10 - height;
        this.registerobstacle(new CollusionObject(x, y, width, height));

        //up part
        y = AppComponent.GROUND - 10 - 2 * height;
        color = this.getRandomColor(false);
        this.registerobstacle(new CollusionObject(x, y, width, height, color));
        break;
      case 4:
        //up part
        height = AppComponent.JUMP_HEIGHT / 2;
        y = AppComponent.GROUND - 10 - 2 * height;
        this.registerobstacle(new CollusionObject(x, y, width, height));

        //down part
        y = AppComponent.GROUND - 10 - height;
        color = this.getRandomColor(false);
        this.registerobstacle(new CollusionObject(x, y, width, height, color));
        break;
      case 5:
        //up part
        height = AppComponent.JUMP_HEIGHT / 3;
        y = AppComponent.GROUND - 10 - 3 * height;
        //height = 80;
        color = this.getRandomColor(true);
        this.registerobstacle(new CollusionObject(x, y, width, height, color));

        //middle part
        y = AppComponent.GROUND - 10 - 2 * height;
        //height = 40;
        this.registerobstacle(new CollusionObject(x, y, width, height));

        //down part
        y = AppComponent.GROUND - 10 - height;
        //height = 80;
        color = this.getRandomColor(color !== Color.NONE);
        this.registerobstacle(new CollusionObject(x, y, width, height, color));
        break;
      default:
        break;
    }
  }
  deactivatedObstacles() {
    for (let obj of this.obstacles) {
      if (obj.x < -100) {
        obj.active = false;
      }
    }
  }
  deactivatedAllObstacles() {
    for (let obj of this.obstacles) {
      obj.active = false;
    }
  }

  toggleKeys() {
    this.showKeys = !this.showKeys;
  }
}

export enum Color {
  PURPLE = 'purple',
  ORANGE = 'orange',
  GREEN = 'green',
  NONE = '',
}

export function getHexColor(color: Color): string {
  switch (color) {
    case Color.PURPLE:
      return '#8f00fa';
    case Color.ORANGE:
      return '#fa8f00';
    case Color.GREEN:
      return '#01fa8f';
    default:
      return '#ff0000';
  }
}

export class CollusionObject {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: Color = Color.NONE,
    public active: boolean = true
  ) {}

  public isColliding(obj: CollusionObject): boolean {
    if (!this.active || !obj.active) {
      return false;
    }
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
