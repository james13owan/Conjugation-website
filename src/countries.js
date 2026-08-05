// Journey order: Mexico → Central America → Caribbean → South America → Equatorial Guinea → Spain
export const COUNTRIES = [
  {
    numId: 484, code: "MX", name: "Mexico", capital: "Mexico City", region: "North America",
    description: "The birthplace of chocolate, tacos, and ancient civilizations",
    landmark: "Chichén Itzá", center: [-102, 24], capitalCoords: [-99.13, 19.43], screenPos: { x: 36, y: 35 },
    funFacts: [
      "Mexico City is built on the ruins of the Aztec capital Tenochtitlan, which was constructed on a lake.",
      "Mexico has the world's largest pyramid by volume — the Great Pyramid of Cholula, bigger than the Great Pyramid of Giza.",
      "Mexico has 35 UNESCO World Heritage Sites — more than any other country in the Americas.",
      "The poinsettia plant, popular at Christmas worldwide, is native to Mexico.",
      "Mexico introduced chocolate, vanilla, and chili peppers to the rest of the world.",
    ],
  },
  {
    numId: 320, code: "GT", name: "Guatemala", capital: "Guatemala City", region: "Central America",
    description: "Land of volcanoes, jungles, and ancient Maya cities",
    landmark: "Tikal Pyramids", center: [-90.2, 15.5], capitalCoords: [-90.52, 14.64], screenPos: { x: 40, y: 40 },
    funFacts: [
      "Guatemala means 'place of many trees' in the Mayan language.",
      "Guatemala has 37 volcanoes, three of which are still active.",
      "The ancient Maya city of Tikal was home to over 100,000 people at its peak around 900 AD.",
      "Guatemala produces some of the finest coffee in the world, and it is the country's largest export crop.",
      "Lake Atitlán sits inside an ancient volcanic crater and is widely regarded as one of the most beautiful lakes on Earth.",
    ],
  },
  {
    numId: 222, code: "SV", name: "El Salvador", capital: "San Salvador", region: "Central America",
    description: "The smallest and most densely populated Central American nation",
    landmark: "Santa Ana Volcano", center: [-88.9, 13.8], capitalCoords: [-89.19, 13.69], screenPos: { x: 40, y: 42 },
    funFacts: [
      "El Salvador is the only Central American country without a Caribbean coastline.",
      "El Salvador became the first country in the world to adopt Bitcoin as legal tender, in 2021.",
      "The Pipil people called their homeland Cuscatlán, meaning 'place of jewels and riches.'",
      "El Salvador has over 20 volcanoes, making it one of the most volcanically active countries per square kilometre.",
      "The pupusa, El Salvador's national dish, has been made for over 2,000 years — pre-dating Spanish colonisation.",
    ],
  },
  {
    numId: 340, code: "HN", name: "Honduras", capital: "Tegucigalpa", region: "Central America",
    description: "Home to ancient ruins and pristine Caribbean beaches",
    landmark: "Copán Ruins", center: [-86.5, 14.5], capitalCoords: [-87.21, 14.10], screenPos: { x: 41, y: 41 },
    funFacts: [
      "Honduras has the second-largest barrier reef system in the world after Australia's Great Barrier Reef.",
      "The ancient Maya city of Copán had some of the most intricate stone carvings in the ancient world.",
      "Honduras is one of the top banana exporters in the world — the term 'banana republic' originally referred to Honduras.",
      "The Bay Islands of Honduras were once a stronghold of the pirate Henry Morgan.",
      "Honduras means 'great depths' in Spanish, referring to the deep waters off its northern coast.",
    ],
  },
  {
    numId: 558, code: "NI", name: "Nicaragua", capital: "Managua", region: "Central America",
    description: "Land of lakes and volcanoes in the heart of Central America",
    landmark: "Masaya Volcano", center: [-85, 12.8], capitalCoords: [-86.29, 12.13], screenPos: { x: 42, y: 42 },
    funFacts: [
      "Nicaragua has over 40 volcanoes, many still active, earning it the nickname 'Land of Lakes and Volcanoes.'",
      "Lake Nicaragua is the only freshwater lake in the world that contains oceanic animal species, including sharks.",
      "Cerro Negro is one of the world's youngest volcanoes, formed in 1850 and still very active today.",
      "Nicaragua has the lowest crime rate in Central America despite being one of its poorest nations.",
      "The poet Rubén Darío, founder of the Latin American literary movement Modernismo, was born in Nicaragua.",
    ],
  },
  {
    numId: 188, code: "CR", name: "Costa Rica", capital: "San José", region: "Central America",
    description: "Famous for biodiversity, rainforests, and no standing army",
    landmark: "Arenal Volcano", center: [-84, 10], capitalCoords: [-84.09, 9.93], screenPos: { x: 42, y: 44 },
    funFacts: [
      "Costa Rica abolished its military in 1948 — it's one of the few countries in the world with no army.",
      "Despite covering only 0.03% of Earth's surface, Costa Rica is home to 5% of the world's biodiversity.",
      "Costa Rica generates over 99% of its electricity from renewable sources including hydropower, wind, and geothermal.",
      "The phrase 'Pura Vida' ('pure life') serves as a national motto, greeting, and philosophy of life in Costa Rica.",
      "Costa Rica has more species of butterflies than the entire African continent.",
    ],
  },
  {
    numId: 591, code: "PA", name: "Panama", capital: "Panama City", region: "Central America",
    description: "Home to the famous canal connecting two oceans",
    landmark: "Panama Canal", center: [-80, 8.5], capitalCoords: [-79.52, 8.99], screenPos: { x: 43, y: 45 },
    funFacts: [
      "The Panama Canal saves ships over 8,000 miles compared to sailing around the tip of South America.",
      "Panama is one of the few places on Earth where you can watch the sun rise over the Pacific and set over the Atlantic.",
      "The Panama hat is actually from Ecuador — it got its name because it was shipped to the world via Panama.",
      "Panama City is the only capital city in the world with a rainforest within its city limits.",
      "About 14,000 ships pass through the Panama Canal each year, carrying around 5% of global trade.",
    ],
  },
  {
    numId: 192, code: "CU", name: "Cuba", capital: "Havana", region: "Caribbean",
    description: "Island of music, classic cars, revolution, and rum",
    landmark: "Old Havana", center: [-79.5, 21.5], capitalCoords: [-82.37, 23.11], screenPos: { x: 43, y: 36 },
    funFacts: [
      "Cuba has more doctors per capita than almost any other country in the world.",
      "Cuba is the largest island in the Caribbean, covering more than half the total land area of all Caribbean islands.",
      "Havana's iconic classic American cars date from before the 1959 revolution, when importing new cars became nearly impossible.",
      "Cuba is one of only five one-party communist states remaining in the world.",
      "The Cuban Missile Crisis of 1962 brought the world closer to nuclear war than at any other point in history.",
    ],
  },
  {
    numId: 214, code: "DO", name: "Dominican Republic", capital: "Santo Domingo", region: "Caribbean",
    description: "The oldest European settlement in the Americas",
    landmark: "Pico Duarte", center: [-70, 19], capitalCoords: [-69.90, 18.49], screenPos: { x: 47, y: 38 },
    funFacts: [
      "Santo Domingo was the first permanent European city in the Americas, established in 1498.",
      "The Dominican Republic shares the island of Hispaniola with Haiti — the only island shared by two separate nations.",
      "Pico Duarte is the highest peak in the Caribbean at 3,175 metres above sea level.",
      "Merengue, the national dance and music of the Dominican Republic, is a UNESCO Intangible Cultural Heritage.",
      "The Dominican Republic has the largest economy in the Caribbean and Central American region.",
    ],
  },
  {
    numId: 630, code: "PR", name: "Puerto Rico", capital: "San Juan", region: "Caribbean",
    description: "A US Commonwealth island with the only tropical rainforest in the US National Forest System",
    landmark: "El Morro", center: [-66.5, 18.2], capitalCoords: [-66.11, 18.47], screenPos: { x: 49, y: 39 },
    funFacts: [
      "El Yunque National Forest is the only tropical rainforest in the US National Forest System, home to hundreds of unique plant and animal species.",
      "The piña colada was invented in San Juan, Puerto Rico in 1954 — it is officially recognised as the island's national drink.",
      "The Arecibo Observatory in Puerto Rico was the world's largest single-dish radio telescope for over 50 years and even appeared in the James Bond film 'GoldenEye.'",
      "Puerto Rico is a US territory, yet it fields its own separate Olympic team and has competed independently in the Games since 1948.",
      "El Morro, San Juan's imposing clifftop fortress, was begun by the Spanish in 1539 and is one of the oldest European-built forts in the Americas.",
    ],
  },
  {
    numId: 862, code: "VE", name: "Venezuela", capital: "Caracas", region: "South America",
    description: "Home to Angel Falls, the world's highest uninterrupted waterfall",
    landmark: "Angel Falls", center: [-66, 8], capitalCoords: [-66.88, 10.49], screenPos: { x: 48, y: 45 },
    funFacts: [
      "Angel Falls is 979 metres tall — nearly 20 times the height of Niagara Falls.",
      "Venezuela has some of the largest proven oil reserves in the world, surpassing even Saudi Arabia.",
      "The name 'Venezuela' means 'Little Venice' — Spanish explorers named it after seeing stilted houses over Lake Maracaibo.",
      "Venezuela is home to the world's largest rodent, the capybara, which can weigh up to 65 kg.",
      "Lake Maracaibo in Venezuela has more lightning strikes than anywhere else on Earth — around 1.2 million per year.",
    ],
  },
  {
    numId: 170, code: "CO", name: "Colombia", capital: "Bogotá", region: "South America",
    description: "The only country with coasts on both the Pacific and Caribbean",
    landmark: "Cartagena", center: [-74, 4], capitalCoords: [-74.07, 4.70], screenPos: { x: 45, y: 47 },
    funFacts: [
      "Colombia is one of the world's most biodiverse countries, home to nearly 10% of all species on Earth.",
      "Colombia is the world's largest producer of emeralds, accounting for about 70–90% of global supply.",
      "Gabriel García Márquez, author of 'One Hundred Years of Solitude,' was Colombian and won the Nobel Prize in Literature in 1982.",
      "Colombia has around 1,900 species of birds — more than any other country in the world.",
      "The name Colombia honours Christopher Columbus, even though Columbus never actually set foot on Colombian soil.",
    ],
  },
  {
    numId: 218, code: "EC", name: "Ecuador", capital: "Quito", region: "South America",
    description: "Straddles the equator with the stunning Galápagos Islands",
    landmark: "Galápagos Islands", center: [-78, -2], capitalCoords: [-78.52, -0.22], screenPos: { x: 44, y: 51 },
    funFacts: [
      "Ecuador was the first country in the world to grant constitutional rights to nature, in 2008.",
      "Chimborazo's summit is the farthest point from Earth's centre — further than Everest — because Earth bulges at the equator.",
      "The Galápagos Islands inspired Charles Darwin's theory of evolution after his 1835 visit.",
      "Ecuador is the world's top exporter of bananas, shipping more than any other country.",
      "Ecuador has four distinct geographical regions: the coast, the Andes, the Amazon rainforest, and the Galápagos Islands.",
    ],
  },
  {
    numId: 604, code: "PE", name: "Peru", capital: "Lima", region: "South America",
    description: "Heart of the Inca Empire and home to Machu Picchu",
    landmark: "Machu Picchu", center: [-76, -10], capitalCoords: [-77.04, -12.05], screenPos: { x: 45, y: 57 },
    funFacts: [
      "Machu Picchu was built by the Inca around 1450 and was never discovered by Spanish conquistadors.",
      "The Amazon River, the world's largest river by volume, originates high in the Peruvian Andes.",
      "Lake Titicaca, on the Peru–Bolivia border, is the highest navigable lake in the world at 3,812 metres.",
      "The Nazca Lines are giant geoglyphs in the Peruvian desert so large they can only be appreciated from the air.",
      "Peru has the largest number of potato varieties in the world, with over 3,000 native types.",
    ],
  },
  {
    numId: 68, code: "BO", name: "Bolivia", capital: "Sucre", region: "South America",
    description: "Highest navigable lake and the world's largest salt flats",
    landmark: "Salar de Uyuni", center: [-64, -16], capitalCoords: [-65.26, -19.04], screenPos: { x: 49, y: 60 },
    funFacts: [
      "Bolivia has two capitals — Sucre and La Paz, the world's highest seat of government at 3,640 m.",
      "The Salar de Uyuni is the world's largest salt flat, covering 10,582 square kilometres.",
      "Bolivia is landlocked but maintains a navy — it hopes to one day regain sea access lost to Chile in 1884.",
      "Bolivia is home to the world's most dangerous road, the 'Death Road,' with sheer 600-metre drops.",
      "Lake Titicaca on the Bolivian border is considered the birthplace of the Inca civilisation.",
    ],
  },
  {
    numId: 600, code: "PY", name: "Paraguay", capital: "Asunción", region: "South America",
    description: "Landlocked heart of South America with rich Guaraní heritage",
    landmark: "Jesuit Missions", center: [-58, -23], capitalCoords: [-57.64, -25.29], screenPos: { x: 51, y: 65 },
    funFacts: [
      "Paraguay is the only country whose flag has different emblems on its front and back sides.",
      "Paraguay generates almost 100% of its electricity from hydropower — the Itaipú Dam is one of the world's largest power plants.",
      "Guaraní, an indigenous language, is co-official with Spanish, and most Paraguayans speak it as their first language.",
      "Paraguay fought the War of the Triple Alliance (1864–70), the deadliest war in South American history, losing up to 70% of its population.",
      "Paraguay is one of only two landlocked countries in South America, the other being Bolivia.",
    ],
  },
  {
    numId: 152, code: "CL", name: "Chile", capital: "Santiago", region: "South America",
    description: "The world's longest country, stretching from desert to Patagonia",
    landmark: "Easter Island", center: [-71, -37], capitalCoords: [-70.65, -33.46], screenPos: { x: 46, y: 74 },
    funFacts: [
      "The Atacama Desert in Chile is the driest non-polar desert on Earth — some areas have never recorded rainfall.",
      "Chile is the world's longest country from north to south, stretching 4,300 km — roughly the distance from London to Tehran.",
      "Chile produces about a third of the world's copper supply, making it the largest copper exporter on Earth.",
      "Easter Island (Rapa Nui), a Chilean territory, is one of the most remote inhabited places on Earth.",
      "The tip of Chilean Patagonia is only about 1,000 km from Antarctica, making it one of the closest inhabited areas to the continent.",
    ],
  },
  {
    numId: 32, code: "AR", name: "Argentina", capital: "Buenos Aires", region: "South America",
    description: "Land of tango, fine wine, and Patagonian wilderness",
    landmark: "Perito Moreno Glacier", center: [-65, -35], capitalCoords: [-58.38, -34.61], screenPos: { x: 48, y: 73 },
    funFacts: [
      "Argentina has more psychologists per capita than any other country in the world.",
      "Argentina is the birthplace of tango — the dance and music style that captivated the world in the early 1900s.",
      "The Perito Moreno Glacier in Patagonia is one of the few glaciers in the world that is not retreating.",
      "Patagonia contains some of the oldest dinosaur fossils ever found, including the Argentinosaurus — possibly the largest land animal ever.",
      "Buenos Aires has more bookstores per capita than any other city in the world.",
    ],
  },
  {
    numId: 858, code: "UY", name: "Uruguay", capital: "Montevideo", region: "South America",
    description: "The smallest Spanish-speaking nation in South America",
    landmark: "Colonia del Sacramento", center: [-56, -33], capitalCoords: [-56.17, -34.90], screenPos: { x: 51, y: 71 },
    funFacts: [
      "Uruguay was the first country in the world to fully legalise the production and sale of cannabis at the national level.",
      "Uruguay was the first country in Latin America to legalise same-sex marriage, in 2013.",
      "Former president José Mujica donated 90% of his presidential salary to charity and drove a 1987 Volkswagen Beetle.",
      "Uruguay has more cattle than people — roughly four cows for every one person.",
      "Uruguay was the first country in the world to provide every schoolchild with a free laptop, in 2007.",
    ],
  },
  {
    numId: 226, code: "GQ", name: "Equatorial Guinea", capital: "Malabo", region: "Africa",
    description: "The only Spanish-speaking country in Africa",
    landmark: "Monte Alén National Park", center: [10, 2], capitalCoords: [8.78, 3.75], screenPos: { x: 74, y: 49 },
    funFacts: [
      "Equatorial Guinea is the only country in mainland Africa where Spanish is an official language.",
      "Equatorial Guinea is the only African country that is a member of the Organisation of Ibero-American States.",
      "Equatorial Guinea discovered oil in the 1990s and became one of the fastest-growing economies in the world as a result.",
      "The country is split between a mainland portion (Río Muni) and several islands, including Bioko where the capital Malabo sits.",
      "Equatorial Guinea has three official languages: Spanish, French, and Portuguese — the only country in the world with all three.",
    ],
  },
  {
    numId: 724, code: "ES", name: "Spain", capital: "Madrid", region: "Europe",
    description: "Birthplace of the Spanish language and Cervantes",
    landmark: "Sagrada Família", center: [-3, 40], capitalCoords: [-3.70, 40.42], screenPos: { x: 70, y: 24 },
    funFacts: [
      "Spain is home to La Tomatina, an annual festival where participants throw over 100 tonnes of tomatoes at each other.",
      "Spain has 50 UNESCO World Heritage Sites — the second-highest number in the world.",
      "Spanish is spoken by over 500 million people worldwide, making it the second most spoken native language after Mandarin.",
      "Flamenco, Spain's iconic music and dance form, was declared a UNESCO Intangible Cultural Heritage in 2010.",
      "The Camino de Santiago pilgrimage route is over 1,000 years old and attracts more than 300,000 walkers per year.",
    ],
  },
];

