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
  public static WALKING_SPEED = 7;
  public static PLAYER_HEIGHT = 150;
  public static PLAYER_WIDTH = 110;
  public static EGGED_PLAYER_HEIGHT = 75;
  public static EGGED_PLAYER_WIDTH = 60;
  public static UPDATE_CALL_INTERVAL = 10;
  public static START_SPEED = 5;
  public static SPEED = AppComponent.START_SPEED;
  public static OBSTACLE_WIDTH = 70;
  public static START_OBSTACLE_QUANTITY = 2000;
  public static OBSTACLE_QUANTITY = AppComponent.START_OBSTACLE_QUANTITY;
  public static SHOW_PLAYER_OBSTACLE = 0;

  // player attributes
  color: Color = getRandomColor(false);
  jumping: boolean = false;
  jumpingDown: boolean = false;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  egged: boolean = false;
  chickenURL: string = 'assets/chickenPurple.png';
  @ViewChild('playerImg')
  playerElement!: ElementRef;

  //player position
  groundOffsetTop: string = AppComponent.GROUND - 10 + 'px';
  playerOffsetTop: number = AppComponent.GROUND - AppComponent.PLAYER_HEIGHT;
  playerOffsetLeft: number = 100;
  playerWidth: number = AppComponent.PLAYER_WIDTH;
  playerHeight: number = AppComponent.PLAYER_HEIGHT;

  // game attributes
  pauseImg: string = 'assets/pause.png';
  updateCall: any;
  paused: boolean = false;
  score: number = 0;
  time: number = 0;
  gameOver: boolean = false;
  showInstructions: boolean = true;
  showKeys: boolean = false;
  showValueSettings: boolean = false;
  checkCollusion: boolean = true;
  pb: boolean = false;
  vs: boolean = false;
  specialRound: number = 0;
  showPlayerObstacle: boolean = false;
  gameOverSlogan: string = '';
  chickenFact: string = getRandomChickenFact();
  showFacts: boolean = true;
  playMusic: boolean = false;

  //audio
  jumpAudio = new Audio('assets/audio/jump.mp3');
  backgroundMusic = new Audio('assets/audio/backgroundMusic.mp3');
  gameOverAudio = new Audio('assets/audio/gameOver.wav');

  //obstacles
  obstacles: CollusionObject[] = [];
  player: CollusionObject[] = [];
  playerStanding: CollusionObject[] = [];
  playerEgged: CollusionObject[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (window.innerHeight <= 700) {
      this.scaleForMobile();
    }

    this.groundOffsetTop = AppComponent.GROUND - 10 + 'px';
    this.playerOffsetTop = AppComponent.GROUND - AppComponent.PLAYER_HEIGHT;
    this.playerWidth = AppComponent.PLAYER_WIDTH;
    this.playerHeight = AppComponent.PLAYER_HEIGHT;
    AppComponent.SPEED = AppComponent.START_SPEED;
    AppComponent.OBSTACLE_QUANTITY = AppComponent.START_OBSTACLE_QUANTITY;

    this.jumpAudio.load();
    this.gameOverAudio.load();
    this.backgroundMusic.load();
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    this.initPlayerObstacles();

    this.start();
    setTimeout(() => {
      this.showInstructions = false;
      if (this.playMusic) {
        this.backgroundMusic.play();
      }
    }, 5000);
  }

  scaleForMobile() {
    this.showKeys = true;
    this.showInstructions = false;
    this.showFacts = false;

    AppComponent.GROUND = window.innerHeight - 100;

    AppComponent.START_SPEED = 3;

    AppComponent.JUMP_HEIGHT = Math.floor(AppComponent.JUMP_HEIGHT * 0.5);
    AppComponent.JUMP_SPEED = Math.floor(AppComponent.JUMP_SPEED * 0.5);
    AppComponent.WALKING_SPEED = Math.floor(AppComponent.WALKING_SPEED * 0.5);

    AppComponent.PLAYER_HEIGHT = Math.floor(AppComponent.PLAYER_HEIGHT * 0.5);
    AppComponent.PLAYER_WIDTH = Math.floor(AppComponent.PLAYER_WIDTH * 0.5);
    AppComponent.EGGED_PLAYER_HEIGHT = Math.floor(
      AppComponent.EGGED_PLAYER_HEIGHT * 0.5
    );
    AppComponent.EGGED_PLAYER_WIDTH = Math.floor(
      AppComponent.EGGED_PLAYER_WIDTH * 0.5
    );

    AppComponent.OBSTACLE_WIDTH = Math.floor(AppComponent.OBSTACLE_WIDTH * 0.5);
  }

  initPlayerObstacles() {
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

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.pause();
    }
    if (event.key === 'p') {
      this.pb = !this.pb;
    }
    if (event.key === 'h' && this.pb) {
      this.checkCollusion = !this.checkCollusion;
      this.pb = false;
    }
    if (event.key === 's') {
      this.vs = !this.vs;
    }
    if (event.key === 'e' && this.vs) {
      this.showValueSettings = !this.showValueSettings;
      this.vs = false;
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
      this.color = getRandomColor(false);
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
        if (this.score % 5 === 0 && this.score !== 0) {
          AppComponent.OBSTACLE_QUANTITY -= 100;
        }
      }
    }

    if (this.checkCollision() && this.checkCollusion) {
      this.gameOver = true;
      if (this.playMusic) {
        this.gameOverAudio.play();
      }
    }

    if (this.gameOver) {
      this.gameOverSlogan = getSloganForScore(this.score);
      this.stop();
    }
    if (AppComponent.SHOW_PLAYER_OBSTACLE > 0) {
      this.showPlayerObstacle = true;
    } else {
      this.showPlayerObstacle = false;
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
          this.playerElement.nativeElement.offsetTop +
          Math.floor(AppComponent.JUMP_SPEED * 1.3)
        }px`;
        vectorY = Math.floor(AppComponent.JUMP_SPEED * 1.3);
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

    // set player object position
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

  registerObstacle(object: CollusionObject) {
    this.obstacles.push(object);
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
    this.moveLeft = false;
    this.moveRight = false;
    this.score = 0;
    this.time = 0;
    this.specialRound = 0;
    AppComponent.SPEED = AppComponent.START_SPEED;
    AppComponent.OBSTACLE_QUANTITY = AppComponent.START_OBSTACLE_QUANTITY;

    this.color = getRandomColor(false);
    this.playerElement.nativeElement.style.left = this.playerOffsetLeft + 'px';
    this.playerElement.nativeElement.style.top = this.playerOffsetTop + 'px';
    this.deactivatedAllObstacles();
    this.obstacles = [];
    this.initPlayerObstacles();
    this.chickenFact = getRandomChickenFact();
    this.start();
  }

  generateObstacles() {
    if (this.specialRound == 0) {
      if (this.time % AppComponent.OBSTACLE_QUANTITY === 0) {
        let type = Math.floor(Math.random() * 5) + 1;
        this.generateObstacleType(type);

        if (Math.floor(Math.random() * 12) == 3) {
          this.specialRound = Math.floor(Math.random() * 6) + 5;
        }
      }
    } else {
      if (
        this.time % Math.floor(AppComponent.START_OBSTACLE_QUANTITY / 4) ===
        0
      ) {
        this.generateObstacleType(1);
        this.specialRound--;
      }
    }
  }

  generateObstacleType(type: number) {
    let x = window.innerWidth;
    let width = AppComponent.OBSTACLE_WIDTH;

    let y, height, color;

    switch (type) {
      case 1:
        height = AppComponent.JUMP_HEIGHT / 3;
        y = AppComponent.GROUND - 10 - height * 3;
        color = getRandomColor(false);
        this.registerObstacle(new CollusionObject(x, y, width, height, color));
        this.registerObstacle(
          new CollusionObject(x, y + height, width, height, color)
        );
        this.registerObstacle(
          new CollusionObject(x, y + 2 * height, width, height, color)
        );
        break;
      case 2:
        height = AppComponent.JUMP_HEIGHT / 2;
        y = AppComponent.GROUND - 10 - height;
        this.registerObstacle(new CollusionObject(x, y, width, height));
        break;
      case 3:
        //down part
        height = AppComponent.JUMP_HEIGHT / 2;
        y = AppComponent.GROUND - 10 - height;
        this.registerObstacle(new CollusionObject(x, y, width, height));

        //up part
        y = AppComponent.GROUND - 10 - 2 * height;
        color = getRandomColor(false);
        this.registerObstacle(new CollusionObject(x, y, width, height, color));
        break;
      case 4:
        //up part
        height = AppComponent.JUMP_HEIGHT / 2;
        y = AppComponent.GROUND - 10 - 2 * height;
        this.registerObstacle(new CollusionObject(x, y, width, height));

        //down part
        y = AppComponent.GROUND - 10 - height;
        color = getRandomColor(false);
        this.registerObstacle(new CollusionObject(x, y, width, height, color));
        break;
      case 5:
        //up part
        height = AppComponent.JUMP_HEIGHT / 3;
        y = AppComponent.GROUND - 10 - 3 * height;
        //height = 80;
        color = getRandomColor(true);
        this.registerObstacle(new CollusionObject(x, y, width, height, color));

        //middle part
        y = AppComponent.GROUND - 10 - 2 * height;
        //height = 40;
        this.registerObstacle(new CollusionObject(x, y, width, height));

        //down part
        y = AppComponent.GROUND - 10 - height;
        //height = 80;
        color = getRandomColor(color !== Color.NONE);
        this.registerObstacle(new CollusionObject(x, y, width, height, color));
        break;
      default:
        break;
    }
  }
  deactivatedObstacles() {
    for (let obj of this.obstacles) {
      if (obj.x < -1 * obj.width) {
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

  jump() {
    if (!this.jumping && !this.egged) {
      this.jumping = true;
      if (this.playMusic) {
        this.jumpAudio.play();
      }
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

  toggleMusic() {
    this.playMusic = !this.playMusic;
    if (this.playMusic) {
      if (this.backgroundMusic.paused) {
        this.backgroundMusic.play();
      }
    } else {
      this.backgroundMusic.pause();
    }
  }

  public setValue(name: string, value: number) {
    let i = -1;
    Object.keys(this).forEach((val, index) => {
      if (val == name) {
        i = index;
      }
    });
    if (i != -1) {
      Object.values(this)[i] = value;
    }
  }
}

export enum Color {
  PURPLE = 'purple',
  ORANGE = 'orange',
  GREEN = 'green',
  NONE = '',
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

function getRandomColor(withNone: boolean) {
  const colors = [Color.PURPLE, Color.ORANGE, Color.GREEN];
  if (withNone) {
    colors.push(Color.NONE);
  }
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
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

function getSloganForScore(score: number): string {
  const slogans = [
    'The Struggle Is Real, Zero Thrills!',
    'One Step Forward, Ninety-Nine To Go!',
    'Too Early To Celebrate, Baby Steps!',
    "Three's a Crowd, Time to Improve!",
    'Four Shades of Mediocrity, Need Spice!',
    'Halfway There, Still Have a Chance!',
    "Six Appeal, Let's Kick It Up!",
    'Seven Up, Feeling Lucky, Mate?',
    'Eighter Late Than Never, Keep Pushing!',
    'Nine Lives, Meow Your Way!',
    'Perfect Ten, Let the Magic Begin!',
    'Eleven Heaven, Flying High!',
    'Twelve to Success, Open the Door!',
    'Unlucky Thirteen, Time to Bounce Back!',
    'Fourteen Flair, Bring on the Fun!',
    'Fifteen Funk, Embrace the Adventure!',
    'Sweet Sixteen, Strutting with Confidence!',
    'Seventeen Stars, Shine Brighter Every Day!',
    'Aged Eighteen, Time to Rock It!',
    'Nineteen, Not Too Shabby, My Friend!',
    "Double Trouble, Score's Getting Serious!",
    'Twenty-One Thrills, Bring on the Party!',
    'Twenty-Two, Catching That Winning Streak!',
    'Twenty-Three and Counting, Keep Charging!',
    'Score Twenty-Four, Ready for More!',
    'Twenty-Five Thrills, Feeling Alive!',
    'Twenty-Six Pixie Dust, Dreams Taking Flight!',
    "Twenty-Seven, Heaven's Smiling Upon You!",
    'Score Twenty-Eight, Feeling Great!',
    'Twenty-Nine, On Cloud Nine!',
    'Dirty Thirty, Still Flirty and Thriving!',
    "Thirty-One Fun, Let's Get It Done!",
    "Thirty-Two, Groovin' and Shakin'!",
    'Thirty-Three Magic Beans, Keep Believing!',
    "Thirty-Four, Rockin' the Scoreboard!",
    'Thirty-Five Alive, Keep the Energy!',
    'Thirty-Six Sticks, Time to Up Your Tricks!',
    "Thirty-Seven, Risin' to the Heavens!",
    'Thirty-Eight Great, Celebrate!',
    'Thirty-Nine Fine, On Cloud Nine!',
    'Fabulous Forty, Let the Party Begin!',
    "Forty-One Fun, Life's Just Begun!",
    "Forty-Two, The Answer's Within You!",
    'Forty-Three Vibes, Keep the Good Times!',
    "Forty-Four Score, You're Begging for More!",
    'Forty-Five Thrive, Keep the Dream Alive!',
    "Forty-Six Tricks, Let's Hit Some Licks!",
    'Forty-Seven, Reaching for the Stars!',
    "Forty-Eight, Fate's Feeling Great!",
    'Forty-Nine Fine, Sparkling Wine!',
    'Fabulous Fifty, Nifty and Thrifty!',
    'Fifty-One Fun, Time for a Run!',
    "Fifty-Two Grooves, It's Time to Move!",
    'Fifty-Three, Thriving with Glee!',
    'Fifty-Four More, Let the Fun Soar!',
    "Fifty-Five Alive, Let's Take a Dive!",
    'Fifty-Six Tricks, Reach for the Mix!',
    'Fifty-Seven, On Cloud Eleven!',
    'Fifty-Eight Great, Celebrate!',
    'Fifty-Nine Fine, Cheers to Your Shine!',
    "Sizzling Sixty, Life's Oh So Nifty!",
    'Sixty-One Fun, Feeling Like the Sun!',
    'Sixty-Two, Dancing Through and Through!',
    'Sixty-Three Glee, Let Your Spirit Be Free!',
    'Sixty-Four More, Fun Times Galore!',
    'Sixty-Five Alive, Ready to Thrive!',
    'Sixty-Six Tricks, Breaking Through the Mix!',
    "Sixty-Seven, Heaven's Not Far Away!",
    'Sixty-Eight, Celebrate Your Winning Fate!',
    'Sixty-Nine Fine, Champagne and Sunshine!',
    "Seventy, Life's a Party!",
    'Seventy-One Fun, Shining Like the Sun!',
    'Seventy-Two, Grooving in All You Do!',
    'Seventy-Three, Sparking With Glee!',
    'Seventy-Four Score, Begging for Encore!',
    'Seventy-Five Alive, Feeling So Jive!',
    'Seventy-Six Tricks, Ready to Mix!',
    "Seventy-Seven, Heaven's a Slice of Heaven!",
    'Seventy-Eight, Feeling Really Great!',
    'Seventy-Nine Fine, Sipping on Sunshine!',
    "Hooray for Eighty, Life's Feeling Weighty!",
    'Eighty-One Fun, Dancing Under the Sun!',
    'Eighty-Two, Grooving in All You Do!',
    'Eighty-Three, Shine for Eternity!',
    'Eighty-Four More, Let the Good Times Roar!',
    'Eighty-Five Alive, Time to Take a Dive!',
    'Eighty-Six Tricks, Cracking the Winning Mix!',
    "Eighty-Seven, Heaven's Your Favorite Place!",
    'Eighty-Eight, Feeling Extra Great!',
    'Eighty-Nine Fine, Savor Every Wine!',
    'Ninety, Party Time, Feeling Mighty!',
    'Ninety-One Fun, Adventures Under the Sun!',
    'Ninety-Two, Grooving and Shaking Too!',
    'Ninety-Three Glee, Unleash Your Inner Free!',
    'Ninety-Four Score, Ready for Encore!',
    'Ninety-Five Alive, Thriving and High-Five!',
    'Ninety-Six Tricks, Unleash the Mix!',
    "Ninety-Seven, Heaven's Your Personal Heaven!",
    'Ninety-Eight, Feeling Absolutely Great!',
    'Ninety-Nine Fine, Sparkling with Divine!',
    'A Hundred, Pure Awesomeness Unleashed!',
    'Beyond the Score, Legends in the Making!',
  ];
  if (score > 100) {
    score = 101;
  }
  return slogans[score];
}

function getRandomChickenFact(): string {
  const facts = [
    'Chickens are descendants of dinosaurs.',
    'Chickens have excellent color vision, being able to see more colors than humans.',
    'Chickens can recognize and remember over 100 different faces of people and animals.',
    "The world's largest chicken egg weighed nearly 12 ounces.",
    'Some chickens can live for more than a decade.',
    'Roosters can make over 20 different vocalizations.',
    'Chickens can dream while they sleep, just like humans.',
    'There are more chickens on Earth than any other bird species.',
    'A group of chickens is called a flock.',
    'Chickens have a specialized language to communicate with their chicks before they hatch.',
    'The record for the fastest recorded speed by a chicken is 9 miles per hour.',
    'Chickens can remember and distinguish between more than 100 different individuals.',
    'Chickens have been known to show empathy towards other chickens in distress.',
    'There are more chickens in the world than humans.',
    'Some chickens can fly short distances, especially certain wild breeds.',
    'Chickens have a complex social hierarchy within their flocks.',
    'Chickens have been kept as pets for thousands of years.',
    'Chickens can recognize different melodies and tones of music.',
    'Some chickens have been trained to play simple video games.',
    'Chickens have been domesticated for over 5,000 years.',
    'Chickens have been known to exhibit problem-solving skills.',
    'Chickens can adapt to a wide range of climates, from hot deserts to cold mountains.',
    "The world's smallest chicken breed is the Serama, which weighs less than a pound.",
    'Chickens have a third eyelid called a nictitating membrane that helps protect their eyes.',
    'Chickens can recognize and remember different types of food.',
    'Some chickens have been trained to perform tricks, like playing a mini piano.',
    'Chickens can communicate with each other through a variety of vocalizations and body language.',
    'The longest recorded flight by a chicken lasted 13 seconds and covered a distance of 301.5 feet.',
    'Chickens have been used in scientific studies to understand embryonic development.',
    "Chickens have a remarkable ability to detect and locate the Earth's magnetic field.",
    'Chickens can produce eggs without the presence of a rooster, but these eggs are not fertilized.',
    'Chickens have been found to possess basic mathematical abilities, such as being able to count.',
    'There are over 175 different chicken breeds worldwide, each with its unique characteristics.',
    'Chickens have a wide range of vocalizations, including clucking, crowing, and squawking.',
    'Chickens have a natural instinct to dustbathe, which helps keep their feathers clean and healthy.',
    'Chickens have a highly developed sense of taste and can detect different flavors.',
    'In some cultures, chickens are considered symbols of good luck and are used in rituals and ceremonies.',
    'Chickens have a well-developed sense of balance and can walk and run on uneven surfaces.',
    'Chickens have been known to form strong bonds with their human caregivers.',
    'Chickens have been used in therapy programs to provide emotional support and companionship.',
  ];
  return facts[Math.floor(Math.random() * facts.length)];
}
