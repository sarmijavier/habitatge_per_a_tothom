import { DashboardCommand } from './chat.types';

export interface WidgetDef {
  tool: {
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    };
  };
  /**
   * System prompt used in the generator step.
   * At this point the AI already knows which widget to use — this prompt
   * only needs to focus on producing high-quality data for that specific widget.
   */
  generatorPrompt: string;
  build: (args: Record<string, unknown>) => DashboardCommand | null;
  reply: string;
}

export const WIDGET_REGISTRY: Record<string, WidgetDef> = {
  render_chart: {
    tool: {
      type: 'function',
      function: {
        name: 'render_chart',
        description: 'Render a bar chart with numerical data on the dashboard.',
        parameters: {
          type: 'object',
          properties: {
            label: { type: 'string', description: 'Chart title' },
            data: {
              type: 'array',
              items: { type: 'number' },
              description: 'Array of numerical values to plot',
            },
          },
          required: ['label', 'data'],
        },
      },
    },
    generatorPrompt: `You are generating a bar chart widget for a dashboard.
Your only task is to call the render_chart tool with accurate numerical data based on the user's request.
- Use real numbers from your knowledge. Do not make up implausible values.
- Keep the data array to 3–10 values for readability.
- Write a concise, descriptive label.
You MUST call render_chart. Do not write any explanation — just call the tool.
Always respond in the same language the user writes in.`,
    build: (args) => ({
      type: 'render_chart',
      payload: { label: args['label'] as string, data: args['data'] as number[] },
    }),
    reply: 'Here is your chart.',
  },

  render_text: {
    tool: {
      type: 'function',
      function: {
        name: 'render_text',
        description: 'Render a text card with a title and body on the dashboard.',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Card title' },
            body: { type: 'string', description: 'Card body text' },
          },
          required: ['title', 'body'],
        },
      },
    },
    generatorPrompt: `You are generating a text card widget for a dashboard.
Your only task is to call the render_text tool with a clear title and informative body.
- Title: short (3–6 words), descriptive.
- Body: 2–4 sentences, factual and concise. No bullet points, no markdown.
You MUST call render_text. Do not write any explanation — just call the tool.
Always respond in the same language the user writes in.`,
    build: (args) => ({
      type: 'render_text',
      payload: { title: args['title'] as string, body: args['body'] as string },
    }),
    reply: 'Here is your text card.',
  },

  render_table: {
    tool: {
      type: 'function',
      function: {
        name: 'render_table',
        description: 'Render a table with columns and rows on the dashboard.',
        parameters: {
          type: 'object',
          properties: {
            columns: {
              type: 'array',
              items: { type: 'string' },
              description: 'Column header names',
            },
            rows: {
              type: 'array',
              items: { type: 'array', items: { type: 'string' } },
              description: 'Table rows, each an array of string values',
            },
          },
          required: ['columns', 'rows'],
        },
      },
    },
    generatorPrompt: `You are generating a data table widget for a dashboard.
Your only task is to call the render_table tool with well-structured data.
- Use 2–6 columns with clear, short header names.
- Include 3–10 rows of real, accurate data.
- All values must be strings (numbers as "42", percentages as "12.5%").
You MUST call render_table. Do not write any explanation — just call the tool.
Always respond in the same language the user writes in.`,
    build: (args) => ({
      type: 'render_table',
      payload: { columns: args['columns'] as string[], rows: args['rows'] as string[][] },
    }),
    reply: 'Here is your table.',
  },

  render_map: {
    tool: {
      type: 'function',
      function: {
        name: 'render_map',
        description: 'Render a choropleth map of any country with regional data.',
        parameters: {
          type: 'object',
          properties: {
            country: {
              type: 'string',
              description:
                'Country key: lowercase English name with hyphens for spaces (e.g. spain, france, czech-republic, united-states, south-korea, brazil, japan, south-africa, australia). Any country in the world is supported.',
            },
            title: { type: 'string', description: 'Map title' },
            year: { type: 'number', description: 'Year the data represents' },
            regions: {
              type: 'array',
              description: 'Data for each administrative region. Names must match the GeoJSON for the chosen country.',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Region name (must match GeoJSON)' },
                  value: { type: 'number', description: 'Numeric value for this region' },
                  label: { type: 'string', description: 'Hover text, e.g. "Madrid: 148"' },
                },
                required: ['name', 'value'],
              },
            },
          },
          required: ['country', 'regions'],
        },
      },
    },
    // NOTE: this static prompt is only used as a last-resort fallback.
    // ChatService.generateMap() builds a dynamic prompt that injects the real
    // GADM region names for the specific country at request time.
    generatorPrompt: `You are generating a regional map widget for a dashboard.
Your only task is to call the render_map tool with accurate regional data.

Set "country" to the lowercase-English-kebab-case name of the country
(e.g. spain, france, czech-republic, united-states, colombia, japan).

Use region names that EXACTLY match GADM level-1 NAME_1 values for the chosen country.
For the countries listed below the exact names are provided — copy them character-for-character
(including accents and no-space concatenations like "GrandEst" or "KrajVysočina"):

spain:
  Andalucia, Aragon, Asturias, Baleares, Canarias, Cantabria, Castilla-Leon,
  Castilla-La Mancha, Cataluña, Valencia, Extremadura, Galicia, La Rioja,
  Madrid, Murcia, Navarra, Pais Vasco

france:
  Auvergne-Rhône-Alpes, Bourgogne-Franche-Comté, Bretagne, Centre-ValdeLoire,
  Corse, GrandEst, Hauts-de-France, Île-de-France, Normandie,
  Nouvelle-Aquitaine, Occitanie, PaysdelaLoire, Provence-Alpes-Côted'Azur

germany:
  Baden-Württemberg, Bayern, Berlin, Brandenburg, Bremen, Hamburg, Hessen,
  Mecklenburg-Vorpommern, Niedersachsen, Nordrhein-Westfalen, Rheinland-Pfalz,
  Saarland, Sachsen, Sachsen-Anhalt, Schleswig-Holstein, Thüringen

italy:
  Abruzzo, Apulia, Basilicata, Calabria, Campania, Emilia-Romagna,
  Friuli-VeneziaGiulia, Lazio, Liguria, Lombardia, Marche, Molise, Piemonte,
  Sardegna, Sicily, Toscana, Trentino-AltoAdige, Umbria, Valled'Aosta, Veneto

portugal:
  Aveiro, Azores, Beja, Braga, Bragança, CasteloBranco, Coimbra, Évora, Faro,
  Guarda, Leiria, Lisboa, Madeira, Portalegre, Porto, Santarém, Setúbal,
  VianadoCastelo, VilaReal, Viseu

netherlands:
  Drenthe, Flevoland, Fryslân, Gelderland, Groningen, Limburg, Noord-Brabant,
  Noord-Holland, Overijssel, Utrecht, Zeeland

austria:
  Burgenland, Kärnten, Niederösterreich, Oberösterreich, Salzburg, Steiermark,
  Tirol, Vorarlberg, Wien

switzerland:
  Aargau, AppenzellAusserrhoden, AppenzellInnerrhoden, Basel-Landschaft,
  Basel-Stadt, Bern, Fribourg, Genève, Glarus, Graubünden, Jura, Lucerne,
  Neuchâtel, Nidwalden, Obwalden, SanktGallen, Schaffhausen, Schwyz, Solothurn,
  Thurgau, Ticino, Uri, Valais, Vaud, Zug, Zürich

poland:
  Dolnośląskie, Kujawsko-Pomorskie, Łódzkie, Lubelskie, Lubuskie, Małopolskie,
  Mazowieckie, Opolskie, Podkarpackie, Podlaskie, Pomorskie, Śląskie,
  Świętokrzyskie, Warmińsko-Mazurskie, Wielkopolskie, Zachodniopomorskie

czech-republic:
  Jihočeský, Jihomoravský, Karlovarský, KrajVysočina, Královéhradecký,
  Liberecký, Moravskoslezský, Olomoucký, Pardubický, Plzeňský, Prague,
  Středočeský, Ústecký, Zlínský

sweden:
  Blekinge, Dalarna, Gävleborg, Gotland, Halland, Jämtland, Jönköping, Kalmar,
  Kronoberg, Norrbotten, Orebro, Östergötland, Skåne, Södermanland, Stockholm,
  Uppsala, Värmland, Västerbotten, Västernorrland, Västmanland, VästraGötaland

norway:
  Akershus, Aust-Agder, Buskerud, Finnmark, Hedmark, Hordaland, MøreogRomsdal,
  Nord-Trøndelag, Nordland, Oppland, Oslo, Rogaland, SognogFjordane,
  Sør-Trøndelag, Telemark, Troms, Vest-Agder, Vestfold, Østfold

finland:
  EasternFinland, Lapland, Oulu, SouthernFinland, WesternFinland

denmark:
  Hovedstaden, Midtjylland, Nordjylland, Sjælland, Syddanmark

belgium:
  Bruxelles, Vlaanderen, Wallonie

hungary:
  Bács-Kiskun, Baranya, Békés, Borsod-Abaúj-Zemplén, Budapest, Csongrád,
  Fejér, Gyor-Moson-Sopron, Hajdú-Bihar, Heves, Jász-Nagykun-Szolnok,
  Komárom-Esztergom, Nógrád, Pest, Somogy, Szabolcs-Szatmár-Bereg,
  Tolna, Vas, Veszprém, Zala

romania:
  Alba, Arad, Argeș, Bacău, Bihor, Bistrița-Năsăud, Botoșani, Brăila, Brașov,
  Bucharest, Buzău, Călărași, Caraș-Severin, Cluj, Constanța, Covasna,
  Dâmbovița, Dolj, Galați, Giurgiu, Gorj, Harghita, Hunedoara, Ialomița,
  Iași, Ilfov, Maramureș, Mehedinți, Mureș, Neamț, Olt, Prahova, Sălaj,
  SatuMare, Sibiu, Suceava, Teleorman, Timiș, Tulcea, Vâlcea, Vaslui, Vrancea

croatia:
  Bjelovarska-Bilogorska, Brodsko-Posavska, Dubrovacko-Neretvanska, GradZagreb,
  Istarska, Karlovacka, Koprivničko-Križevačka, Krapinsko-Zagorska, Licko-Senjska,
  Medimurska, Osjecko-Baranjska, Požeško-Slavonska, Primorsko-Goranska,
  Šibensko-Kninska, Sisacko-Moslavacka, Splitsko-Dalmatinska, Varaždinska,
  Viroviticko-Podravska, Vukovarsko-Srijemska, Zadarska, Zagrebačka

slovakia:
  Banskobystrický, Bratislavský, Košický, Nitriansky, Prešovský,
  Trenčiansky, Trnavský, Žilinský

greece:
  Aegean, Attica, Crete, EpirusandWesternMacedonia, MacedoniaandThrace,
  ThessalyandCentralGreece

bulgaria:
  Blagoevgrad, Burgas, Dobrich, Gabrovo, GradSofiya, Haskovo, Kardzhali,
  Kyustendil, Lovech, Montana, Pazardzhik, Pernik, Pleven, Plovdiv, Razgrad,
  Ruse, Shumen, Silistra, Sliven, Smolyan, Sofia, StaraZagora, Targovishte,
  Varna, VelikoTarnovo, Vidin, Vratsa, Yambol

united-states:
  Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut,
  Delaware, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas,
  Kentucky, Louisiana, Maine, Maryland, Massachusetts, Michigan, Minnesota,
  Mississippi, Missouri, Montana, Nebraska, Nevada, NewHampshire, NewJersey,
  NewMexico, NewYork, NorthCarolina, NorthDakota, Ohio, Oklahoma, Oregon,
  Pennsylvania, RhodeIsland, SouthCarolina, SouthDakota, Tennessee, Texas,
  Utah, Vermont, Virginia, Washington, WestVirginia, Wisconsin, Wyoming

brazil:
  Acre, Alagoas, Amapá, Amazonas, Bahia, Ceará, DistritoFederal, EspíritoSanto,
  Goiás, Maranhão, MatoGrosso, MatoGrossodoSul, MinasGerais, Pará, Paraíba,
  Paraná, Pernambuco, Piauí, RiodeJaneiro, RioGrandedoNorte, RioGrandedoSul,
  Rondônia, Roraima, SantaCatarina, SãoPaulo, Sergipe, Tocantins

canada:
  Alberta, BritishColumbia, Manitoba, NewBrunswick, NewfoundlandandLabrador,
  NorthwestTerritories, NovaScotia, Nunavut, Ontario, PrinceEdwardIsland,
  Québec, Saskatchewan, Yukon

australia:
  AustralianCapitalTerritory, NewSouthWales, NorthernTerritory, Queensland,
  SouthAustralia, Tasmania, Victoria, WesternAustralia

china:
  Anhui, Beijing, Chongqing, Fujian, Gansu, Guangdong, Guangxi, Guizhou,
  Hainan, Hebei, Heilongjiang, Henan, Hubei, Hunan, InnerMongolia, Jiangsu,
  Jiangxi, Jilin, Liaoning, Ningxia, Qinghai, Shaanxi, Shandong, Shanghai,
  Shanxi, Sichuan, Tianjin, Tibet, Xinjiang, Yunnan, Zhejiang

india:
  AndamanandNicobarIslands, AndhraPradesh, ArunachalPradesh, Assam, Bihar,
  Chandigarh, Chhattisgarh, DadraandNagarHaveliandDamanandDiu, Delhi, Goa,
  Gujarat, Haryana, HimachalPradesh, JammuandKashmir, Jharkhand, Karnataka,
  Kerala, Ladakh, Lakshadweep, MadhyaPradesh, Maharashtra, Manipur, Meghalaya,
  Mizoram, Nagaland, Odisha, Puducherry, Punjab, Rajasthan, Sikkim,
  TamilNadu, Telangana, Tripura, UttarPradesh, Uttarakhand, WestBengal

russia:
  Adygeya, Altay, Altayskiy, Amurskaya, Arkhangelskaya, Astrakhanskaya,
  Bashkortostan, Belgorodskaya, Bryanskaya, Buryatiya, Chechnya,
  Chelyabinskaya, Chukotskiy, Chuvashiya, Dagestan, Ingushetiya,
  Irkutskaya, Ivanovskaya, Kabardino-Balkariya, Kaliningradskaya,
  Kalmykiya, Kaluzhskaya, Kamchatskiy, Karachayevo-Cherkesiya, Kareliya,
  Kemerovskaya, Khabarovskiy, Khakasiya, Khanty-Mansiyskiy, Kirovskaya,
  Komi, Kostromskaya, Krasnodarskiy, Krasnoyarskiy, Kurganskaya,
  Kurskaya, Leningradskaya, Lipetskaya, Magadanskaya, Mariy-El, Mordoviya,
  Moskovskaya, Moskva, Murmanskaya, Nenetskiy, NizhniNovgorod, Novgorodskaya,
  Novosibirskaya, Omskaya, Orenburgskaya, Orlovskaya, Penzenskaya,
  Permskiy, Primorskiy, Pskovskaya, Rostovskaya, Ryazanskaya, Sakha,
  Sakhalinskaya, Samarskaya, Sankt-Peterburg, Saratovskaya, Severnaya-Osetiya,
  Smolenskaya, Stavropolskiy, Sverdlovskaya, Tambovskaya, Tatarstan,
  Tomskaya, Tulskaya, Tverskaya, Tyumenskaya, Tyva, Udmurtiya,
  Ulyanovskaya, Vladimirskaya, Volgogradskaya, Vologodskaya, Voronezhskaya,
  Yamalo-Nenetskiy, Yaroslavskaya, Yevrey, Zabaykalskiy

japan:
  Aichi, Akita, Aomori, Chiba, Ehime, Fukui, Fukuoka, Fukushima, Gifu,
  Gunma, Hiroshima, Hokkaido, Hyogo, Ibaraki, Ishikawa, Iwate, Kagawa,
  Kagoshima, Kanagawa, Kochi, Kumamoto, Kyoto, Mie, Miyagi, Miyazaki,
  Nagano, Nagasaki, Nara, Niigata, Oita, Okayama, Okinawa, Osaka, Saga,
  Saitama, Shiga, Shimane, Shizuoka, Tochigi, Tokushima, Tokyo, Tottori,
  Toyama, Wakayama, Yamagata, Yamaguchi, Yamanashi

mexico:
  Aguascalientes, BajaCalifornia, BajaCaliforniaSur, Campeche, Chiapas,
  Chihuahua, Coahuila, Colima, DistritoFederal, Durango, Guanajuato,
  Guerrero, Hidalgo, Jalisco, México, Michoacán, Morelos, Nayarit,
  NuevoLeón, Oaxaca, Puebla, Querétaro, QuintanaRoo, SanLuisPotosí,
  Sinaloa, Sonora, Tabasco, Tamaulipas, Tlaxcala, Veracruz, Yucatán,
  Zacatecas

south-africa:
  EasternCape, FreeState, Gauteng, KwaZulu-Natal, Limpopo, Mpumalanga,
  NorthWest, NorthernCape, WesternCape

For any other country not listed above, use the standard GADM level-1 administrative
region names in their official language or common English transliteration.

Rules:
- Use real, accurate data from your knowledge.
- Set a descriptive title and the year the data represents.
- For each region include a label, e.g. "Praha: 1.5%" or "Texas: 2.1%".
- Cover as many regions as you know data for.
You MUST call render_map. Do not write any explanation — just call the tool.
Always respond in the same language the user writes in.`,
    build: (args) => ({
      type: 'render_map',
      payload: {
        country: (args['country'] as string | undefined) ?? 'spain',
        title: args['title'] as string | undefined,
        year: args['year'] as number | undefined,
        regions: args['regions'] as Array<{ name: string; value: number; label?: string }>,
      },
    }),
    reply: 'Here is the map.',
  },

  clear: {
    tool: {
      type: 'function',
      function: {
        name: 'clear',
        description: 'Clear all widgets from the dashboard.',
        parameters: { type: 'object', properties: {} },
      },
    },
    generatorPrompt: '', // clear never reaches the generator step
    build: () => ({ type: 'clear' }),
    reply: 'Dashboard cleared.',
  },
};
