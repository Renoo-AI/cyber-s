import {ChangeDetectionStrategy, Component, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {CHALLENGES, GameStateService} from './game-state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [GameStateService]
})
export class App {
  gameState = inject(GameStateService);
  challenges = CHALLENGES;

  isSynced = signal(false);
  scannerRunning = signal(false);
  syncAnimating = signal(false);

  sector1Solved = computed(() => this.gameState.solvedChallenges().filter((id: number) => id >= 1 && id <= 20).length);
  sector2Solved = computed(() => this.gameState.solvedChallenges().filter((id: number) => id >= 21 && id <= 40).length);
  sector3Solved = computed(() => this.gameState.solvedChallenges().filter((id: number) => id >= 41 && id <= 60).length);
  sector4Solved = computed(() => this.gameState.solvedChallenges().filter((id: number) => id >= 61 && id <= 80).length);

  startScanner() {
      this.scannerRunning.set(true);
      if (typeof window !== 'undefined') {
          const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
          scanner.render(
              (decodedText: string) => {
                  this.gameState.syncDevice(decodedText);
                  scanner.clear();
                  this.scannerRunning.set(false);
                  
                  // Glitch transition
                  this.syncAnimating.set(true);
                  setTimeout(() => {
                      this.syncAnimating.set(false);
                      this.isSynced.set(true);
                  }, 1200);
              },
              (error: any) => { /* ignore */ }
          );
      }
  }
}
