// City data with metadata for local SEO pages
export interface CityData {
  name: string;
  slug: string;
  county: string;
  population?: number;
  nearbyCourthouse?: string;
  description?: string;
}

// Major cities with detailed data for individual landing pages
export const majorCities: CityData[] = [
  {
    name: "Los Angeles",
    slug: "los-angeles",
    county: "Los Angeles County",
    population: 3898747,
    nearbyCourthouse: "Stanley Mosk Courthouse",
    description: "As the largest city in California, Los Angeles presents unique legal challenges across personal injury, criminal defense, and employment law."
  },
  {
    name: "Sherman Oaks",
    slug: "sherman-oaks",
    county: "Los Angeles County",
    population: 67596,
    nearbyCourthouse: "Van Nuys Courthouse",
    description: "Located in the heart of the San Fernando Valley, Sherman Oaks is home to our main office at 15250 Ventura Blvd."
  },
  {
    name: "Burbank",
    slug: "burbank",
    county: "Los Angeles County",
    population: 107337,
    nearbyCourthouse: "Burbank Courthouse",
    description: "Known as the Media Capital of the World, Burbank residents face unique employment and personal injury matters."
  },
  {
    name: "Glendale",
    slug: "glendale",
    county: "Los Angeles County",
    population: 196543,
    nearbyCourthouse: "Glendale Courthouse",
    description: "California's fourth largest city in Los Angeles County, with a diverse population requiring multilingual legal services."
  },
  {
    name: "Pasadena",
    slug: "pasadena",
    county: "Los Angeles County",
    population: 138699,
    nearbyCourthouse: "Pasadena Courthouse",
    description: "Home to the Rose Bowl and Caltech, Pasadena residents deserve experienced legal representation."
  },
  {
    name: "Santa Monica",
    slug: "santa-monica",
    county: "Los Angeles County",
    population: 93076,
    nearbyCourthouse: "Santa Monica Courthouse",
    description: "This beachside city sees high volumes of traffic accidents and tourism-related legal matters."
  },
  {
    name: "Long Beach",
    slug: "long-beach",
    county: "Los Angeles County",
    population: 466742,
    nearbyCourthouse: "Governor George Deukmejian Courthouse",
    description: "California's seventh largest city with one of the busiest ports, creating unique legal needs."
  },
  {
    name: "Torrance",
    slug: "torrance",
    county: "Los Angeles County",
    population: 145438,
    nearbyCourthouse: "Torrance Courthouse",
    description: "A major South Bay city with significant industrial presence and diverse legal requirements."
  },
  {
    name: "Van Nuys",
    slug: "van-nuys",
    county: "Los Angeles County",
    population: 136443,
    nearbyCourthouse: "Van Nuys Courthouse",
    description: "The commercial and governmental center of the San Fernando Valley with high court activity."
  },
  {
    name: "North Hollywood",
    slug: "north-hollywood",
    county: "Los Angeles County",
    population: 87241,
    nearbyCourthouse: "Van Nuys Courthouse",
    description: "A vibrant arts district in the San Fernando Valley with growing residential and commercial areas."
  },
  {
    name: "Encino",
    slug: "encino",
    county: "Los Angeles County",
    population: 44581,
    nearbyCourthouse: "Van Nuys Courthouse",
    description: "An affluent neighborhood in the San Fernando Valley known for its residential character."
  },
  {
    name: "Tarzana",
    slug: "tarzana",
    county: "Los Angeles County",
    population: 35584,
    nearbyCourthouse: "Van Nuys Courthouse",
    description: "Named after Edgar Rice Burroughs' famous character, this Valley community has diverse legal needs."
  },
  {
    name: "Woodland Hills",
    slug: "woodland-hills",
    county: "Los Angeles County",
    population: 67006,
    nearbyCourthouse: "Van Nuys Courthouse",
    description: "A major commercial center in the western San Fernando Valley with significant business activity."
  },
  {
    name: "Beverly Hills",
    slug: "beverly-hills",
    county: "Los Angeles County",
    population: 32701,
    nearbyCourthouse: "Beverly Hills Courthouse",
    description: "World-famous for luxury and entertainment, Beverly Hills has its own dedicated courthouse."
  },
  {
    name: "Culver City",
    slug: "culver-city",
    county: "Los Angeles County",
    population: 40000,
    nearbyCourthouse: "Airport Courthouse",
    description: "Home to major entertainment studios, Culver City has unique employment and business law needs."
  },
  {
    name: "Inglewood",
    slug: "inglewood",
    county: "Los Angeles County",
    population: 107762,
    nearbyCourthouse: "Inglewood Courthouse",
    description: "Home to SoFi Stadium and the Forum, Inglewood is experiencing rapid growth and development."
  },
  {
    name: "Downey",
    slug: "downey",
    county: "Los Angeles County",
    population: 111772,
    nearbyCourthouse: "Downey Courthouse",
    description: "A major Gateway Cities community with its own courthouse serving Southeast Los Angeles."
  },
  {
    name: "Pomona",
    slug: "pomona",
    county: "Los Angeles County",
    population: 151713,
    nearbyCourthouse: "Pomona Courthouse South",
    description: "The largest city in the Pomona Valley, serving as a regional hub for legal services."
  },
  {
    name: "West Covina",
    slug: "west-covina",
    county: "Los Angeles County",
    population: 106098,
    nearbyCourthouse: "West Covina Courthouse",
    description: "A major San Gabriel Valley city with its own courthouse and diverse legal community."
  },
  {
    name: "Santa Clarita",
    slug: "santa-clarita",
    county: "Los Angeles County",
    population: 228673,
    nearbyCourthouse: "Santa Clarita Courthouse",
    description: "The third largest city in Los Angeles County, with a dedicated courthouse in Valencia."
  }
];

