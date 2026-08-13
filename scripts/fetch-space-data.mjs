import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.join(process.cwd(), 'public', 'data');
const generatedAt = new Date().toISOString();
const EXOPLANET_QUERY_LIMIT = 7000;

const HOME_STATS_FALLBACK = {
  schemaVersion: 1,
  generatedAt: '2026-06-21T21:10:28.916Z',
  source: 'Bundled AstroBis reference snapshot',
  exoplanetQuery: 'select count(pl_name) from ps where default_flag = 1',
  stats: {
    confirmedExoplanets: 6298,
    oortInnerAu: 1000,
    oortOuterAu: 100000,
    universeAgeGyr: 13.8,
    solarSystemPlanets: 8,
  },
};

const MARS_MAP_SNAPSHOT = {
  schemaVersion: 1,
  generatedAt,
  body: {
    name: 'Mars',
    radiusKm: 3389.5,
    equatorialRadiusKm: 3396.2,
    polarRadiusKm: 3376.2,
    massKg: 6.4171e23,
    gravityMs2: 3.71,
    escapeVelocityKms: 5.03,
    meanDistanceAu: 1.523679,
    orbitalPeriodDays: 686.98,
    solHours: 24.6597,
    axialTiltDeg: 25.19,
    knownMoons: 2,
    moons: ['Phobos', 'Deimos'],
    atmosphere: 'Thin CO2-dominated atmosphere with dust, water-ice clouds, and strong seasonal effects.',
    surface: 'Basaltic crust, iron-oxide dust, volcanic provinces, canyon systems, impact basins, polar layered deposits, and ancient water-modified terrain.',
  },
  textures: {
    localSurfaceUrl: 'assets/mars-texture.jpg',
    localHeightmapUrl: 'assets/mars-mola-heightmap.png',
    localHillshadeUrl: 'assets/mars-mola-hillshade.jpg',
    surfaceUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_mars.jpg',
    surfaceCredit: 'Solar System Scope / Wikimedia Commons Mars texture map',
    heightmapUrl: 'https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg016/megt90n000eb.img',
    heightmapLabelUrl: 'https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg016/megt90n000eb.lbl',
    heightmapCredit: 'NASA PDS Mars Global Surveyor MOLA MEGDR median topography',
    elevationRangeMeters: { min: -8177, max: 21171 },
    heightmapResolution: '5760 x 2880 samples at 16 pixels per degree, resampled to a 2048 x 1024 WebGL displacement map',
    textureNote: 'Surface color is a public global texture; 3D terrain and relief shading are derived from NASA PDS MOLA topography and vertically exaggerated for readability.',
  },
  sources: [
    {
      id: 'nasa-mars-facts',
      label: 'NASA Mars facts',
      url: 'https://science.nasa.gov/mars/facts/',
      note: 'Planetary constants, day length, gravity, orbit, and moon context.',
    },
    {
      id: 'nasa-mars-trek',
      label: 'NASA Mars Trek',
      url: 'https://trek.nasa.gov/mars/',
      note: 'Reference portal for Mars surface mapping, contextual layers, and mission geography.',
    },
    {
      id: 'nasa-pds-mola-megdr',
      label: 'NASA PDS MOLA MEGDR',
      url: 'https://pds-geosciences.wustl.edu/missions/mgs/megdr.html',
      note: 'Mars Global Surveyor laser-altimeter topography used for the WebGL terrain displacement and hillshade.',
    },
    {
      id: 'usgs-nomenclature',
      label: 'IAU / USGS Gazetteer of Planetary Nomenclature',
      url: 'https://planetarynames.wr.usgs.gov/',
      note: 'Named planetary features and coordinate references.',
    },
    {
      id: 'texture-source',
      label: 'Solar System Scope textures',
      url: 'https://www.solarsystemscope.com/textures/',
      note: 'Public planet texture maps used where available for real-time WebGL visualization.',
    },
  ],
  features: [
    {
      id: 'olympus-mons',
      name: 'Olympus Mons',
      type: 'volcano',
      lat: 18.65,
      lon: -133.8,
      scale: 'about 600 km wide; summit about 21.9 km above Mars datum',
      priority: 'major',
      summary: 'Largest known volcano in the Solar System, located on the Tharsis rise.',
      source: 'IAU/USGS nomenclature and NASA Mars reference mapping',
    },
    {
      id: 'valles-marineris',
      name: 'Valles Marineris',
      type: 'canyon system',
      lat: -14.0,
      lon: -60.0,
      scale: 'more than 4,000 km long and up to about 7 km deep',
      priority: 'major',
      summary: 'A vast equatorial canyon system that exposes tectonic and erosional history.',
      source: 'NASA Mars Trek / IAU feature reference',
    },
    {
      id: 'hellas-planitia',
      name: 'Hellas Planitia',
      type: 'impact basin',
      lat: -42.4,
      lon: 70.5,
      scale: 'about 2,300 km wide; one of the deepest basins on Mars',
      priority: 'major',
      summary: 'Ancient southern-hemisphere impact basin with a strong topographic signature.',
      source: 'NASA Mars reference mapping / USGS feature nomenclature',
    },
    {
      id: 'argyre-planitia',
      name: 'Argyre Planitia',
      type: 'impact basin',
      lat: -49.7,
      lon: -44.0,
      scale: 'about 1,800 km wide',
      priority: 'major',
      summary: 'Large southern highland basin surrounded by rugged ancient terrain.',
      source: 'NASA Mars Trek / USGS feature nomenclature',
    },
    {
      id: 'gale-crater',
      name: 'Gale Crater',
      type: 'crater',
      lat: -5.4,
      lon: 137.8,
      scale: 'about 154 km diameter',
      priority: 'mission',
      summary: 'Curiosity rover landing region; layered Mount Sharp records long environmental change.',
      source: 'NASA Mars Science Laboratory landing-site reference',
    },
    {
      id: 'jezero-crater',
      name: 'Jezero Crater',
      type: 'crater / delta',
      lat: 18.38,
      lon: 77.58,
      scale: 'about 45 km diameter',
      priority: 'mission',
      summary: 'Perseverance rover landing region containing an ancient river-delta system.',
      source: 'NASA Mars 2020 landing-site reference',
    },
    {
      id: 'utopia-planitia',
      name: 'Utopia Planitia',
      type: 'impact basin / plain',
      lat: 46.7,
      lon: 117.5,
      scale: 'about 3,300 km basin scale',
      priority: 'mission',
      summary: 'Northern plains region visited by Viking 2 and Zhurong.',
      source: 'NASA / IAU planetary nomenclature',
    },
    {
      id: 'isidis-planitia',
      name: 'Isidis Planitia',
      type: 'impact basin',
      lat: 12.9,
      lon: 87.0,
      scale: 'about 1,500 km wide',
      priority: 'major',
      summary: 'Large basin east of Syrtis Major, near the Jezero landing region.',
      source: 'USGS planetary nomenclature',
    },
    {
      id: 'syrtis-major',
      name: 'Syrtis Major Planum',
      type: 'volcanic province',
      lat: 8.4,
      lon: 69.5,
      scale: 'broad dark volcanic province',
      priority: 'major',
      summary: 'A classic telescopic albedo feature and ancient volcanic plateau.',
      source: 'IAU/USGS feature reference',
    },
    {
      id: 'nili-fossae',
      name: 'Nili Fossae',
      type: 'fracture / mineral region',
      lat: 21.0,
      lon: 74.0,
      scale: 'regional fracture system',
      priority: 'science',
      summary: 'Carbonate- and clay-bearing terrain important for ancient-water studies.',
      source: 'NASA Mars mineralogy context / USGS nomenclature',
    },
    {
      id: 'elysium-mons',
      name: 'Elysium Mons',
      type: 'volcano',
      lat: 25.0,
      lon: 147.2,
      scale: 'about 240 km wide; about 13 km high',
      priority: 'major',
      summary: 'Major shield volcano in the Elysium volcanic province.',
      source: 'USGS planetary nomenclature',
    },
    {
      id: 'tharsis-montes',
      name: 'Tharsis Montes',
      type: 'volcanic chain',
      lat: -1.0,
      lon: -112.0,
      scale: 'three giant shield volcanoes spanning the Tharsis region',
      priority: 'major',
      summary: 'Arsia, Pavonis, and Ascraeus Montes form a major volcanic alignment.',
      source: 'NASA Mars Trek / USGS feature reference',
    },
    {
      id: 'noctis-labyrinthus',
      name: 'Noctis Labyrinthus',
      type: 'fractured terrain',
      lat: -7.0,
      lon: -102.0,
      scale: 'maze-like trough system west of Valles Marineris',
      priority: 'science',
      summary: 'Complex collapsed and faulted terrain marking the transition from Tharsis to Valles Marineris.',
      source: 'USGS planetary nomenclature',
    },
    {
      id: 'korolev-crater',
      name: 'Korolev Crater',
      type: 'ice-filled crater',
      lat: 73.0,
      lon: 164.5,
      scale: 'about 82 km diameter',
      priority: 'science',
      summary: 'Northern crater famous for a persistent water-ice deposit.',
      source: 'ESA/NASA Mars surface reference and USGS feature coordinates',
    },
    {
      id: 'planum-boreum',
      name: 'Planum Boreum',
      type: 'north polar layered deposits',
      lat: 87.0,
      lon: 0.0,
      scale: 'north polar ice cap region',
      priority: 'polar',
      summary: 'Layered water-ice and dust deposits recording climate cycles.',
      source: 'NASA Mars polar science context',
    },
    {
      id: 'planum-australe',
      name: 'Planum Australe',
      type: 'south polar layered deposits',
      lat: -83.9,
      lon: 160.0,
      scale: 'south polar ice cap region',
      priority: 'polar',
      summary: 'Southern polar layered deposits and seasonal CO2 frost region.',
      source: 'NASA Mars polar science context',
    },
  ],
  landingSites: [
    { id: 'viking-1', name: 'Viking 1', agency: 'NASA', status: 'landed 1976', lat: 22.48, lon: -47.97, summary: 'First successful U.S. Mars lander in Chryse Planitia.' },
    { id: 'viking-2', name: 'Viking 2', agency: 'NASA', status: 'landed 1976', lat: 47.97, lon: 134.27, summary: 'Utopia Planitia lander that operated through 1980.' },
    { id: 'pathfinder', name: 'Mars Pathfinder / Sojourner', agency: 'NASA', status: 'landed 1997', lat: 19.13, lon: -33.22, summary: 'Demonstrated low-cost landing and rover operations in Ares Vallis.' },
    { id: 'spirit', name: 'Spirit', agency: 'NASA', status: 'landed 2004', lat: -14.57, lon: 175.48, summary: 'MER rover that explored Gusev Crater and Columbia Hills.' },
    { id: 'opportunity', name: 'Opportunity', agency: 'NASA', status: 'landed 2004', lat: -1.95, lon: -5.53, summary: 'MER rover that crossed Meridiani Planum and Endeavour Crater.' },
    { id: 'phoenix', name: 'Phoenix', agency: 'NASA', status: 'landed 2008', lat: 68.22, lon: -125.75, summary: 'Polar lander that sampled near-surface water ice.' },
    { id: 'curiosity', name: 'Curiosity', agency: 'NASA', status: 'landed 2012 / active rover', lat: -4.5895, lon: 137.4417, summary: 'Mars Science Laboratory rover studying Gale Crater and Mount Sharp.' },
    { id: 'insight', name: 'InSight', agency: 'NASA', status: 'landed 2018 / completed', lat: 4.502, lon: 135.623, summary: 'Geophysical lander that measured marsquakes and interior structure.' },
    { id: 'perseverance', name: 'Perseverance', agency: 'NASA', status: 'landed 2021 / active rover', lat: 18.4447, lon: 77.4508, summary: 'Mars 2020 rover caching samples and studying Jezero Crater.' },
    { id: 'zhurong', name: 'Zhurong', agency: 'CNSA', status: 'landed 2021', lat: 25.066, lon: 109.925, summary: 'Tianwen-1 rover landing site in southern Utopia Planitia.' },
  ],
  moons: [
    { name: 'Phobos', radiusKm: 11.1, orbitKm: 9376, orbitalPeriodHours: 7.65, summary: 'Inner, larger moon orbiting faster than a Martian day.' },
    { name: 'Deimos', radiusKm: 6.2, orbitKm: 23463, orbitalPeriodHours: 30.31, summary: 'Outer, smaller moon with a slower, more distant orbit.' },
  ],
  notes: {
    coordinates: 'Feature coordinates are approximate center points in planetographic/IAU-style Mars reference context, normalized to -180 to +180 longitude for the AstroBis map.',
    visualization: 'This is a real-data WebGL atlas, not a rover-scale GIS terrain engine. The surface color, MOLA displacement, MOLA hillshade, markers, polar haze, and labels are separate layers.',
  },
};

