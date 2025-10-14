/**
 * @file map-loader.service.ts
 * @description Carrega o script base do Google Maps JS API (v=weekly) de forma lazy.
 * As bibliotecas (maps/places/marker etc.) são carregadas via google.maps.importLibrary()
 * dentro dos componentes, conforme a documentação modular:
 * https://developers.google.com/maps/documentation/javascript/libraries
 */

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MapLoaderService {
  private static loadingPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if (MapLoaderService.loadingPromise) return MapLoaderService.loadingPromise;
    if ((window as any).google?.maps) return Promise.resolve();

    const apiKey = environment.firebaseConfig.MyGoogleMapsKey;
    if (!apiKey) return Promise.reject(new Error('Google Maps API key ausente no environment.'));

    MapLoaderService.loadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      // Script base, sem ?libraries= — usaremos importLibrary no componente
      const params = new URLSearchParams({ key: apiKey, v: 'weekly' });
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Falha ao carregar o script do Google Maps.'));
      (script as any).onload = () => resolve();
      document.head.appendChild(script);
    });

    return MapLoaderService.loadingPromise;
  }
}
