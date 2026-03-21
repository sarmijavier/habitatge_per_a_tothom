import {
  Component,
  Input,
  OnChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

declare const Plotly: any;

// GeoJSON is served through our own backend proxy to avoid CORS issues.
// The proxy maps country keys to the appropriate upstream GeoJSON source.
const GEO_PROXY = 'http://localhost:3000/geo';

const COLOR_SCALE = [
  [0.0,  '#3B8BD4'],
  [0.3,  '#85B7EB'],
  [0.5,  '#F9CB42'],
  [0.68, '#EF9F27'],
  [0.85, '#E24B4A'],
  [1.0,  '#791F1F'],
];

export interface MapPayload {
  country?: string;
  title?: string;
  year?: number;
  regions: Array<{ name: string; value: number; label?: string }>;
}

@Component({
  selector: 'app-map-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-widget">
      <div class="map-header">
        <h2 class="widget-title">{{ getTitle() }}</h2>
      </div>
      <div *ngIf="error" class="map-error">{{ error }}</div>
      <div *ngIf="loading" class="map-loading">Loading map…</div>
      <div #plotDiv class="plot-container"></div>
    </div>
  `,
  styleUrls: ['./map-widget.component.css'],
})
export class MapWidgetComponent implements OnChanges, AfterViewInit {
  @Input() payload!: MapPayload;

  @ViewChild('plotDiv') plotDiv!: ElementRef<HTMLDivElement>;

  loading = true;
  error = '';

  private geojsonCache = new Map<string, { geo: any; nameKey: string }>();
  private activeCountry = '';
  private viewReady = false;

  getTitle(): string {
    const t = this.payload?.title ?? 'Regional data';
    return this.payload?.year ? `${t} (${this.payload.year})` : t;
  }

  ngOnChanges(): void {
    if (!this.viewReady) return;
    const country = this.payload?.country ?? 'spain';
    if (country !== this.activeCountry) {
      this.loadGeojson(country);
    } else {
      const cached = this.geojsonCache.get(country);
      if (cached && this.payload?.regions?.length) this.render(cached);
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.loadGeojson(this.payload?.country ?? 'spain');
  }

  private async loadGeojson(country: string): Promise<void> {
    this.activeCountry = country;
    this.error = '';

    const cached = this.geojsonCache.get(country);
    if (cached) {
      this.loading = false;
      if (this.payload?.regions?.length) this.render(cached);
      return;
    }

    this.loading = true;
    const url = `${GEO_PROXY}/${encodeURIComponent(country)}`;
    try {
      const geo = await fetch(url).then((r) => r.json());
      const firstProps = geo.features?.[0]?.properties ?? {};
      const nameKey =
        ['name', 'NAME', 'nom', 'nome', 'nombre', 'NOMBRE', 'NAME_1'].find(
          (k) => firstProps[k] !== undefined,
        ) ?? 'name';
      const entry = { geo, nameKey };
      this.geojsonCache.set(country, entry);
      this.loading = false;
      if (country === this.activeCountry && this.payload?.regions?.length) {
        this.render(entry);
      }
    } catch (e) {
      this.error = `Failed to load map for "${country}": ${(e as Error).message}`;
      this.loading = false;
    }
  }

  render(entry?: { geo: any; nameKey: string }): void {
    const cached = entry ?? this.geojsonCache.get(this.activeCountry);
    if (!this.plotDiv?.nativeElement || !cached) return;
    if (typeof Plotly === 'undefined') {
      this.error = 'Plotly not loaded.';
      return;
    }

    const { geo, nameKey } = cached;
    const dataRegions = this.payload?.regions ?? [];

    // Build a lookup from region name → data so we can include ALL GeoJSON
    // features in the trace. Unmatched regions get NaN (rendered as no-fill)
    // which keeps the full country outline visible.
    const dataMap = new Map(dataRegions.map((r) => [r.name, r]));
    const allFeatureNames: string[] = geo.features.map(
      (f: any) => f.properties[nameKey] as string,
    );

    const locations: string[] = [];
    const z: number[] = [];
    const text: string[] = [];

    for (const name of allFeatureNames) {
      const r = dataMap.get(name);
      locations.push(name);
      z.push(r ? r.value : NaN);
      text.push(r ? (r.label ?? `${name}: ${r.value}`) : name);
    }

    const definedValues = z.filter((v) => !isNaN(v));
    const min = definedValues.length ? Math.min(...definedValues) : 0;
    const max = definedValues.length ? Math.max(...definedValues) : 1;

    const trace = {
      type: 'choropleth',
      geojson: { type: geo.type, features: geo.features },
      featureidkey: `properties.${nameKey}`,
      locations,
      z,
      text,
      hovertemplate: '%{text}<extra></extra>',
      colorscale: COLOR_SCALE,
      zmin: min,
      zmax: max,
      colorbar: { len: 0.7, thickness: 14 },
      marker: { line: { color: 'white', width: 0.8 } },
    };

    const layout = {
      geo: {
        // 'world' scope + fitbounds:'geojson' works for any country worldwide.
        // 'europe' scope would clip non-European countries (e.g. Colombia).
        scope: 'world',
        fitbounds: 'geojson',
        visible: false,
        showland: true, landcolor: '#f8f6f0',
        showocean: true, oceancolor: '#EAF3FB',
        showcountries: true, countrycolor: '#dddddd', countrywidth: 0.5,
        showcoastlines: true, coastlinecolor: '#cccccc', coastlinewidth: 0.5,
      },
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: 'transparent',
      font: { family: 'Arial, sans-serif', size: 12 },
    };

    Plotly.react(this.plotDiv.nativeElement, [trace], layout, {
      displayModeBar: false,
      responsive: true,
    });
  }
}