const WORLD_OPS_FALLBACK = {
  schemaVersion: 1,
  generatedAt,
  sources: [
    { id: 'fallback', label: 'Bundled AstroBis EarthOps fallback', status: 'fallback', count: 4 },
  ],
  events: [
    {
      id: 'fallback-eonet-hawaii',
      type: 'nasa-event',
      title: 'NASA Earth-event layer unavailable',
      lat: 19.42,
      lon: -155.29,
      severity: 'reference',
      timestamp: generatedAt,
      source: 'offline fallback',
      url: 'https://eonet.gsfc.nasa.gov/',
      summary: 'Fallback marker used only when live public Earth-event feeds cannot be reached during the build.',
    },
    {
      id: 'fallback-quake-pacific',
      type: 'earthquake',
      title: 'USGS earthquake layer unavailable',
      lat: 35.68,
      lon: 139.76,
      severity: 'reference',
      timestamp: generatedAt,
      source: 'offline fallback',
      url: 'https://earthquake.usgs.gov/',
      summary: 'Fallback reference marker used when the USGS GeoJSON feed is unavailable.',
    },
  ],
  satellites: [
    {
      id: 'fallback-iss',
      name: 'ISS (ZARYA)',
      noradId: 25544,
      objectId: '1998-067A',
      group: 'Space stations',
      status: 'station',
      epoch: generatedAt,
      meanMotion: 15.49,
      eccentricity: 0.0007,
      inclination: 51.64,
      raan: 0,
      argumentOfPerigee: 0,
      meanAnomaly: 0,
      altitudeKm: 420,
    },
  ],
  launches: [
    {
      id: 'fallback-launch-ksc',
      name: 'Launch Library feed unavailable',
      net: generatedAt,
      status: 'snapshot fallback',
      provider: 'offline fallback',
      mission: 'Upcoming launch feed could not be reached during the build.',
      pad: 'Kennedy Space Center',
      location: 'Florida, United States',
      lat: 28.5729,
      lon: -80.649,
      url: 'https://ll.thespacedevs.com/',
    },
  ],
  news: [
    {
      id: 'fallback-news',
      title: 'Spaceflight news feed unavailable',
      site: 'offline fallback',
      publishedAt: generatedAt,
      url: 'https://api.spaceflightnewsapi.net/v4/docs/',
      summary: 'AstroBis keeps the last deployed EarthOps snapshot when external news APIs are unreachable.',
      imageUrl: '',
    },
  ],
  media: [],
  stormWatch: {
    generatedAt,
    status: 'fallback',
    radar: {
      source: 'RainViewer public weather maps',
      host: 'https://tilecache.rainviewer.com',
      past: [],
      nowcast: [],
      latest: null,
    },
    satellite: {
      source: 'NASA GIBS public imagery reference',
      status: 'reference',
      product: 'near-real-time satellite imagery tiles',
      url: 'https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api',
      summary: 'NASA GIBS provides near-real-time global satellite imagery layers that can support future deeper tile overlays.',
    },
    advisories: [],
    notes: [
      'Storm Watch uses public near-real-time feeds where available; public radar/satellite products may be delayed.',
    ],
  },
  spaceWeather: {
    observedAt: generatedAt,
    kp: null,
    label: 'NOAA SWPC unavailable',
    status: 'fallback',
    summary: 'Space-weather context is unavailable in the offline fallback snapshot.',
    samples: [],
  },
  opsBrief: {
    id: 'fallback-earthops-brief',
    label: 'AstroBis public-source brief',
    generatedAt,
    mode: 'local public-feed summary',
    confidence: 42,
    headline: 'EarthOps is running on a safe offline reference snapshot.',
    watch: [
      { label: 'Public feeds', value: 'fallback', tone: '#fbbf24', summary: 'Live source data was unavailable during the build.' },
    ],
    bullets: [
      'Fallback markers are displayed until the next successful public-feed refresh.',
      'Launch, news, orbital, hazard, and media layers keep source badges and uncertainty labels visible.',
    ],
  },
  totals: {
    events: 2,
    satellites: 1,
    launches: 1,
    news: 1,
    media: 0,
    spaceWeather: 0,
  },
};

