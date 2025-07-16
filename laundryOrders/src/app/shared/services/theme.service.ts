import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: string = 'light';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  switchTheme(theme: string): void {
    this.currentTheme = theme;
    const themeLink = document.querySelector('link[href*="-theme.css"]') as HTMLLinkElement;
    if (themeLink) {
      const newTheme = themeLink.href.replace(this.currentTheme === 'dark' ? 'light-theme' : 'dark-theme', `${theme}-theme`);
      themeLink.href = newTheme;
    }
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }
}