export const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
export const SPANISH_ID_SET = new Set(COUNTRIES.map((c) => c.numId));
export const COINS_PER_COUNTRY = 300;
export const COINS_PER_CORRECT = 50;

export function tenseKey(tense) {
  return (tense || "all").toLowerCase().replace(/\s+/g, "_");
}

export function getCompletedCodes(tense) {
  try { return new Set(JSON.parse(localStorage.getItem(`conj_${tenseKey(tense)}_completed`) || "[]")); }
  catch { return new Set(); }
}

export function saveCompletedCodes(set, tense) {
  localStorage.setItem(`conj_${tenseKey(tense)}_completed`, JSON.stringify([...set]));
}

export function getCountryCoins(code, tense) {
  return Math.min(parseInt(localStorage.getItem(`conj_${tenseKey(tense)}_${code}`) || "0", 10), COINS_PER_COUNTRY);
}

export function saveCountryCoins(code, coins, tense) {
  localStorage.setItem(`conj_${tenseKey(tense)}_${code}`, String(Math.min(coins, COINS_PER_COUNTRY)));
}

export function getFunFactIndex(code) {
  return parseInt(localStorage.getItem(`conj_fact_${code}`) || "0", 10) % 5;
}

export function advanceFunFactIndex(code) {
  const next = (getFunFactIndex(code) + 1) % 5;
  localStorage.setItem(`conj_fact_${code}`, String(next));
}

// Countries connected by land/short bus-friendly routes.
// CU and DO are excluded so PA→CU, CU→DO, DO→CO become flight routes.
const LAND_CONNECTED = new Set(["MX","GT","HN","SV","NI","CR","PA","CO","VE","EC","PE","BO","PY","CL","UY","AR"]);

// Ferry crossings — treated like bus (zoom-in animation) but with a boat emoji.
const BOAT_ROUTES = new Set(["AR-UY"]);

export function isFlightRoute(fromCode, toCode) {
  return !(LAND_CONNECTED.has(fromCode) && LAND_CONNECTED.has(toCode));
}

export function isBoatRoute(fromCode, toCode) {
  return BOAT_ROUTES.has(`${fromCode}-${toCode}`);
}