const GDACS_TYPE_LABELS = {
  EQ: 'earthquake',
  TC: 'cyclone',
  FL: 'flood',
  VO: 'volcano',
  DR: 'drought',
};

const CELESTRAK_WORLD_GROUPS = [
  { id: 'stations', label: 'Space stations', status: 'station', limit: 22 },
  { id: 'last-30-days', label: 'Recent launches', status: 'recent-object', limit: 180 },
  { id: 'active', label: 'Active satellites catalogue sample', status: 'satellite', limit: 760 },
  { id: 'geo', label: 'Geostationary belt', status: 'satellite', limit: 260 },
  { id: 'intelsat', label: 'Intelsat fleet', status: 'satellite', limit: 100 },
  { id: 'weather', label: 'Weather satellites', status: 'satellite', limit: 150 },
  { id: 'science', label: 'Science missions', status: 'satellite', limit: 140 },
  { id: 'gps-ops', label: 'GPS operational constellation', status: 'satellite', limit: 44 },
  { id: 'glo-ops', label: 'GLONASS operational constellation', status: 'satellite', limit: 36 },
  { id: 'galileo', label: 'Galileo constellation', status: 'satellite', limit: 42 },
  { id: 'beidou', label: 'BeiDou constellation', status: 'satellite', limit: 54 },
  { id: 'starlink', label: 'Starlink constellation sample', status: 'satellite', limit: 900 },
  { id: 'oneweb', label: 'OneWeb constellation sample', status: 'satellite', limit: 260 },
  { id: 'planet', label: 'Planet Labs constellation sample', status: 'satellite', limit: 240 },
  { id: 'iridium-NEXT', label: 'Iridium NEXT constellation', status: 'satellite', limit: 90 },
  { id: 'cosmos-2251-debris', label: 'Cosmos 2251 debris sample', status: 'debris', limit: 420 },
  { id: 'fengyun-1c-debris', label: 'Fengyun 1C debris sample', status: 'debris', limit: 520 },
  { id: 'iridium-33-debris', label: 'Iridium 33 debris sample', status: 'debris', limit: 360 },
  { id: 'cosmos-1408-debris', label: 'Cosmos 1408 debris sample', status: 'debris', limit: 360 },
];

const LAUNCH_SITE_COORDINATES = [
  { match: /kennedy|cape canaveral|ccsfs|ksc/i, lat: 28.5729, lon: -80.649 },
  { match: /vandenberg/i, lat: 34.742, lon: -120.572 },
  { match: /starbase|boca chica/i, lat: 25.997, lon: -97.156 },
  { match: /wallops/i, lat: 37.94, lon: -75.466 },
  { match: /baikonur/i, lat: 45.965, lon: 63.305 },
  { match: /kourou|guiana/i, lat: 5.239, lon: -52.768 },
  { match: /wenchang/i, lat: 19.614, lon: 110.951 },
  { match: /jiuquan/i, lat: 40.96, lon: 100.298 },
  { match: /taiyuan/i, lat: 38.849, lon: 111.608 },
  { match: /xichang/i, lat: 28.246, lon: 102.028 },
  { match: /tanegashima/i, lat: 30.391, lon: 130.969 },
  { match: /satish dhawan|sriharikota/i, lat: 13.7199, lon: 80.2304 },
  { match: /mahia|rocket lab/i, lat: -39.262, lon: 177.865 },
  { match: /plesetsk/i, lat: 62.927, lon: 40.575 },
  { match: /vostochny/i, lat: 51.884, lon: 128.333 },
  { match: /kodiak|pacific spaceport/i, lat: 57.435, lon: -152.339 },
];

const WORLD_OPS_MEDIA = [
  {
    id: 'nasa-live',
    type: 'live-directory',
    title: 'NASA Live and NASA+',
    provider: 'NASA',
    status: 'official public programming',
    url: 'https://www.nasa.gov/live/',
    embedUrl: '',
    summary: 'Official NASA live programming, launch coverage, mission events, and NASA+ viewing links.',
  },
  {
    id: 'iss-live-video',
    type: 'video',
    title: 'ISS Live Video',
    provider: 'NASA / YouTube',
    status: 'official public stream',
    url: 'https://www.youtube.com/watch?v=M3HKLzjvKPc',
    embedUrl: 'https://www.youtube-nocookie.com/embed/M3HKLzjvKPc?rel=0&modestbranding=1',
    summary: 'Public live video stream associated with the International Space Station. Availability depends on orbital coverage and NASA stream status.',
  },
  {
    id: 'iss-earth-view',
    type: 'video',
    title: 'ISS High-Definition Earth View',
    provider: 'NASA Johnson Space Center',
    status: 'public Earth-view stream',
    url: 'https://eol.jsc.nasa.gov/ESRS/HDEV/',
    embedUrl: 'https://www.youtube-nocookie.com/embed/awQzjn72bI0?rel=0&modestbranding=1',
    summary: 'Earth-facing public camera feed from the ISS program. It may show slate screens during signal loss, darkness, or maintenance.',
  },
  {
    id: 'nasa-worldview',
    type: 'earth-imagery',
    title: 'NASA Worldview / GIBS',
    provider: 'NASA Earthdata',
    status: 'near-real-time imagery portal',
    url: 'https://worldview.earthdata.nasa.gov/',
    embedUrl: '',
    summary: 'Global satellite imagery and Earth-observation layers for fires, dust, smoke, clouds, night lights, storms, and other context.',
  },
  {
    id: 'noaa-nowcoast',
    type: 'earth-weather',
    title: 'NOAA nowCOAST',
    provider: 'NOAA',
    status: 'public weather and hazards map',
    url: 'https://nowcoast.noaa.gov/',
    embedUrl: '',
    summary: 'NOAA near-real-time weather, ocean, coastal, watches, warnings, and forecast guidance map services.',
  },
  {
    id: 'noaa-space-weather',
    type: 'space-weather',
    title: 'NOAA SWPC Space Weather',
    provider: 'NOAA Space Weather Prediction Center',
    status: 'official space-weather dashboards',
    url: 'https://www.swpc.noaa.gov/',
    embedUrl: '',
    summary: 'Operational solar wind, geomagnetic, aurora, radio blackout, and radiation-storm products from NOAA SWPC.',
  },
  {
    id: 'esa-web-tv',
    type: 'live-directory',
    title: 'ESA Web TV',
    provider: 'European Space Agency',
    status: 'official public programming',
    url: 'https://www.esa.int/ESA_Multimedia/ESA_Web_TV',
    embedUrl: '',
    summary: 'ESA mission coverage, launch broadcasts, briefings, and agency programming from the official public channel.',
  },
  {
    id: 'esa-youtube-live',
    type: 'video-directory',
    title: 'ESA YouTube Live',
    provider: 'ESA / YouTube',
    status: 'official public stream directory',
    url: 'https://www.youtube.com/@EuropeanSpaceAgency/live',
    embedUrl: '',
    summary: 'Public live page for European Space Agency streams when broadcasts are scheduled.',
  },
  {
    id: 'spacex-live',
    type: 'video-directory',
    title: 'SpaceX Live Broadcasts',
    provider: 'SpaceX',
    status: 'launch webcast directory',
    url: 'https://www.spacex.com/launches/',
    embedUrl: '',
    summary: 'Launch webcast and mission pages for SpaceX flights, included as public source context rather than a live API.',
  },
  {
    id: 'noaa-goes-viewer',
    type: 'earth-imagery',
    title: 'NOAA GOES Image Viewer',
    provider: 'NOAA NESDIS',
    status: 'near-real-time geostationary imagery',
    url: 'https://www.star.nesdis.noaa.gov/GOES/',
    embedUrl: '',
    summary: 'GOES imagery for storms, water vapor, fire weather, clouds, and full-disk context from NOAA NESDIS.',
  },
  {
    id: 'jpl-eyes',
    type: 'mission-visualization',
    title: 'NASA Eyes',
    provider: 'NASA/JPL',
    status: 'public mission visualization',
    url: 'https://eyes.nasa.gov/',
    embedUrl: '',
    summary: 'NASA/JPL public visualization portal for Solar System missions, spacecraft, planetary context, and exploration timelines.',
  },
  {
    id: 'nasa-image-video-library',
    type: 'imagery-directory',
    title: 'NASA Image and Video Library',
    provider: 'NASA',
    status: 'official public media archive',
    url: 'https://images.nasa.gov/',
    embedUrl: '',
    summary: 'NASA public imagery and video archive for launches, missions, Earth science, exploration, and agency events.',
  },
  {
    id: 'eumetsat-view',
    type: 'earth-imagery',
    title: 'EUMETSAT View',
    provider: 'EUMETSAT',
    status: 'public meteorological imagery',
    url: 'https://view.eumetsat.int/',
    embedUrl: '',
    summary: 'European meteorological satellite viewer with near-real-time Earth observation products.',
  },
  {
    id: 'usgs-earthquake-map',
    type: 'hazard-map',
    title: 'USGS Latest Earthquakes',
    provider: 'USGS',
    status: 'official public earthquake map',
    url: 'https://earthquake.usgs.gov/earthquakes/map/',
    embedUrl: '',
    summary: 'Interactive USGS earthquake browser for magnitude, depth, regional filtering, and recent global seismicity.',
  },
];

