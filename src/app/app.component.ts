import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'color-chicken';

  chickenURL: string = 'assets/chickenPurple.png';

  @ViewChild('player')
  player!: ElementRef;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.setColor(this.getRandomColor());
  }
  getRandomColor() {
    const colors = [Color.PURPLE, Color.ORANGE, Color.GREEN];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  setColor(newColor: string) {
    if (newColor.toLocaleLowerCase() === Color.PURPLE) {
      this.chickenURL = 'assets/chickenPurple.png';
    }
    if (newColor.toLocaleLowerCase() === Color.ORANGE) {
      this.chickenURL = 'assets/chickenOrange.png';
    }
    if (newColor.toLocaleLowerCase() === Color.GREEN) {
      this.chickenURL = 'assets/chickenGreen.png';
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.key === 'ArrowUp') {
      this.player.nativeElement.style.top = `${
        this.player.nativeElement.offsetTop - 10
      }px`;
    }
    if (event.key === 'ArrowLeft') {
      this.player.nativeElement.style.left = `${
        this.player.nativeElement.offsetLeft - 10
      }px`;
    }
    if (event.key === 'ArrowRight') {
      this.player.nativeElement.style.left = `${
        this.player.nativeElement.offsetLeft + 10
      }px`;
    }
    //change color
    if (event.key === 'b') {
      this.setColor(Color.PURPLE);
    }
    if (event.key === 'n') {
      this.setColor(Color.ORANGE);
    }
    if (event.key === 'm') {
      this.setColor(Color.GREEN);
    }
  }
}

export enum Color {
  PURPLE = 'purple',
  ORANGE = 'orange',
  GREEN = 'green',
}
