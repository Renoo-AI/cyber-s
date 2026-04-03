import {ChangeDetectionStrategy, Component, inject, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as QRCode from 'qrcode';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {CHALLENGES, GameStateService} from './game-state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div class="flex-1 p-8 max-w-6xl mx-auto w-full relative z-10">
      
      <!-- Command Center Header -->
      <div class="mb-12 text-center">
        <h1 class="text-5xl md:text-7xl font-display font-black tracking-tight text-white mb-4 uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]"><span class="text-primary-dim">Tactical</span> HUD</h1>
        
        <div class="flex items-center justify-center gap-4 mb-8 flex-wrap">
          <p class="text-primary font-display tracking-widest uppercase text-sm bg-surface-container-low px-6 py-2 rounded-full border-2 border-outline-variant">Command Center Active</p>
          <button (click)="openLinkModal()" class="text-[#00A3FF] hover:bg-[#00A3FF]/10 font-display font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full border-2 border-[#00A3FF] transition-colors flex items-center shadow-[0_0_10px_rgba(0,163,255,0.3)]"><mat-icon class="mr-1 text-[18px]">qr_code</mat-icon> Link Device</button>
        </div>
        
        <!-- Live Feed / Byte's HUD -->
        <div class="byte-hud max-w-2xl mx-auto bg-[#151925]/80 backdrop-blur-md rounded-2xl p-6 shadow-[0px_4px_0px_#00A3FF,inset_0_0_15px_rgba(0,163,255,0.2)] relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,163,255,0.1) 2px, rgba(0,163,255,0.1) 4px);"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="w-12 h-12 rounded-full border-2 border-[#00A3FF] flex justify-center items-center flex-shrink-0 animate-pulse-slow bg-primary/20">
              <mat-icon class="text-[#00A3FF]">smart_toy</mat-icon>
            </div>
            <div class="text-left flex-1">
              <p class="text-[10px] font-display font-bold text-[#00A3FF] uppercase mb-1 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse"></span> Byte Live Feed</p>
              <p class="text-white font-sans text-sm md:text-base leading-relaxed typing-effect">"{{ gameState.byteMessage() }}"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Badges / Achievements -->
      <div class="mb-14 max-w-4xl mx-auto z-10 relative">
         <h3 class="text-[10px] font-display font-black text-white uppercase tracking-[0.2em] mb-4 border-b border-outline-variant pb-2">Tactical Badges</h3>
         <div class="flex flex-wrap justify-center gap-4">
            @for(ach of gameState.achievements(); track ach.id) {
               <div class="p-3 w-32 modern-card shadow-none flex flex-col items-center text-center transition-all duration-300"
                    [ngClass]="ach.unlocked ? 'opacity-100 scale-100 shadow-[0_4px_0_rgba(0,163,255,0.4)] border-2 border-[#00A3FF] bg-[#151925]' : 'opacity-40 scale-95 border-2 border-outline-variant grayscale bg-transparent'">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                       [style.backgroundColor]="ach.unlocked ? ach.color + '20' : '#333'"
                       [style.border]="ach.unlocked ? '2px solid ' + ach.color : '2px solid #555'">
                     <mat-icon [style.color]="ach.unlocked ? ach.color : '#888'">{{ ach.icon }}</mat-icon>
                  </div>
                  <h4 class="text-[10px] uppercase font-bold text-white mb-1 leading-tight">{{ ach.name }}</h4>
                  <p class="text-[8px] text-ui-muted uppercase tracking-wider leading-tight">{{ ach.desc }}</p>
               </div>
            }
         </div>
      </div>

      <!-- Strategic Sectors -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-24 relative z-10">
        <!-- Sector 1: Starter (Blue) -->
        <div class="modern-card group hover:scale-[1.02] transition-transform duration-300 shadow-[8px_8px_0px_0px_#5eb4ff,16px_16px_0px_0px_rgba(94,180,255,0.1)] hover:shadow-[12px_12px_0px_0px_#5eb4ff,24px_24px_0px_0px_rgba(94,180,255,0.2)] border-[#0a0e17] relative overflow-hidden bg-[#151925]/90">
             <div class="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
             <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-[#00A3FF]/20 border-2 border-[#00A3FF] rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#00A3FF]"><mat-icon class="text-[#00A3FF]">rocket_launch</mat-icon></div>
                    <div>
                        <h3 class="text-2xl font-display font-black text-white uppercase transform group-hover:text-primary transition-colors">Starter</h3>
                        <p class="text-[10px] tracking-widest text-primary uppercase">Sector 01</p>
                    </div>
                </div>
                <div class="text-right flex flex-col justify-end">
                    <p class="text-2xl font-display font-black text-white">{{ sector1Solved() }}/20</p>
                </div>
             </div>
             <div class="mb-8">
                <div class="w-full bg-[#0a0e17] h-3 rounded-full overflow-hidden border border-outline-variant">
                    <div class="h-full bg-gradient-to-r from-primary to-primary-dim shadow-[0_0_10px_#00A3FF] transition-all duration-500" [style.width]="(sector1Solved() / 20) * 100 + '%'"></div>
                </div>
             </div>
             <a routerLink="/challenge/admin-param" class="modern-button w-full block text-center uppercase tracking-widest !border-[#00253f] hover:!border-[#00253f] bg-gradient-to-br from-primary to-primary-dim shadow-[0_6px_0_#003151] hover:shadow-[0_2px_0_#003151] active:translate-y-1">Enter Sector</a>
        </div>

        <!-- Sector 2: Input & Logic (Purple) -->
        <div class="modern-card group hover:scale-[1.02] transition-transform duration-300 shadow-[8px_8px_0px_0px_#b091ff,16px_16px_0px_0px_rgba(176,145,255,0.1)] hover:shadow-[12px_12px_0px_0px_#b091ff,24px_24px_0px_0px_rgba(176,145,255,0.2)] border-[#0a0e17] relative overflow-hidden bg-[#151925]/90">
             <div class="absolute -right-10 -top-10 w-32 h-32 bg-[#b091ff]/10 blur-3xl rounded-full"></div>
             <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-[#b091ff]/20 border-2 border-[#b091ff] rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#b091ff]"><mat-icon class="text-[#b091ff]">keyboard</mat-icon></div>
                    <div>
                        <h3 class="text-2xl font-display font-black text-white uppercase transform group-hover:text-[#b091ff] transition-colors">Input & Logic</h3>
                        <p class="text-[10px] tracking-widest text-[#b091ff] uppercase">Sector 02</p>
                    </div>
                </div>
                <div class="text-right flex flex-col justify-end">
                    <p class="text-2xl font-display font-black text-white">{{ sector2Solved() }}/20</p>
                </div>
             </div>
             <div class="mb-8">
                <div class="w-full bg-[#0a0e17] h-3 rounded-full overflow-hidden border border-outline-variant">
                    <div class="h-full bg-gradient-to-r from-[#bca2ff] to-[#b091ff] shadow-[0_0_10px_#b091ff] transition-all duration-500" [style.width]="(sector2Solved() / 20) * 100 + '%'"></div>
                </div>
             </div>
             <a routerLink="/challenge/idor-id" class="modern-button w-full block text-center uppercase tracking-widest !bg-gradient-to-br !from-[#bca2ff] !to-[#b091ff] !border-[#43208b] hover:!border-[#43208b] shadow-[0_6px_0_#43208b] hover:shadow-[0_2px_0_#43208b] active:translate-y-1">Enter Sector</a>
        </div>

        <!-- Sector 3: Web Attacks (Orange) -->
        <div class="modern-card group hover:scale-[1.02] transition-transform duration-300 shadow-[8px_8px_0px_0px_#ff9900,16px_16px_0px_0px_rgba(255,153,0,0.1)] hover:shadow-[12px_12px_0px_0px_#ff9900,24px_24px_0px_0px_rgba(255,153,0,0.2)] border-[#0a0e17] relative overflow-hidden bg-[#151925]/90">
             <div class="absolute -right-10 -top-10 w-32 h-32 bg-[#ff9900]/10 blur-3xl rounded-full"></div>
             <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-[#ff9900]/20 border-2 border-[#ff9900] rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#ff9900]"><mat-icon class="text-[#ff9900]">radar</mat-icon></div>
                    <div>
                        <h3 class="text-2xl font-display font-black text-white uppercase transform group-hover:text-[#ff9900] transition-colors">Web Attacks</h3>
                        <p class="text-[10px] tracking-widest text-[#ff9900] uppercase">Sector 03</p>
                    </div>
                </div>
                <div class="text-right flex flex-col justify-end">
                    <p class="text-2xl font-display font-black text-white">{{ sector3Solved() }}/20</p>
                </div>
             </div>
             <div class="mb-8">
                <div class="w-full bg-[#0a0e17] h-3 rounded-full overflow-hidden border border-outline-variant">
                    <div class="h-full bg-gradient-to-r from-[#ffb442] to-[#ff9900] shadow-[0_0_10px_#ff9900] transition-all duration-500" [style.width]="(sector3Solved() / 20) * 100 + '%'"></div>
                </div>
             </div>
             <a routerLink="/challenge/sqli-login" class="modern-button w-full block text-center uppercase tracking-widest !bg-gradient-to-br !from-[#ffb442] !to-[#ff9900] !border-[#995c00] hover:!border-[#995c00] shadow-[0_6px_0_#995c00] hover:shadow-[0_2px_0_#995c00] active:translate-y-1">Enter Sector</a>
        </div>

        <!-- Sector 4: Hacker Mode (Red) -->
        <div class="modern-card group hover:scale-[1.02] transition-transform duration-300 shadow-[8px_8px_0px_0px_#ff3333,16px_16px_0px_0px_rgba(255,51,51,0.1)] hover:shadow-[12px_12px_0px_0px_#ff3333,24px_24px_0px_0px_rgba(255,51,51,0.2)] border-[#0a0e17] relative overflow-hidden bg-[#151925]/90">
             <div class="absolute -right-10 -top-10 w-32 h-32 bg-[#ff3333]/10 blur-3xl rounded-full"></div>
             <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-[#ff3333]/20 border-2 border-[#ff3333] rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#ff3333]"><mat-icon class="text-[#ff3333]">terminal</mat-icon></div>
                    <div>
                        <h3 class="text-2xl font-display font-black text-white uppercase transform group-hover:text-[#ff3333] transition-colors">Hacker Mode</h3>
                        <p class="text-[10px] tracking-widest text-[#ff3333] uppercase">Sector 04</p>
                    </div>
                </div>
                <div class="text-right flex flex-col justify-end">
                    <p class="text-2xl font-display font-black text-white">{{ sector4Solved() }}/20</p>
                </div>
             </div>
             <div class="mb-8">
                <div class="w-full bg-[#0a0e17] h-3 rounded-full overflow-hidden border border-outline-variant">
                    <div class="h-full bg-gradient-to-r from-[#ff6666] to-[#ff3333] shadow-[0_0_10px_#ff3333] transition-all duration-500" [style.width]="(sector4Solved() / 20) * 100 + '%'"></div>
                </div>
             </div>
             <a routerLink="/challenge/jwt-decode" class="modern-button w-full block text-center uppercase tracking-widest !bg-gradient-to-br !from-[#ff6666] !to-[#ff3333] !border-[#990000] hover:!border-[#990000] shadow-[0_6px_0_#990000] hover:shadow-[0_2px_0_#990000] active:translate-y-1">Enter Sector</a>
        </div>
      </div>
      <!-- QR Code Link Modal -->
      <div *ngIf="isModalOpen()" class="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl bg-[#0a0e17]/80">
        <div class="modern-card p-10 max-w-sm w-full mx-4 relative overflow-hidden bg-[#151925] border-4 border-[#00A3FF] shadow-[0_0_40px_rgba(0,163,255,0.4)] flex flex-col items-center text-center">
            <button (click)="closeLinkModal()" class="absolute top-4 right-4 text-[#00A3FF] hover:text-white transition-colors"><mat-icon>close</mat-icon></button>
            <h3 class="text-2xl font-display font-black text-white uppercase mb-1">Tactical Link</h3>
            <p class="text-[10px] tracking-widest text-[#00A3FF] uppercase mb-8">Scan from mobile terminal</p>
            <div class="p-2 bg-white rounded-lg mb-6 shadow-inner">
                <canvas id="qrcode-canvas" class="w-full"></canvas>
            </div>
            <p class="text-[10px] text-white opacity-40 uppercase tracking-widest truncate w-full">{{ gameState.sessionId() }}</p>
        </div>
      </div>

    </div>
  `
})
export class Dashboard {
  gameState = inject(GameStateService);
  challenges = CHALLENGES;

  sector1Solved = computed(() => this.gameState.solvedChallenges().filter((id: number) => id >= 1 && id <= 20).length);
  sector2Solved = computed(() => this.gameState.solvedChallenges().filter((id: number) => id >= 21 && id <= 40).length);
  sector3Solved = computed(() => this.gameState.solvedChallenges().filter((id: number) => id >= 41 && id <= 60).length);
  sector4Solved = computed(() => this.gameState.solvedChallenges().filter((id: number) => id >= 61 && id <= 80).length);

  isModalOpen = signal(false);

  openLinkModal() {
      this.isModalOpen.set(true);
      setTimeout(() => {
          const canvas = document.getElementById('qrcode-canvas');
          if (canvas) {
              QRCode.toCanvas(canvas, this.gameState.generateSyncPayload(), {
                  width: 200,
                  margin: 1,
                  color: { dark: '#00A3FF', light: '#ffffff' }
              });
          }
      }, 50);
  }

  closeLinkModal() {
      this.isModalOpen.set(false);
  }
}