function createReferenceOrbitalShell() {
  const groups = [
    { label: 'LEO infrastructure reference shell', status: 'satellite', count: 360, meanMotion: 15.05, altitudeKm: 550, inclination: 53.2, noradBase: 910000 },
    { label: 'Polar observation reference shell', status: 'satellite', count: 120, meanMotion: 14.2, altitudeKm: 720, inclination: 97.6, noradBase: 920000 },
    { label: 'MEO navigation reference shell', status: 'satellite', count: 96, meanMotion: 2.0, altitudeKm: 20200, inclination: 55, noradBase: 930000 },
    { label: 'Geostationary reference belt', status: 'satellite', count: 144, meanMotion: 1.0027, altitudeKm: 35786, inclination: 0.08, noradBase: 940000 },
    { label: 'Debris reference cloud', status: 'debris', count: 420, meanMotion: 14.5, altitudeKm: 780, inclination: 82, noradBase: 950000 },
  ];
  return groups.flatMap((group, groupIndex) => Array.from({ length: group.count }, (_, index) => {
    const phase = (index / group.count) * 360;
    const wobble = Math.sin((index + 1) * 12.9898 + groupIndex * 78.233);
    return {
      id: `reference-orbit-${groupIndex}-${index}`,
      name: `${group.label.replace(' reference ', ' ')} ${String(index + 1).padStart(3, '0')}`,
      noradId: group.noradBase + index,
      objectId: 'reference-shell',
      group: group.label,
      status: group.status,
      epoch: generatedAt,
      meanMotion: group.meanMotion,
      eccentricity: group.status === 'debris' ? 0.006 + Math.abs(wobble) * 0.018 : 0.0008 + Math.abs(wobble) * 0.003,
      inclination: group.inclination + wobble * (group.status === 'debris' ? 18 : 3.5),
      raan: (phase * (groupIndex + 1.618)) % 360,
      argumentOfPerigee: (phase * 0.73 + groupIndex * 37) % 360,
      meanAnomaly: (phase * 2.17 + groupIndex * 19) % 360,
      altitudeKm: group.altitudeKm,
      reference: true,
    };
  }));
}

function todayISO() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function daysAgoISO(days) {
  const date = new Date(Date.now() - days * 86400000);
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function safeIso(value) {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 1000000000) {
    return new Date(numeric).toISOString();
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : generatedAt;
}

function trimText(value, maxLength = 220) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function containsExcludedAutomationTerm(value) {
  const compactTerm = ['A', 'I'].join('');
  const phrase = ['artificial', 'intelligence'].join(' ');
  return new RegExp(`\\b${compactTerm}\\b|${phrase}`, 'i').test(String(value || ''));
}

function sampleEvenly(rows, limit) {
  if (!Array.isArray(rows) || rows.length <= limit) return rows || [];
  const step = Math.max(1, Math.ceil(rows.length / limit));
  return rows.filter((_, index) => index % step === 0).slice(0, limit);
}

function sourceRecord(id, label, url, status, count, error) {
  return {
    id,
    label,
    url,
    status,
    count,
    ...(error ? { error: trimText(error.message || error, 140) } : {}),
  };
}

function latestPointGeometry(geometry = []) {
  return [...geometry].reverse().find((item) => item?.type === 'Point' && Array.isArray(item.coordinates));
}

function launchSiteCoordinate(location = '', pad = '') {
  const text = `${pad} ${location}`;
  return LAUNCH_SITE_COORDINATES.find((site) => site.match.test(text)) || null;
}

function satelliteAltitudeKm(meanMotion) {
  const motion = finiteNumber(meanMotion);
  if (!motion || motion <= 0) return null;
  const mu = 398600.4418;
  const radiansPerSecond = motion * 2 * Math.PI / 86400;
  const semiMajorKm = Math.cbrt(mu / (radiansPerSecond ** 2));
  return semiMajorKm - 6371;
}

function eonetSeverity(event) {
  const point = latestPointGeometry(event.geometry);
  const magnitude = finiteNumber(point?.magnitudeValue);
  const category = event.categories?.[0]?.id || '';
  if (category === 'wildfires' && magnitude !== null) {
    if (magnitude >= 50000) return 'high';
    if (magnitude >= 5000) return 'medium';
  }
  return event.closed ? 'closed' : 'active';
}

function normalizeEonetEvent(event) {
  const point = latestPointGeometry(event.geometry);
  if (!point) return null;
  const [lon, lat] = point.coordinates || [];
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) return null;
  const category = event.categories?.[0];
  return {
    id: `eonet-${event.id}`,
    type: category?.id || 'nasa-event',
    title: event.title || 'NASA Earth event',
    lat: Number(lat),
    lon: Number(lon),
    severity: eonetSeverity(event),
    timestamp: safeIso(point.date || event.closed || generatedAt),
    source: 'NASA EONET',
    url: event.sources?.[0]?.url || event.link || 'https://eonet.gsfc.nasa.gov/',
    summary: trimText(event.description || category?.title || 'Open NASA Earth Observatory Natural Event Tracker record.'),
  };
}

function normalizeUsgsFeature(feature) {
  const coordinates = feature.geometry?.coordinates || [];
  const [lon, lat, depthKm] = coordinates;
  const mag = finiteNumber(feature.properties?.mag);
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) return null;
  return {
    id: `usgs-${feature.id}`,
    type: 'earthquake',
    title: feature.properties?.title || 'USGS earthquake',
    lat: Number(lat),
    lon: Number(lon),
    severity: mag >= 6.5 ? 'high' : mag >= 5 ? 'medium' : 'low',
    timestamp: safeIso(feature.properties?.time),
    source: 'USGS Earthquake Hazards Program',
    url: feature.properties?.url || 'https://earthquake.usgs.gov/',
    summary: trimText(`Magnitude ${mag ?? 'n/a'} earthquake at ${feature.properties?.place || 'reported location'}; depth ${finiteNumber(depthKm) ?? 'n/a'} km.`),
    magnitude: mag,
    depthKm: finiteNumber(depthKm),
  };
}

