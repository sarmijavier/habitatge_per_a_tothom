import { Injectable, Logger } from '@nestjs/common';

export const COUNTRY_ISO3: Record<string, string> = {
  // ── Europe ──────────────────────────────────────────────────────────────────
  albania: 'ALB', andorra: 'AND', austria: 'AUT', belarus: 'BLR',
  belgium: 'BEL', 'bosnia-and-herzegovina': 'BIH', bulgaria: 'BGR',
  croatia: 'HRV', cyprus: 'CYP', 'czech-republic': 'CZE', denmark: 'DNK',
  estonia: 'EST', finland: 'FIN', france: 'FRA', germany: 'DEU',
  greece: 'GRC', hungary: 'HUN', iceland: 'ISL', ireland: 'IRL',
  italy: 'ITA', kosovo: 'XKX', latvia: 'LVA', liechtenstein: 'LIE',
  lithuania: 'LTU', luxembourg: 'LUX', malta: 'MLT', moldova: 'MDA',
  monaco: 'MCO', montenegro: 'MNE', netherlands: 'NLD',
  'north-macedonia': 'MKD', norway: 'NOR', poland: 'POL', portugal: 'PRT',
  romania: 'ROU', russia: 'RUS', serbia: 'SRB', slovakia: 'SVK',
  slovenia: 'SVN', spain: 'ESP', sweden: 'SWE', switzerland: 'CHE',
  turkey: 'TUR', ukraine: 'UKR', 'united-kingdom': 'GBR',
  // ── Americas ────────────────────────────────────────────────────────────────
  argentina: 'ARG', bahamas: 'BHS', barbados: 'BRB', belize: 'BLZ',
  bolivia: 'BOL', brazil: 'BRA', canada: 'CAN', chile: 'CHL',
  colombia: 'COL', 'costa-rica': 'CRI', cuba: 'CUB',
  'dominican-republic': 'DOM', ecuador: 'ECU', 'el-salvador': 'SLV',
  guatemala: 'GTM', guyana: 'GUY', haiti: 'HTI', honduras: 'HND',
  jamaica: 'JAM', mexico: 'MEX', nicaragua: 'NIC', panama: 'PAN',
  paraguay: 'PRY', peru: 'PER', suriname: 'SUR',
  'trinidad-and-tobago': 'TTO', 'united-states': 'USA', uruguay: 'URY',
  venezuela: 'VEN',
  // ── Asia ────────────────────────────────────────────────────────────────────
  afghanistan: 'AFG', armenia: 'ARM', azerbaijan: 'AZE', bahrain: 'BHR',
  bangladesh: 'BGD', bhutan: 'BTN', brunei: 'BRN', cambodia: 'KHM',
  china: 'CHN', georgia: 'GEO', india: 'IND', indonesia: 'IDN',
  iran: 'IRN', iraq: 'IRQ', israel: 'ISR', japan: 'JPN', jordan: 'JOR',
  kazakhstan: 'KAZ', kuwait: 'KWT', kyrgyzstan: 'KGZ', laos: 'LAO',
  lebanon: 'LBN', malaysia: 'MYS', maldives: 'MDV', mongolia: 'MNG',
  myanmar: 'MMR', nepal: 'NPL', 'north-korea': 'PRK', oman: 'OMN',
  pakistan: 'PAK', philippines: 'PHL', qatar: 'QAT',
  'saudi-arabia': 'SAU', singapore: 'SGP', 'south-korea': 'KOR',
  'sri-lanka': 'LKA', syria: 'SYR', taiwan: 'TWN', tajikistan: 'TJK',
  thailand: 'THA', 'timor-leste': 'TLS', turkmenistan: 'TKM',
  'united-arab-emirates': 'ARE', uzbekistan: 'UZB', vietnam: 'VNM',
  yemen: 'YEM',
  // ── Africa ──────────────────────────────────────────────────────────────────
  algeria: 'DZA', angola: 'AGO', benin: 'BEN', botswana: 'BWA',
  'burkina-faso': 'BFA', burundi: 'BDI', cameroon: 'CMR',
  'cape-verde': 'CPV', 'central-african-republic': 'CAF', chad: 'TCD',
  comoros: 'COM', congo: 'COG', 'democratic-republic-of-congo': 'COD',
  djibouti: 'DJI', egypt: 'EGY', 'equatorial-guinea': 'GNQ',
  eritrea: 'ERI', ethiopia: 'ETH', gabon: 'GAB', gambia: 'GMB',
  ghana: 'GHA', guinea: 'GIN', 'guinea-bissau': 'GNB',
  'ivory-coast': 'CIV', kenya: 'KEN', lesotho: 'LSO', liberia: 'LBR',
  libya: 'LBY', madagascar: 'MDG', malawi: 'MWI', mali: 'MLI',
  mauritania: 'MRT', mauritius: 'MUS', morocco: 'MAR',
  mozambique: 'MOZ', namibia: 'NAM', niger: 'NER', nigeria: 'NGA',
  rwanda: 'RWA', senegal: 'SEN', 'sierra-leone': 'SLE', somalia: 'SOM',
  'south-africa': 'ZAF', 'south-sudan': 'SSD', sudan: 'SDN',
  tanzania: 'TZA', togo: 'TGO', tunisia: 'TUN', uganda: 'UGA',
  zambia: 'ZMB', zimbabwe: 'ZWE',
  // ── Oceania ─────────────────────────────────────────────────────────────────
  australia: 'AUS', fiji: 'FJI', 'new-zealand': 'NZL',
  'papua-new-guinea': 'PNG', 'solomon-islands': 'SLB',
};

const GADM_URL = (iso3: string) =>
  `https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${iso3}_1.json`;

const SPAIN_URL =
  'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/spain-communities.geojson';

const NAME_KEYS = ['name', 'NAME', 'nom', 'nome', 'nombre', 'NOMBRE', 'NAME_1'];

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private readonly cache = new Map<string, { geo: unknown; nameKey: string; names: string[] }>();

  async getEntry(country: string): Promise<{ geo: unknown; nameKey: string; names: string[] }> {
    const key = country.toLowerCase();
    if (this.cache.has(key)) return this.cache.get(key)!;

    const url = this.resolveUrl(key);
    this.logger.log(`Fetching GeoJSON for "${key}" → ${url}`);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Upstream ${resp.status} for ${url}`);
    const geo = await resp.json() as { features: Array<{ properties: Record<string, unknown> }> };

    const firstProps = geo.features?.[0]?.properties ?? {};
    const nameKey = NAME_KEYS.find((k) => firstProps[k] !== undefined) ?? 'name';
    const names = geo.features
      .map((f) => f.properties[nameKey] as string)
      .filter(Boolean);

    const entry = { geo, nameKey, names };
    this.cache.set(key, entry);
    return entry;
  }

  async getRegionNames(country: string): Promise<string[]> {
    try {
      return (await this.getEntry(country)).names;
    } catch (e) {
      this.logger.error(`getRegionNames("${country}") failed: ${(e as Error).message}`);
      return [];
    }
  }

  resolveUrl(key: string): string {
    if (key === 'spain') return SPAIN_URL;
    const iso3 = COUNTRY_ISO3[key];
    if (iso3) return GADM_URL(iso3);
    if (/^[a-z]{3}$/i.test(key)) return GADM_URL(key.toUpperCase());
    this.logger.warn(`Unknown country "${key}", falling back to Spain`);
    return SPAIN_URL;
  }
}