// All cities served (for the main areas page)
export const allCitiesServed = [
  "Acton", "Agoura Hills", "Agoura", "Agua Dulce", "Alhambra", "Altadena",
  "Arcadia", "Arleta", "Artesia", "Avalon", "Azusa", "Baldwin Park",
  "Bassett", "Bel Air", "Bell Canyon", "Bell", "Bellflower", "Belmont Shore",
  "Beverly Hills", "Bradbury", "Brentwood", "Burbank", "Calabasas", "Canoga Park",
  "Canyon Country", "Carson", "Castaic", "Century City", "Cerritos", "Chatsworth",
  "City of Commerce", "City of Industry", "Claremont", "Cole", "Commerce", "Compton",
  "Covina", "Cudahy", "Culver City", "Diamond Bar", "Downey", "Duarte",
  "Eagle Rock", "East Los Angeles", "El Monte", "El Segundo", "Elizabeth Lake", "Encino",
  "Gardena", "Glendale", "Glendora", "Granada Hills", "Hacienda Heights", "Harbor City",
  "Hawaiian Gardens", "Hawthorne", "Hazard", "Hermosa Beach", "Hidden Hills", "Hollywood",
  "Huntington Park", "Inglewood", "Irwindale", "La Canada Flintridge", "La Canada", "La Crescenta",
  "La Mirada", "La Puente", "La Verne", "Lake Hughes", "Lake Los Angeles", "Lake View Terrace",
  "Lakewood", "Lancaster", "Lawndale", "Lennox", "Leona Valley", "Littlerock",
  "Llano", "Lomita", "Long Beach", "Los Angeles", "Los Nietos", "Lynwood",
  "Malibu", "Manhattan Beach", "Mar Vista", "Marina Del Rey", "Maywood", "Mission Hills",
  "Monrovia", "Montebello", "Monterey Park", "Montrose", "Mount Baldy", "Mount Wilson",
  "Newhall", "North Hills", "North Hollywood", "Northridge", "Norwalk", "Oak Park",
  "Pacific Palisades", "Pacoima", "Palmdale", "Palos Verdes Estates", "Panorama City", "Paramount",
  "Pasadena", "Pearblossom", "Pico Rivera", "Playa Del Rey", "Pomona", "Porter Ranch",
  "Quartz Hill", "Rancho Dominguez", "Rancho Palos Verdes", "Redondo Beach", "Reseda", "Rolling Hills Estates",
  "Rolling Hills", "Rosemead", "Rowland Heights", "San Dimas", "San Fernando", "San Gabriel",
  "San Marino", "San Pedro", "Santa Clarita", "Santa Fe Springs", "Santa Monica", "Saugus",
  "Sepulveda", "Shadow Hills", "Sherman Oaks", "Sierra Madre", "Signal Hill", "South El Monte",
  "South Gate", "South Pasadena", "Studio City", "Sun Valley", "Sundale", "Sylmar",
  "Tarzana", "Temple City", "Terminal Island", "Toluca Lake", "Topanga", "Torrance",
  "Tujunga", "Universal City", "Val Verde", "Valencia", "Van Nuys", "Rancho Cucamonga"
];