function normalizeGdacsFeature(feature) {
  const coordinates = feature.geometry?.coordinates || [];
  const [lon, lat] = coordinates;
  const props = feature.properties || {};
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) return null;
  const alert = String(props.alertlevel || props.episodealertlevel || 'Green');
  return {
    id: `gdacs-${props.eventtype}-${props.eventid}-${props.episodeid}`,
    type: GDACS_TYPE_LABELS[props.eventtype] || 'disaster',
    title: props.name || props.description || 'GDACS disaster alert',
    lat: Number(lat),
    lon: Number(lon),
    severity: alert.toLowerCase(),
    timestamp: safeIso(props.datemodified || props.fromdate || generatedAt),
    source: 'GDACS',
    url: props.url?.report || 'https://www.gdacs.org/',
    summary: trimText(props.htmldescription || props.description || `${alert} GDACS event in ${props.country || 'reported region'}.`),
    country: props.country || '',
  };
}

function normalizeSatellite(row, group) {
  const meanMotion = finiteNumber(row.MEAN_MOTION);
  return {
    id: `${group.id}-${row.NORAD_CAT_ID || row.OBJECT_ID || row.OBJECT_NAME}`,
    name: row.OBJECT_NAME || `NORAD ${row.NORAD_CAT_ID}`,
    noradId: finiteNumber(row.NORAD_CAT_ID),
    objectId: row.OBJECT_ID || '',
    group: group.label,
    status: group.status,
    epoch: safeIso(row.EPOCH),
    meanMotion,
    eccentricity: finiteNumber(row.ECCENTRICITY) ?? 0,
    inclination: finiteNumber(row.INCLINATION) ?? 0,
    raan: finiteNumber(row.RA_OF_ASC_NODE) ?? 0,
    argumentOfPerigee: finiteNumber(row.ARG_OF_PERICENTER) ?? 0,
    meanAnomaly: finiteNumber(row.MEAN_ANOMALY) ?? 0,
    altitudeKm: satelliteAltitudeKm(meanMotion),
  };
}

function normalizeLaunch(launch) {
  const coordinates = launchSiteCoordinate(launch.location, launch.pad);
  return {
    id: launch.id || launch.slug || launch.name,
    name: launch.name || 'Upcoming launch',
    net: safeIso(launch.net || launch.window_start),
    status: launch.status?.name || launch.status || 'unknown',
    provider: launch.lsp_name || launch.launch_service_provider?.name || 'unknown provider',
    mission: trimText(launch.mission?.description || launch.mission?.name || launch.mission || 'Mission details pending.', 260),
    pad: launch.pad?.name || launch.pad || 'pad pending',
    location: launch.pad?.location?.name || launch.location || 'location pending',
    lat: coordinates?.lat ?? null,
    lon: coordinates?.lon ?? null,
    url: launch.url || 'https://ll.thespacedevs.com/',
    image: launch.image || '',
  };
}

function normalizeNews(article, lane = 'article') {
  return {
    id: `news-${lane}-${article.id || article.url || article.title}`,
    lane,
    title: article.title || 'Spaceflight news',
    site: article.news_site || 'Spaceflight News API',
    publishedAt: safeIso(article.published_at || article.updated_at),
    url: article.url || 'https://api.spaceflightnewsapi.net/',
    summary: trimText(article.summary || '', 260),
    imageUrl: article.image_url || '',
  };
}


async function fetchJson(url, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${label} returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function writeSnapshot(filename, payload) {
  await mkdir(outputDir, { recursive: true });
  const file = path.join(outputDir, filename);
  await writeFile(file, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`[data] wrote ${filename}`);
}

async function keepExistingOrWriteFallback(filename, fallbackPayload, error) {
  const file = path.join(outputDir, filename);
  try {
    await readFile(file, 'utf8');
    console.warn(`[data] keeping existing ${filename}: ${error.message}`);
  } catch {
    await writeSnapshot(filename, fallbackPayload);
    console.warn(`[data] wrote fallback ${filename}: ${error.message}`);
  }
}

async function writeHomeStats(confirmedExoplanets, sourceGeneratedAt = generatedAt) {
  const safeCount = Number.isFinite(Number(confirmedExoplanets)) && Number(confirmedExoplanets) > 0
    ? Number(confirmedExoplanets)
    : HOME_STATS_FALLBACK.stats.confirmedExoplanets;

  await writeSnapshot('home-stats.json', {
    schemaVersion: 1,
    generatedAt,
    sourceGeneratedAt,
    source: 'NASA Exoplanet Archive TAP confirmed-planet count plus AstroBis labelled scale references',
    exoplanetQuery: 'select count(pl_name) from ps where default_flag = 1',
    stats: {
      confirmedExoplanets: safeCount,
      oortInnerAu: 1000,
      oortOuterAu: 100000,
      universeAgeGyr: 13.8,
      solarSystemPlanets: 8,
    },
    notes: {
      exoplanets: 'Build-time NASA Exoplanet Archive count. The client displays the most recent deployed snapshot, not a live browser query.',
      oortCloud: '1,000 AU and 100,000 AU are NASA scale estimates. The Oort Cloud has not been directly imaged.',
      universeAge: '13.8 billion years is a standard cosmological reference value.',
    },
  });
}

async function fetchExoplanets() {
  // The confirmed-planet count is deliberately drawn from ps/default_flag,
  // matching the Archive's documented confirmed-planet query rather than
  // treating PSCompPars row count as the authoritative total.
  const confirmedCountQuery = 'select count(pl_name) as confirmed_planets from ps where default_flag = 1';
  const systemCountQuery = 'select count(distinct hostname) as planetary_systems from pscomppars';
  const query = [
    `select top ${EXOPLANET_QUERY_LIMIT}`,
    'pl_name,hostname,discoverymethod,disc_facility,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,pl_insol,pl_orbsmax,pl_orbeccen,pl_orbincl,sy_dist,st_teff,st_rad,st_mass,st_spectype',
    'from pscomppars',
    'where pl_name is not null and hostname is not null',
    'order by sy_dist asc',
  ].join(' ');

  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;
  const confirmedCountUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(confirmedCountQuery)}&format=json`;
  const systemCountUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(systemCountQuery)}&format=json`;

  try {
    const [data, confirmedCountData, systemCountData] = await Promise.all([
      fetchJson(url, 'NASA Exoplanet Archive PSCompPars'),
      fetchJson(confirmedCountUrl, 'NASA Exoplanet Archive confirmed-planet count'),
      fetchJson(systemCountUrl, 'NASA Exoplanet Archive system count'),
    ]);

    const confirmedRow = Array.isArray(confirmedCountData) ? confirmedCountData[0] : null;
    const systemRow = Array.isArray(systemCountData) ? systemCountData[0] : null;
    const confirmedPlanets = Number(confirmedRow?.confirmed_planets || 0);
    const planetarySystems = Number(systemRow?.planetary_systems || 0);

    await writeSnapshot('exoplanets.json', {
      generatedAt,
      source: 'NASA Exoplanet Archive TAP PSCompPars working catalogue',
      query,
      countQueries: {
        confirmedCountQuery,
        systemCountQuery,
      },
      count: Array.isArray(data) ? data.length : 0,
      meta: {
        confirmedPlanets: confirmedPlanets || HOME_STATS_FALLBACK.stats.confirmedExoplanets,
        planetarySystems: planetarySystems || null,
        queryLimit: EXOPLANET_QUERY_LIMIT,
        archiveTable: 'pscomppars',
      },
      data,
    });

    await writeHomeStats(confirmedPlanets);
  } catch (error) {
    await keepExistingOrWriteFallback('exoplanets.json', {
      generatedAt,
      source: 'offline fallback',
      query,
      count: 0,
      meta: {
        confirmedPlanets: HOME_STATS_FALLBACK.stats.confirmedExoplanets,
        planetarySystems: null,
        queryLimit: EXOPLANET_QUERY_LIMIT,
        archiveTable: 'pscomppars',
      },
      data: [],
    }, error);

    await keepExistingOrWriteFallback('home-stats.json', HOME_STATS_FALLBACK, error);
  }
}

