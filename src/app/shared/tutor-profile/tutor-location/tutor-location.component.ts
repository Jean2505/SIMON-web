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
  computed,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MapLoaderService } from '../../../core/services/map-loader.service';
import { HttpClient } from '@angular/common/http';
import { Tutor } from '../../../models/tutor.model';
import { GeoPoint } from 'firebase/firestore';

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

  /** ID do usuário */
  @Input() uid!: string;

  /** Indica se o usuário é um monitor */
  @Input() isTutor!: boolean;

  /** Matéria do monitor */
  @Input() subject!: Tutor;

  /** Indica se o usuário está vendo ou editando */
  @Input() isEditingSubject!: boolean;

  @Output() closeLocation = new EventEmitter<boolean>();

  constructor(
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient
  ) { }

  // Variáveis do formulário
  addressQuery = '';
  latString!: string;
  lngString!: string;

  // Objetos window.google Maps
  private map!: google.maps.Map;
  private marker!: google.maps.marker.AdvancedMarkerElement;
  private pin!: google.maps.marker.PinElement;

  // Estado reativo
  private readonly _status = signal<string>('');
  private readonly _statusError = signal<boolean>(false);
  status = computed(() => this._status());
  statusIsError = computed(() => this._statusError());

  // Injeções
  private readonly loader = inject(MapLoaderService);

  /** Inicializa o mapa e o Autocomplete quando o componente é montado */
  async ngAfterViewInit(): Promise<void> {

    if (!this.subject.geoLoc) {
      this.setStatus('Nenhuma localização salva para esta matéria.', true);
      this.latString = DEFAULT_CENTER.lat.toFixed(6);
      this.lngString = DEFAULT_CENTER.lng.toFixed(6);
    } else {
      console.log(this.subject.geoLoc);
      this.latString = this.subject.geoLoc.latitude.toFixed(6);
      this.lngString = this.subject.geoLoc.longitude.toFixed(6);
    }

    await this.loader.load();

    const { Map } = (await window.google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    await window.google.maps.importLibrary('places'); // Autocomplete
    const { AdvancedMarkerElement, PinElement } = (await window.google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

    // 3) Inicializa mapa e recursos
    this.map = new Map(this.mapRef.nativeElement, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapId: 'DEMO_MAP_ID' // Substitua pelo seu Map ID
    });

    // Cria um Pin (cores podem ser alteradas)
    this.pin = new PinElement({
      background: '#1fa0ebd7',
      borderColor: '#0f3c97',
      glyphColor: '#ffffff'
    });

    // Cria AdvancedMarker arrastável
    this.marker = new AdvancedMarkerElement({
      map: this.map,
      position: DEFAULT_CENTER,
      gmpDraggable: this.isEditingSubject,
      content: this.pin.element
    });

    // Eventos de arraste
    console.log('isEditingSubject:', this.isEditingSubject);
    if (this.isEditingSubject) {
      this.marker.addListener('dragend', (ev: any) => {
        const ll = ev?.latLng ?? null;
        const lat = ll ? ll.lat() : this.readAdvancedPos().lat;
        const lng = ll ? ll.lng() : this.readAdvancedPos().lng;
        this.latString = lat.toFixed(6);
        this.lngString = lng.toFixed(6);
      });
    }


    this.setStatus('');
    // depois que cria Map, PinElement e AdvancedMarkerElement…
    if (this.subject?.geoLoc) {
      this.centerAndMark(this.subject.geoLoc.latitude, this.subject.geoLoc.longitude, DEFAULT_ZOOM);
    } else {
      this.centerAndMark(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng, DEFAULT_ZOOM);
    }
  }

  /** Retorna {lat, lng} do AdvancedMarker, lidando com LatLng ou Literal. */
  private readAdvancedPos(): { lat: number; lng: number } {
    const p = this.marker.position;
    if (!p) return { lat: DEFAULT_CENTER.lat, lng: DEFAULT_CENTER.lng };

    if (p instanceof window.google.maps.LatLng) {
      return { lat: p.lat(), lng: p.lng() };
    }
    // p é LatLngLiteral/LatLngAltitudeLiteral
    return { lat: (p as google.maps.LatLngLiteral).lat, lng: (p as google.maps.LatLngLiteral).lng };
  }

  ngOnDestroy(): void {
    // O window.google Maps gerencia automaticamente seus listeners na remoção do elemento.
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

    const geoLoc = new GeoPoint(lat, lng);

    const request = {
      uid: this.uid,
      disciplinaId: this.subject.disciplinaId,
      updates: {
        geoLoc
      }
    };

    this.http.post('http://localhost:3000/updateTutor', request).subscribe({
      next: () => {
        console.log('Coordenadas salvas!', geoLoc);
        this.setStatus('Coordenadas salvas com sucesso.');
      },
      error: () => {
        this.setStatus('Erro ao salvar coordenadas.', true);
      }
    });
  }

  onCancel(): void {
    this.closeLocation.emit(true);
  }

  /** Centraliza mapa e marcador */
  private centerAndMark(lat: number, lng: number, zoom?: number): void {
    const position = new window.google.maps.LatLng(lat, lng);
    this.marker.position = position;
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