// Courthouse data organized by county with coordinates for map
export interface Courthouse {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

export const courthouses: Record<string, Courthouse[]> = {
  "Los Angeles County": [
    { name: "Airport Courthouse", address: "11701 S. La Cienega Blvd., Los Angeles, CA 90045", lat: 33.9425, lng: -118.3831 },
    { name: "Alfred J. McCourtney Juvenile Justice Center", address: "1040 W. Avenue J, Lancaster, CA 93534", lat: 34.6868, lng: -118.1540 },
    { name: "Alhambra Courthouse", address: "150 W. Commonwealth Ave., Alhambra, CA 91801", lat: 34.0867, lng: -118.1270 },
    { name: "Bellflower Courthouse", address: "10025 E. Flower St., Bellflower, CA 90706", lat: 33.8817, lng: -118.1170 },
    { name: "Beverly Hills Courthouse", address: "9355 Burton Way, Beverly Hills, CA 90210", lat: 34.0696, lng: -118.3893 },
    { name: "Burbank Courthouse", address: "300 E. Olive Ave., Burbank, CA 91502", lat: 34.1808, lng: -118.3090 },
    { name: "Catalina Courthouse", address: "215 Summer Ave., Avalon, CA 90704", lat: 33.3428, lng: -118.3265 },
    { name: "Central Arraignment Courts", address: "429 Bauchet St., Los Angeles, CA 90012", lat: 34.0614, lng: -118.2318 },
    { name: "Central Civil West Courthouse", address: "600 S. Commonwealth Ave., Los Angeles, CA 90005", lat: 34.0594, lng: -118.2929 },
    { name: "Chatsworth Courthouse", address: "9425 Penfield Ave., Chatsworth, CA 91311", lat: 34.2564, lng: -118.5876 },
    { name: "Clara Shortridge Foltz Criminal Justice Center", address: "210 W. Temple St., Los Angeles, CA 90012", lat: 34.0537, lng: -118.2467 },
    { name: "Compton Courthouse", address: "200 W. Compton Blvd., Compton, CA 90220", lat: 33.8958, lng: -118.2228 },
    { name: "Downey Courthouse", address: "7500 E. Imperial Hwy., Downey, CA 90242", lat: 33.9303, lng: -118.1326 },
    { name: "East Los Angeles Courthouse", address: "4848 E. Civic Center Way, Los Angeles, CA 90022", lat: 34.0239, lng: -118.1692 },
    { name: "Eastlake Juvenile Court", address: "1601 Eastlake Ave., Los Angeles, CA 90033", lat: 34.0614, lng: -118.2158 },
    { name: "Edmund D. Edelman Children's Court", address: "201 Centre Plaza Dr., Monterey Park, CA 91754", lat: 34.0406, lng: -118.1487 },
    { name: "El Monte Courthouse", address: "11234 E. Valley Blvd., El Monte, CA 91731", lat: 34.0689, lng: -118.0276 },
    { name: "Glendale Courthouse", address: "600 E. Broadway, Glendale, CA 91206", lat: 34.1456, lng: -118.2437 },
    { name: "Governor George Deukmejian Courthouse", address: "275 Magnolia Ave., Long Beach, CA 90802", lat: 33.7701, lng: -118.1937 },
    { name: "Hollywood Courthouse", address: "5925 Hollywood Blvd., Los Angeles, CA 90028", lat: 34.1016, lng: -118.3185 },
    { name: "Inglewood Courthouse", address: "1 Regent St., Inglewood, CA 90301", lat: 33.9617, lng: -118.3531 },
    { name: "Inglewood Juvenile Courthouse", address: "110 Regent St., Inglewood, CA 90301", lat: 33.9612, lng: -118.3526 },
    { name: "Los Padrinos Juvenile Courthouse", address: "7281 E. Quill Dr., Downey, CA 90242", lat: 33.9223, lng: -118.1186 },
    { name: "Malibu Courthouse", address: "23525 Civic Center Way, Malibu, CA 90265", lat: 34.0355, lng: -118.6837 },
    { name: "Mental Health Courthouse", address: "1150 N. San Fernando Rd., Los Angeles, CA 90065", lat: 34.0928, lng: -118.2269 },
    { name: "Metropolitan Courthouse", address: "1945 S. Hill St., Los Angeles, CA 90007", lat: 34.0321, lng: -118.2614 },
    { name: "Michael Antonovich Antelope Valley Courthouse", address: "42011 4th St. W, Lancaster, CA 93534", lat: 34.6868, lng: -118.1540 },
    { name: "Norwalk Courthouse", address: "12720 Norwalk Blvd., Norwalk, CA 90650", lat: 33.9056, lng: -118.0817 },
    { name: "Pasadena Courthouse", address: "300 E. Walnut Ave., Pasadena, CA 91101", lat: 34.1478, lng: -118.1445 },
    { name: "Pomona Courthouse South", address: "400 Civic Center Plaza, Pomona, CA 91766", lat: 34.0551, lng: -117.7500 },
    { name: "San Fernando Courthouse", address: "900 Third St., San Fernando, CA 91340", lat: 34.2867, lng: -118.4370 },
    { name: "San Pedro Courthouse", address: "505 S. Centre St., San Pedro, CA 90731", lat: 33.7367, lng: -118.2923 },
    { name: "Santa Clarita Courthouse", address: "23747 W. Valencia Blvd., Santa Clarita, CA 91355", lat: 34.4208, lng: -118.5631 },
    { name: "Santa Monica Courthouse", address: "1725 Main St., Santa Monica, CA 90401", lat: 34.0133, lng: -118.4912 },
    { name: "Stanley Mosk Courthouse", address: "110 N. Hill St., Los Angeles, CA 90012", lat: 34.0537, lng: -118.2467 },
    { name: "Sylmar Juvenile Courthouse", address: "16350 Filbert St., Sylmar, CA 91342", lat: 34.3078, lng: -118.4437 },
    { name: "Torrance Courthouse", address: "825 Maple Ave., Torrance, CA 90503", lat: 33.8358, lng: -118.3406 },
    { name: "Van Nuys Courthouse East", address: "6230 Sylmar Ave., Van Nuys, CA 91401", lat: 34.1867, lng: -118.4487 },
    { name: "Van Nuys Courthouse West", address: "14400 Erwin St. Mall, Van Nuys, CA 91401", lat: 34.1867, lng: -118.4487 },
    { name: "West Covina Courthouse", address: "1427 W. Covina Pkwy., West Covina, CA 91790", lat: 34.0689, lng: -117.9389 },
    { name: "Whittier Courthouse", address: "7339 S. Painter Ave., Whittier, CA 90602", lat: 33.9589, lng: -118.0328 },
  ],
  "Orange County": [
    { name: "Central Justice Center", address: "700 Civic Center Drive West, Santa Ana, CA 92701", lat: 33.7489, lng: -117.8678 },
    { name: "Civil Complex Center", address: "751 West Santa Ana Blvd., Santa Ana, CA 92701", lat: 33.7517, lng: -117.8706 },
    { name: "Community Court (Santa Ana)", address: "909 N. Main St., Santa Ana, CA 92701", lat: 33.7567, lng: -117.8678 },
    { name: "Costa Mesa Justice Complex", address: "3390 Harbor Blvd., Costa Mesa, CA 92626", lat: 33.6856, lng: -117.9189 },
    { name: "Department CJ1 Orange County Men's Jail", address: "550 N. Flower St., Santa Ana, CA 92703", lat: 33.7556, lng: -117.8617 },
    { name: "Harbor Justice Center - Newport Beach", address: "4601 Jamboree Rd., Newport Beach, CA 92660", lat: 33.6617, lng: -117.8567 },
    { name: "Lamoreaux Justice Center", address: "341 The City Dr S, Orange, CA 92868", lat: 33.7867, lng: -117.8867 },
    { name: "North Justice Center (Fullerton)", address: "1275 N. Berkeley Ave., Fullerton, CA 92832", lat: 33.8867, lng: -117.9267 },
    { name: "Stephen K. Tamura - West Justice Center", address: "8141 13th St., Westminster, CA 92683", lat: 33.7517, lng: -117.9939 },
  ],
  "San Diego County": [
    { name: "Central Courthouse (San Diego)", address: "1100 Union Street, San Diego, CA 92101", lat: 32.7189, lng: -117.1628 },
    { name: "Hall of Justice (San Diego)", address: "330 West Broadway, San Diego, CA 92101", lat: 32.7189, lng: -117.1678 },
    { name: "Juvenile Court (San Diego)", address: "2851 Meadow Lark Drive, San Diego, CA 92123", lat: 32.8217, lng: -117.1517 },
    { name: "North County Regional Center (Vista)", address: "325 South Melrose Drive, Vista, CA 92081", lat: 33.1867, lng: -117.2517 },
    { name: "South County Regional Center (Chula Vista)", address: "500 Third Avenue, Chula Vista, CA 91910", lat: 32.6417, lng: -117.0817 },
    { name: "East County Regional Center (El Cajon)", address: "250 East Main Street, El Cajon, CA 92020", lat: 32.7917, lng: -116.9617 },
    { name: "Kearny Mesa Traffic Court", address: "8950 Clairemont Mesa Boulevard, San Diego, CA 92123", lat: 32.8317, lng: -117.1517 },
  ],
  "Ventura County": [
    { name: "East County Courthouse (Simi Valley)", address: "3855-F Alamo Street, Simi Valley, CA 93063", lat: 34.2717, lng: -118.7367 },
    { name: "Hall of Justice (Ventura)", address: "800 South Victoria Avenue, Ventura, CA 93009", lat: 34.2617, lng: -119.2617 },
    { name: "Juvenile Justice Center (Oxnard)", address: "4353 E. Vineyard Avenue, Oxnard, CA 93036", lat: 34.2317, lng: -119.1417 },
  ],
};

// Office location
export const officeLocation = {
  name: "Gurovich Law Group",
  address: "15250 Ventura Blvd., Suite 700, Sherman Oaks, CA 91403",
  lat: 34.1543,
  lng: -118.4651,
  phone: "(818) 401-4725"
};