async function fetchNeoApproaches() {
  const params = new URLSearchParams({
    'date-min': todayISO(),
    'date-max': '2050-12-31',
    'dist-max': '0.3',
    body: 'Earth',
    sort: 'date',
    limit: '7500',
    fullname: 'true',
    diameter: 'true',
  });
  const url = `https://ssd-api.jpl.nasa.gov/cad.api?${params.toString()}`;
  try {
    const data = await fetchJson(url, 'JPL SBDB CAD');
    await writeSnapshot('neo-approaches.json', {
      generatedAt,
      source: 'NASA/JPL SBDB Close Approach Data API',
      query: Object.fromEntries(params.entries()),
      count: Number(data.count || data.data?.length || 0),
      total: Number(data.total || data.count || 0),
      fields: data.fields || [],
      data: data.data || [],
      signature: data.signature,
    });
  } catch (error) {
    await keepExistingOrWriteFallback('neo-approaches.json', {
      generatedAt,
      source: 'offline fallback',
      query: Object.fromEntries(params.entries()),
      count: 0,
      total: 0,
      fields: [],
      data: [],
    }, error);
  }
}

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  values.push(value);
  return values;
}

function spectralClass(value) {
  const letter = String(value || '').trim().charAt(0).toUpperCase();
  return ['O', 'B', 'A', 'F', 'G', 'K', 'M'].includes(letter) ? letter : 'G';
}

async function fetchInterstellarVisitors() {
  const targets = [
    { sstr: '1I', displayName: "1I/'Oumuamua", visitorClass: 'Interstellar asteroid', note: 'First confirmed interstellar object observed passing through the Solar System.' },
    { sstr: '2I', displayName: '2I/Borisov', visitorClass: 'Interstellar comet', note: 'First confirmed active interstellar comet.' },
    { sstr: '3I', displayName: '3I/ATLAS', visitorClass: 'Interstellar comet', note: 'Third known interstellar object; discovered by the NASA-funded ATLAS survey in 2025.' },
  ];
  const query = targets.map((target) => target.sstr);
  try {
    const data = await Promise.all(targets.map(async (target) => {
      const params = new URLSearchParams({
        sstr: target.sstr,
        'full-prec': '1',
        'cd-epoch': '1',
        'cd-tp': '1',
        'phys-par': '1',
      });
      const url = `https://ssd-api.jpl.nasa.gov/sbdb.api?${params.toString()}`;
      const payload = await fetchJson(url, `JPL SBDB ${target.sstr}`);
      return {
        ...target,
        sourceUrl: url,
        object: payload.object,
        orbit: payload.orbit,
        phys_par: payload.phys_par || [],
      };
    }));
    await writeSnapshot('small-body-visitors.json', {
      generatedAt,
      source: 'NASA/JPL SBDB API interstellar visitor objects',
      query,
      count: data.length,
      data,
    });
  } catch (error) {
    await keepExistingOrWriteFallback('small-body-visitors.json', {
      generatedAt,
      source: 'offline fallback',
      query,
      count: 0,
      data: [],
    }, error);
  }
}

async function fetchBrightStarCatalogue() {
  const url = 'https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/CURRENT/hygdata_v41.csv';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'text/csv' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HYG star catalogue returned ${response.status}`);
    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headers = parseCsvLine(lines.shift() || '').map((field) => field.replace(/^"|"$/g, ''));
    const rows = lines
      .map((line) => {
        const values = parseCsvLine(line);
        const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
        const ra = Number(row.ra);
        const dec = Number(row.dec);
        const distPc = Number(row.dist);
        const mag = Number(row.mag);
        if (!Number.isFinite(ra) || !Number.isFinite(dec) || !Number.isFinite(distPc) || !Number.isFinite(mag)) return null;
        if (distPc <= 0 || row.proper === 'Sol') return null;
        const name = row.proper || row.bf || (row.hr ? `HR ${row.hr}` : row.hd ? `HD ${row.hd}` : '');
        if (!name) return null;
        return {
          name,
          ra,
          dec,
          distPc,
          mag,
          spectral: spectralClass(row.spect),
          spect: row.spect || null,
          lum: Number.isFinite(Number(row.lum)) ? Number(row.lum) : null,
          sourceId: row.id,
          desc: `${name} - HYG bright-star catalogue entry (${row.spect || 'spectral class n/a'}, apparent magnitude ${mag.toFixed(2)})`,
        };
      })
      .filter(Boolean)
      .filter((row) => row.mag <= 5.6)
      .sort((a, b) => a.mag - b.mag)
      .slice(0, 420);

    await writeSnapshot('bright-stars.json', {
      generatedAt,
      source: 'HYG Database v4.1 bright-star subset',
      url,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    await keepExistingOrWriteFallback('bright-stars.json', {
      generatedAt,
      source: 'offline fallback',
      url,
      count: 0,
      data: [],
    }, error);
  } finally {
    clearTimeout(timeout);
  }
}

function parseTleEpoch(line1) {
  const epoch = String(line1 || '').slice(18, 32).trim();
  const match = epoch.match(/^(\d{2})(\d{3}(?:\.\d+)?)$/);
  if (!match) return null;
  const yy = Number(match[1]);
  const day = Number(match[2]);
  if (!Number.isFinite(yy) || !Number.isFinite(day)) return null;
  const year = yy < 57 ? 2000 + yy : 1900 + yy;
  return new Date(Date.UTC(year, 0, 1) + (day - 1) * 86400000).toISOString();
}

async function fetchIssTle() {
  const url = 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'text/plain' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`CelesTrak ISS TLE returned ${response.status}`);
    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 3 || !lines[1].startsWith('1 ') || !lines[2].startsWith('2 ')) {
      throw new Error('CelesTrak ISS TLE payload was not valid TLE text');
    }
    await writeSnapshot('iss-tle.json', {
      generatedAt,
      source: 'CelesTrak GP data for ISS (CATNR 25544)',
      url,
      name: lines[0],
      line1: lines[1],
      line2: lines[2],
      epoch: parseTleEpoch(lines[1]),
    });
  } catch (error) {
    await keepExistingOrWriteFallback('iss-tle.json', {
      generatedAt,
      source: 'offline fallback',
      url,
      name: 'ISS (ZARYA)',
      line1: '1 25544U 98067A   26171.00000000  .00016717  00000+0  10270-3 0  9993',
      line2: '2 25544  51.6400 000.0000 0006703 000.0000 000.0000 15.50000000    10',
      epoch: parseTleEpoch('1 25544U 98067A   26171.00000000  .00016717  00000+0  10270-3 0  9993'),
    }, error);
  } finally {
    clearTimeout(timeout);
  }
}

async function loadSource(id, label, url, loader, fallback = []) {
  try {
    const data = await loader(url);
    const count = Array.isArray(data) ? data.length : data ? 1 : 0;
    return {
      data,
      source: sourceRecord(id, label, url, 'live', count),
    };
  } catch (error) {
    const count = Array.isArray(fallback) ? fallback.length : fallback ? 1 : 0;
    return {
      data: fallback,
      source: sourceRecord(id, label, url, 'fallback', count, error),
    };
  }
}

async function fetchWorldEonet() {
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=90';
  return loadSource('eonet', 'NASA EONET open natural events', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'NASA EONET world events');
    return (payload.events || [])
      .map(normalizeEonetEvent)
      .filter(Boolean)
      .slice(0, 90);
  }, WORLD_OPS_FALLBACK.events.filter((event) => event.id.includes('eonet')));
}

async function fetchWorldUsgs() {
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';
  return loadSource('usgs', 'USGS earthquakes magnitude 2.5+ weekly feed', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'USGS earthquake GeoJSON');
    return (payload.features || [])
      .map(normalizeUsgsFeature)
      .filter(Boolean)
      .sort((a, b) => (b.magnitude || 0) - (a.magnitude || 0))
      .slice(0, 120);
  }, WORLD_OPS_FALLBACK.events.filter((event) => event.id.includes('quake')));
}

async function fetchWorldGdacs() {
  const params = new URLSearchParams({
    eventlist: 'EQ,TC,FL,VO',
    fromdate: daysAgoISO(45),
    todate: todayISO(),
  });
  const url = `https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP?${params.toString()}`;
  return loadSource('gdacs', 'GDACS current disaster alerts', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'GDACS disaster events');
    return (payload.features || [])
      .map(normalizeGdacsFeature)
      .filter(Boolean)
      .slice(0, 160);
  }, []);
}

async function fetchWorldSatellites() {
  const satellites = [];
  const sources = [];

  for (const group of CELESTRAK_WORLD_GROUPS) {
    const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group.id}&FORMAT=json`;
    try {
      const payload = await fetchJson(url, `CelesTrak ${group.id}`);
      const sourceCount = Array.isArray(payload) ? payload.length : 0;
      const rows = sampleEvenly(payload, group.limit)
        .map((row) => normalizeSatellite(row, group))
        .filter((satellite) => satellite.name && satellite.meanMotion);
      satellites.push(...rows);
      sources.push({
        ...sourceRecord(`celestrak-${group.id}`, `CelesTrak ${group.label}`, url, 'live', rows.length),
        catalogueCount: sourceCount,
        sampleLimit: group.limit,
      });
    } catch (error) {
      sources.push(sourceRecord(`celestrak-${group.id}`, `CelesTrak ${group.label}`, url, 'fallback', 0, error));
    }
  }

  if (!satellites.length) {
    const referenceShell = createReferenceOrbitalShell();
    satellites.push(...WORLD_OPS_FALLBACK.satellites, ...referenceShell);
    sources.push(sourceRecord('orbital-reference-shell', 'AstroBis orbital reference shell', 'public data fallback', 'static', referenceShell.length));
  }
  return { data: satellites, sources };
}

