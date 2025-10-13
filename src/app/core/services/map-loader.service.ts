/**
 * @file map-loader.service.ts
 * @description Carrega o script do Google Maps JS API de forma lazy e segura,
 * evitando múltiplas injeções. Expõe um observable/promise de "ready".
 */

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MapLoaderService {
  /** Flag estática para evitar múltiplas inserções do script. */
  private static loadingPromise: Promise<void> | null = null;

  /**
   * Faz o lazy-load do script do Google Maps com Places.
   * Retorna uma Promise que resolve quando `google.maps` está pronto.
   */
  load(): Promise<void> {
    // Se já carregando / carregado, reaproveita.
    if (MapLoaderService.loadingPromise) {
      return MapLoaderService.loadingPromise;
    }

    // Se já existir globalmente, resolve imediatamente.
    if ((window as any).google?.maps) {
      return Promise.resolve();
    }

    const apiKey = environment.firebaseConfig.MyGoogleMapsKey;
    if (!apiKey) {
      return Promise.reject(new Error('Google Maps API key ausente no environment.'));
    }

    MapLoaderService.loadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      const params = new URLSearchParams({
        key: apiKey,
        libraries: 'places',     // necessário para Autocomplete
        v: 'weekly'              // versão estável
      });
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Falha ao carregar Google Maps script.'));
      (script as any).onload = () => resolve();
      document.head.appendChild(script);
    });

    return MapLoaderService.loadingPromise;
  }
}
