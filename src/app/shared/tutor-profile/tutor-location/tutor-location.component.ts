/**
 * @file tutor-location.component.ts
 * @description Componente standalone Angular para exibir mapa interativo
 * usando window.google Maps JavaScript API + Places Autocomplete.
 * Permite: geolocalização, busca por endereço, marcador arrastável,
 * edição manual de latitude/longitude e salvamento de coordenadas.
 */

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
  computed
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MapLoaderService } from '../../../core/services/map-loader.service';
import { LocationService } from '../../../core/services/location.service';

const DEFAULT_CENTER = { lat: -22.833956, lng: -47.048343 };
const DEFAULT_ZOOM = 17;

@Component({
  selector: 'app-tutor-location',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './tutor-location.component.html',
  styleUrls: ['./tutor-location.component.scss']
})
export class TutorLocationComponent implements AfterViewInit, OnDestroy {
  /** Referência do container do mapa */
  @ViewChild('mapRef', { static: true }) private readonly mapRef!: ElementRef<HTMLDivElement>;
  /** Referência do input de endereço (para o Autocomplete) */
  @ViewChild('addressInput', { static: true }) private readonly addressInputRef!: ElementRef<HTMLInputElement>;

  /** Variáveis do formulário */
  addressQuery = '';
  latString = DEFAULT_CENTER.lat.toFixed(6);
  lngString = DEFAULT_CENTER.lng.toFixed(6);

  /** Objetos window.google Maps */
  private map!: google.maps.Map;
  private marker!: google.maps.Marker;
  private autocomplete!: google.maps.places.Autocomplete;

  /** Estado reativo */
  private readonly _status = signal<string>('');
  private readonly _statusError = signal<boolean>(false);
  status = computed(() => this._status());
  statusIsError = computed(() => this._statusError());

  /** Injeções */
  private readonly loader = inject(MapLoaderService);
  private readonly locationService = inject(LocationService);
  private readonly destroyRef = inject(DestroyRef);

  /** Inicializa o mapa e o Autocomplete quando o componente é montado */
  async ngAfterViewInit(): Promise<void> {
    console.log('[TutorLocationComponent] ngAfterViewInit');
    await this.loader.load();
    this.initMap();
    this.initAutocomplete();
    this.setStatus('Mapa carregado com sucesso.');
  }

  ngOnDestroy(): void {
    // O window.google Maps gerencia automaticamente seus listeners na remoção do elemento.
  }

  /** Cria o mapa e o marcador arrastável */
  private initMap(): void {
    this.map = new window.google.maps.Map(this.mapRef.nativeElement, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    this.marker = new window.google.maps.Marker({
      position: DEFAULT_CENTER,
      map: this.map,
      draggable: true
    });

    this.marker.addListener('dragend', () => {
      const pos = this.marker.getPosition()!;
      this.latString = pos.lat().toFixed(6);
      this.lngString = pos.lng().toFixed(6);
      this.setStatus('Marcador movido manualmente.');
    });
  }

  /** Ativa o Autocomplete de endereços (Places API) */
  private initAutocomplete(): void {
    this.autocomplete = new window.google.maps.places.Autocomplete(this.addressInputRef.nativeElement, {
      fields: ['geometry', 'formatted_address'],
      types: ['geocode']
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (!place.geometry?.location) {
        this.setStatus('Endereço inválido. Tente outro termo.', true);
        return;
      }
      const loc = place.geometry.location;
      this.centerAndMark(loc.lat(), loc.lng());
      this.addressQuery = place.formatted_address ?? this.addressQuery;
      this.setStatus('Endereço encontrado com sucesso.');
    });
  }

  /** Força foco e aviso quando usuário tenta buscar manualmente */
  onSearchAddress(): void {
    this.addressInputRef.nativeElement.focus();
    this.setStatus('Selecione uma sugestão do Autocomplete para buscar.');
  }

  /** Usa localização atual do navegador */
  onUseMyLocation(): void {
    if (!('geolocation' in navigator)) {
      this.setStatus('Geolocalização não suportada neste navegador.', true);
      return;
    }

    this.setStatus('Tentando obter localização atual...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.centerAndMark(latitude, longitude, 15);
        this.setStatus('Localização atual aplicada no mapa.');
      },
      (err) => {
        const msg = err.code === 1
          ? 'Permissão negada. Use a busca de endereço.'
          : 'Não foi possível determinar a localização.';
        this.setStatus(msg, true);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  }

  /** Retorna para o centro padrão */
  onReset(): void {
    this.centerAndMark(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng, DEFAULT_ZOOM);
    this.setStatus('Mapa centralizado na posição padrão.');
  }

  /** Atualiza marcador a partir dos inputs */
  private inputDebounce?: any;
  onInputsChanged(): void {
    clearTimeout(this.inputDebounce);
    this.inputDebounce = setTimeout(() => {
      const lat = Number(this.latString);
      const lng = Number(this.lngString);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        this.centerAndMark(lat, lng, Math.max(this.map.getZoom() ?? DEFAULT_ZOOM, 14));
      } else {
        this.setStatus('Latitude ou longitude inválida.', true);
      }
    }, 300);
  }

  /** Salva as coordenadas (exemplo) */
  onSave(): void {
    const lat = Number(this.latString);
    const lng = Number(this.lngString);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      this.setStatus('Latitude/Longitude inválidas.', true);
      return;
    }
    this.setStatus('Salvando coordenadas...');
    const sub = this.locationService.saveLocation({ lat, lng, source: 'tutor-location' }).subscribe({
      next: () => this.setStatus('Coordenadas salvas com sucesso (simulado).'),
      error: () => this.setStatus('Erro ao salvar coordenadas.', true)
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /** Copia coordenadas para área de transferência */
  onCopy(): void {
    const text = `lat:${this.latString}, lng:${this.lngString}`;
    navigator.clipboard?.writeText(text)
      .then(() => this.setStatus('Coordenadas copiadas para a área de transferência.'))
      .catch(() => this.setStatus('Falha ao copiar coordenadas.', true));
  }

  /** Centraliza mapa e marcador */
  private centerAndMark(lat: number, lng: number, zoom?: number): void {
    const position = new window.google.maps.LatLng(lat, lng);
    this.marker.setPosition(position);
    this.map.setCenter(position);
    if (zoom) this.map.setZoom(zoom);
    this.latString = lat.toFixed(6);
    this.lngString = lng.toFixed(6);
  }

  /** Define mensagem de status */
  private setStatus(message: string, isError = false): void {
    this._status.set(message);
    this._statusError.set(isError);
  }
}