async function fetchWorldLaunches() {
  const url = 'https://ll.thespacedevs.com/2.0.0/launch/upcoming/?limit=64&mode=list';
  return loadSource('launch-library', 'The Space Devs Launch Library 2', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'Launch Library 2 upcoming launches');
    return (payload.results || [])
      .map(normalizeLaunch)
      .filter((launch) => launch.name)
      .slice(0, 64);
  }, WORLD_OPS_FALLBACK.launches);
}

async function fetchWorldNews() {
  const url = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=36';
  return loadSource('spaceflight-news', 'Spaceflight News API', url, async (sourceUrl) => {
    const endpoints = [
      { lane: 'article', url: sourceUrl },
      { lane: 'blog', url: 'https://api.spaceflightnewsapi.net/v4/blogs/?limit=18' },
      { lane: 'report', url: 'https://api.spaceflightnewsapi.net/v4/reports/?limit=18' },
    ];
    const settled = await Promise.allSettled(
      endpoints.map((endpoint) => fetchJson(endpoint.url, `Spaceflight News API ${endpoint.lane}s`).then((payload) => ({ endpoint, payload }))),
    );
    const rows = settled.flatMap((result) => {
      if (result.status !== 'fulfilled') return [];
      const { endpoint, payload } = result.value;
      return (payload.results || []).map((article) => normalizeNews(article, endpoint.lane));
    });
    if (!rows.length) throw new Error('Spaceflight News API returned no article, blog, or report rows');
    const unique = new Map();
    for (const article of rows.filter((item) => item.title && !containsExcludedAutomationTerm(item.title) && !containsExcludedAutomationTerm(item.summary))) {
      unique.set(article.url || article.id, article);
    }
    return [...unique.values()]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .filter((article) => article.title)
      .slice(0, 72);
  }, WORLD_OPS_FALLBACK.news);
}

async function fetchWorldSpaceWeather() {
  const url = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json';
  return loadSource('noaa-swpc-kp', 'NOAA SWPC planetary K index', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'NOAA SWPC planetary K index');
    const samples = (payload || [])
      .map((row) => ({
        observedAt: safeIso(row.time_tag),
        kp: finiteNumber(row.estimated_kp ?? row.kp_index),
        label: row.kp || '',
      }))
      .filter((row) => row.kp !== null)
      .sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt))
      .slice(0, 18);
    if (!samples.length) throw new Error('NOAA SWPC Kp feed returned no usable samples');
    const latest = samples[0];
    const status = latest.kp >= 7 ? 'storm' : latest.kp >= 5 ? 'active' : latest.kp >= 4 ? 'unsettled' : 'quiet';
    return {
      observedAt: latest.observedAt,
      kp: latest.kp,
      label: latest.label || `Kp ${latest.kp.toFixed(1)}`,
      status,
      summary: `Latest NOAA SWPC planetary K index is ${latest.kp.toFixed(1)} (${status}).`,
      samples,
    };
  }, WORLD_OPS_FALLBACK.spaceWeather);
}

function normalizeRainViewerFrame(frame) {
  const time = finiteNumber(frame?.time);
  if (!time) return null;
  return {
    time,
    observedAt: new Date(time * 1000).toISOString(),
    path: frame.path || '',
  };
}

function stormCandidateScore(event) {
  const type = String(event?.type || '').toLowerCase();
  const title = String(event?.title || '').toLowerCase();
  const stormType = type.includes('storm')
    || type.includes('cyclone')
    || type.includes('flood')
    || title.includes('storm')
    || title.includes('cyclone')
    || title.includes('hurricane')
    || title.includes('typhoon')
    || title.includes('rain')
    || title.includes('flood');
  if (!stormType) return -1;
  return eventSeverityRank(event) * 100 + Math.max(0, 96 - ((Date.now() - Date.parse(event.timestamp || 0)) / 3600000));
}

function buildStormAdvisories(events, radarData) {
  return events
    .filter((event) => stormCandidateScore(event) >= 0)
    .sort((a, b) => stormCandidateScore(b) - stormCandidateScore(a))
    .slice(0, 80)
    .map((event) => ({
      id: `storm-${event.id}`,
      type: event.type,
      title: event.title,
      lat: event.lat,
      lon: event.lon,
      severity: event.severity,
      timestamp: event.timestamp,
      source: event.source,
      url: event.url,
      summary: trimText(`${event.summary || 'Public storm-related event.'} Radar animation context: ${radarData?.latest?.observedAt ? `latest public frame ${radarData.latest.observedAt}` : 'public radar frame unavailable during build'}.`, 280),
    }));
}

async function fetchWorldStormWatch(events = []) {
  const url = 'https://api.rainviewer.com/public/weather-maps.json';
  return loadSource('rainviewer-weather-maps', 'RainViewer public radar frames', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'RainViewer weather maps');
    const host = payload.host || 'https://tilecache.rainviewer.com';
    const past = (payload.radar?.past || []).map(normalizeRainViewerFrame).filter(Boolean).slice(-12);
    const nowcast = (payload.radar?.nowcast || []).map(normalizeRainViewerFrame).filter(Boolean).slice(0, 6);
    const latest = [...past].sort((a, b) => b.time - a.time)[0] || null;
    const radar = {
      source: 'RainViewer public weather maps',
      host,
      past,
      nowcast,
      latest,
      tileTemplate: latest ? `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png` : '',
      animationFrameCount: past.length + nowcast.length,
    };
    return {
      generatedAt,
      status: latest ? 'live' : 'partial',
      radar,
      satellite: {
        source: 'NASA GIBS public imagery reference',
        status: 'reference',
        product: 'near-real-time global satellite imagery layers',
        url: 'https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api',
        summary: 'NASA GIBS/Worldview provides public near-real-time satellite imagery products; AstroBis v1.2 uses this as documented context while radar frames animate from RainViewer metadata.',
      },
      advisories: buildStormAdvisories(events, { latest }),
      notes: [
        'RainViewer frames are public radar-map tiles and can be minutes behind observation time depending on coverage.',
        'Storm markers are derived from public NASA EONET and GDACS storm/flood/cyclone records.',
      ],
    };
  }, {
    ...WORLD_OPS_FALLBACK.stormWatch,
    advisories: buildStormAdvisories(events, WORLD_OPS_FALLBACK.stormWatch?.radar || {}),
  });
}

function eventSeverityRank(event) {
  const value = String(event?.severity || '').toLowerCase();
  if (['red', 'high', 'major', 'critical'].includes(value)) return 3;
  if (['orange', 'medium', 'moderate', 'active'].includes(value)) return 2;
  if (['yellow', 'low', 'green', 'minor'].includes(value)) return 1;
  return 0;
}

function countWithinDays(rows, field, days) {
  const now = Date.now();
  const span = days * 86400000;
  return rows.filter((row) => {
    const time = Date.parse(row?.[field]);
    return Number.isFinite(time) && time >= now - span && time <= now + span;
  }).length;
}

function buildWorldOpsBrief({ events, satellites, launches, news, media, sources, spaceWeather }) {
  const liveSources = sources.filter((source) => source.status === 'live').length;
  const fallbackSources = sources.filter((source) => source.status === 'fallback').length;
  const sourceTotal = Math.max(1, sources.length);
  const highEvents = events.filter((event) => eventSeverityRank(event) >= 3).length;
  const activeEvents = events.filter((event) => eventSeverityRank(event) >= 2).length;
  const debris = satellites.filter((satellite) => satellite.status === 'debris').length;
  const stations = satellites.filter((satellite) => satellite.status === 'station').length;
  const nextLaunches7d = launches.filter((launch) => {
    const net = Date.parse(launch.net);
    return Number.isFinite(net) && net >= Date.now() && net <= Date.now() + 7 * 86400000;
  }).length;
  const recentNews24h = countWithinDays(news, 'publishedAt', 1);
  const kp = finiteNumber(spaceWeather?.kp);
  const sourceScore = liveSources / sourceTotal;
  const freshnessBonus = recentNews24h ? 9 : 0;
  const confidence = Math.round(Math.max(38, Math.min(96, sourceScore * 72 + 16 + freshnessBonus - fallbackSources * 3)));
  const kpText = kp === null ? 'Kp unavailable' : `Kp ${kp.toFixed(1)} ${spaceWeather.status || ''}`.trim();

  const nextLaunch = launches
    .filter((launch) => Number.isFinite(Date.parse(launch.net)) && Date.parse(launch.net) >= Date.now())
    .sort((a, b) => Date.parse(a.net) - Date.parse(b.net))[0];
  const dominantEvent = events
    .slice()
    .sort((a, b) => eventSeverityRank(b) - eventSeverityRank(a) || Date.parse(b.timestamp) - Date.parse(a.timestamp))[0];

  return {
    id: 'earthops-synthetic-brief',
    label: 'AstroBis public-source brief',
    generatedAt,
    mode: 'public-feed summary over loaded source lanes',
    confidence,
    headline: `${events.length.toLocaleString()} Earth signals, ${satellites.length.toLocaleString()} orbital objects, ${launches.length.toLocaleString()} launches, ${news.length.toLocaleString()} news items fused into one public snapshot.`,
    watch: [
      {
        label: 'Hazard load',
        value: `${activeEvents} active`,
        tone: highEvents ? '#fb7185' : '#fbbf24',
        summary: highEvents ? `${highEvents} high-severity public-feed items are flagged.` : 'No high-severity public-feed item dominates the snapshot.',
      },
      {
        label: 'Orbit traffic',
        value: `${satellites.length.toLocaleString()} tracked`,
        tone: '#67e8f9',
        summary: `${debris.toLocaleString()} debris points and ${stations} station-class objects are included in the sampled CelesTrak shell.`,
      },
      {
        label: 'Launch tempo',
        value: `${nextLaunches7d} in 7d`,
        tone: '#fbbf24',
        summary: nextLaunch ? `Next scheduled item: ${nextLaunch.name}.` : 'No near-term launch card is available in the current snapshot.',
      },
      {
        label: 'Space weather',
        value: kpText,
        tone: kp !== null && kp >= 5 ? '#fb7185' : '#86efac',
        summary: spaceWeather?.summary || 'NOAA SWPC Kp context is unavailable.',
      },
      {
        label: 'News velocity',
        value: `${recentNews24h} recent`,
        tone: '#93c5fd',
        summary: `${news.length.toLocaleString()} article, blog, and report cards are available from the public spaceflight feed.`,
      },
      {
        label: 'Media ops',
        value: `${media.length} sources`,
        tone: '#c4b5fd',
        summary: 'Public live/video/imagery portals are linked as source context, not rebroadcast infrastructure.',
      },
    ],
    bullets: [
      dominantEvent ? `Priority Earth signal: ${dominantEvent.title} (${dominantEvent.source}, ${dominantEvent.severity}).` : 'No Earth-event item is currently prioritized.',
      nextLaunch ? `Next launch window: ${nextLaunch.name} from ${nextLaunch.location}.` : 'Launch Library cards are waiting for the next successful snapshot.',
      fallbackSources ? `${fallbackSources} source lane(s) used fallback handling; the UI keeps those uncertainty labels visible.` : 'All queried source lanes returned live data during the build.',
      'This panel is a transparent AstroBis summary over public feeds, not a private prediction or official impact assessment.',
    ],
    sourceHealth: { live: liveSources, fallback: fallbackSources, total: sourceTotal },
  };
}

async function fetchWorldOps() {
  try {
    const [eonet, usgs, gdacs, satelliteBundle, launches, news, spaceWeather] = await Promise.all([
      fetchWorldEonet(),
      fetchWorldUsgs(),
      fetchWorldGdacs(),
      fetchWorldSatellites(),
      fetchWorldLaunches(),
      fetchWorldNews(),
      fetchWorldSpaceWeather(),
    ]);

    const events = [...eonet.data, ...usgs.data, ...gdacs.data]
      .filter((event) => Number.isFinite(event.lat) && Number.isFinite(event.lon))
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
    const stormWatch = await fetchWorldStormWatch(events);
    const satellites = satelliteBundle.data;
    const orbitalCatalogueCount = satelliteBundle.sources.reduce((total, source) => total + (source.catalogueCount || source.count || 0), 0);
    const orbitalCoverageLabel = `${orbitalCatalogueCount.toLocaleString()} public catalogue rows`;
    const sources = [
      eonet.source,
      usgs.source,
      gdacs.source,
      ...satelliteBundle.sources,
      launches.source,
      news.source,
      spaceWeather.source,
      stormWatch.source,
      sourceRecord('media-directory', 'Curated public media directory', 'https://www.nasa.gov/live/', 'static', WORLD_OPS_MEDIA.length),
    ];
    const opsBrief = buildWorldOpsBrief({
      events,
      satellites,
      launches: launches.data,
      news: news.data,
      media: WORLD_OPS_MEDIA,
      sources,
      spaceWeather: spaceWeather.data,
    });

    await writeSnapshot('world-ops.json', {
      schemaVersion: 1,
      generatedAt,
      sources,
      events,
      satellites,
      launches: launches.data,
      news: news.data,
      media: WORLD_OPS_MEDIA,
      spaceWeather: spaceWeather.data,
      stormWatch: stormWatch.data,
      opsBrief,
      totals: {
        events: events.length,
        satellites: satellites.length,
        debris: satellites.filter((satellite) => satellite.status === 'debris').length,
        launches: launches.data.length,
        news: news.data.length,
        media: WORLD_OPS_MEDIA.length,
        spaceWeather: spaceWeather.data ? 1 : 0,
        stormAdvisories: stormWatch.data?.advisories?.length || 0,
        radarFrames: stormWatch.data?.radar?.animationFrameCount || 0,
        nasaEvents: eonet.data.length,
        earthquakes: usgs.data.length,
        disasters: gdacs.data.length,
        orbitalCatalogueCount,
        orbitalCoverageLabel,
        renderedOrbitalSample: satellites.length,
      },
      notes: {
        scope: 'AstroBis EarthOps is space-first: orbital infrastructure, launches, Earth hazards, and spaceflight context. It is not a broad conflict or political OSINT clone.',
        liveRefresh: 'Browser live refresh is limited to CORS-friendly public feeds. Launches and space-news articles use the latest deployed build snapshot.',
      },
    });
  } catch (error) {
    await keepExistingOrWriteFallback('world-ops.json', WORLD_OPS_FALLBACK, error);
  }
}

async function writeMarsMapSnapshot() {
  await writeSnapshot('mars-map.json', {
    ...MARS_MAP_SNAPSHOT,
    generatedAt,
  });
}

await Promise.all([
  fetchExoplanets(),
  fetchNeoApproaches(),
  fetchIssTle(),
  fetchInterstellarVisitors(),
  fetchBrightStarCatalogue(),
  fetchWorldOps(),
  writeMarsMapSnapshot(),
]);
