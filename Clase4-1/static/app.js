const universeVariants = [
  {
    key: "earth-616",
    label: "Earth-616",
    feedLabel: "Earth-616 Feed",
    visualTheme: { hue: 355, sat: 86, name: "Scarlet Pulse" },
    bio: "Peter Parker clasico: fotografo, cientifico y heroe del barrio con decadas de historia.",
    posts: [
      {
        title: "Spider-Man frena un tren sin frenos en Queens",
        excerpt:
          "Vecinos grabaron la maniobra: red anclada entre dos puentes y una frenada que evito una tragedia.",
        tag: "Barrio",
        author: "M.J. Watson",
        read: "4 min",
        time: "hace 18 min",
      },
      {
        title: "Tecnologia aracnida: asi mejora su lanzaredes v3",
        excerpt:
          "Analizamos los nuevos cartuchos biodegradables y la precision adaptativa en pleno combate.",
        tag: "Tecnologia",
        author: "Ned Leeds",
        read: "6 min",
        time: "hace 42 min",
      },
      {
        title: "Duelo sobre Manhattan: Spidey vs. Electro",
        excerpt:
          "Una tormenta de neon, cortes de energia y una estrategia de ultima hora para evitar un colapso total.",
        tag: "Batallas",
        author: "Robbie Robertson",
        read: "5 min",
        time: "hace 1 h",
      },
      {
        title: "Cronica multiversal: encontro a otra Spider-Woman",
        excerpt:
          "Un cruce inesperado en una grieta dimensional abre dudas sobre nuevas alianzas aracnidas.",
        tag: "Multiverso",
        author: "Ganke Lee",
        read: "7 min",
        time: "hace 2 h",
      },
      {
        title: "Guia de supervivencia civil en dias de villanos",
        excerpt:
          "Rutas seguras, puntos de reunion y recomendaciones practicas para cuando suenan sirenas.",
        tag: "Comunidad",
        author: "Aunt May",
        read: "3 min",
        time: "hace 3 h",
      },
      {
        title: "Top 5 frases iconicas de Spider-Man en pleno caos",
        excerpt:
          "Humor bajo presion: recopilacion de lineas memorables que desactivaron tension en segundos.",
        tag: "Cultura",
        author: "Betty Brant",
        read: "4 min",
        time: "hace 5 h",
      },
    ],
    ticker: [
      "Doc Ock visto cerca del distrito financiero.",
      "Cierre temporal del puente Queensboro por actividad anomala.",
      "Oscorp niega pruebas con tecnologia inestable.",
      "Miles de usuarios siguen la transmision de Spidey en vivo.",
    ],
  },
  {
    key: "earth-1610",
    label: "Earth-1610",
    feedLabel: "Ultimate Feed",
    visualTheme: { hue: 202, sat: 88, name: "Ultimate Ion" },
    bio: "Peter Parker del universo Ultimate: mas joven, mas directo y con amenazas mas agresivas.",
    posts: [
      {
        title: "Ultimate Peter intercepta drones de S.H.I.E.L.D. hackeados",
        excerpt:
          "El ataque duro 90 segundos y termino con un aterrizaje forzado sobre el East River.",
        tag: "Tecnologia",
        author: "Kitty Pryde",
        read: "5 min",
        time: "hace 22 min",
      },
      {
        title: "Green Goblin desata caos en Midtown",
        excerpt:
          "Testigos reportan explosiones en cadena y una persecucion que atraveso tres avenidas.",
        tag: "Batallas",
        author: "Daily Bugle U",
        read: "6 min",
        time: "hace 50 min",
      },
      {
        title: "La mochila de Peter: laboratorio portatil completo",
        excerpt:
          "Componentes miniaturizados, sensores caseros y una interfaz improvisada para misiones rapidas.",
        tag: "Ciencia",
        author: "Mary Jane",
        read: "4 min",
        time: "hace 1 h",
      },
      {
        title: "Ultimates monitorean anomalas alrededor de Queens",
        excerpt:
          "Aumenta la actividad dimensional en zonas donde Peter ya habia intervenido antes.",
        tag: "Multiverso",
        author: "Nick Fury",
        read: "7 min",
        time: "hace 2 h",
      },
    ],
    ticker: [
      "Reporte: simbiote detectado en laboratorio clandestino.",
      "Escuelas de Queens activan protocolo de refugio temporal.",
      "S.H.I.E.L.D. confirma colaboracion puntual con Spider-Man.",
      "Foros juveniles convierten a Peter en tendencia global.",
    ],
  },
  {
    key: "earth-65",
    label: "Earth-65",
    feedLabel: "Earth-65 Spotlight",
    visualTheme: { hue: 319, sat: 82, name: "Neon Graffiti" },
    bio: "Version alternativa inspirada por el estilo urbano de Gwen: Peter destaca por su faceta artistica y rebelde.",
    posts: [
      {
        title: "Peter Parker convierte un mural en mapa de rescate",
        excerpt:
          "El arte callejero escondia rutas seguras para evacuar durante un apagao masivo.",
        tag: "Cultura",
        author: "Gloria Grant",
        read: "4 min",
        time: "hace 19 min",
      },
      {
        title: "Concierto benefico termina en batalla contra Rhino",
        excerpt:
          "Spider-Man improviso un escenario elevado para proteger a cientos de asistentes.",
        tag: "Batallas",
        author: "J. Jonah Jamison",
        read: "5 min",
        time: "hace 47 min",
      },
      {
        title: "Moda aracnida: mascaras personalizadas del East Side",
        excerpt:
          "Comerciantes locales lanzan edicion limitada inspirada en el traje de Peter.",
        tag: "Comunidad",
        author: "May Parker",
        read: "3 min",
        time: "hace 1 h",
      },
      {
        title: "Se abre portal sobre Brooklyn durante ensayo nocturno",
        excerpt:
          "La distorsion dura 12 segundos y deja rastros de energia fuera de patron.",
        tag: "Multiverso",
        author: "Cindy Moon",
        read: "6 min",
        time: "hace 2 h",
      },
    ],
    ticker: [
      "Bandas locales componen tema dedicado al Spider de Earth-65.",
      "Nueva ruta de patrullaje colaborativa entre vecinos y heroe.",
      "Laboratorios independientes prueban fibras ultraelasticas.",
      "Grafiti multiversal aparece en cinco distritos al amanecer.",
    ],
  },
  {
    key: "earth-12041",
    label: "Earth-12041",
    feedLabel: "Animated Web Feed",
    visualTheme: { hue: 52, sat: 92, name: "Animated Gold" },
    bio: "Peter de la serie animada clasica: estratega rapido, humor afilado y caos multiversal constante.",
    posts: [
      {
        title: "Spider-Man animado evita colision en el metro elevado",
        excerpt:
          "Con una cadena de acrobacias milimetricas, Peter estabilizo el convoy en menos de un minuto.",
        tag: "Barrio",
        author: "Debra Whitman",
        read: "4 min",
        time: "hace 26 min",
      },
      {
        title: "Kingpin financia tecnologia anti-red de ultima generacion",
        excerpt:
          "Informantes revelan pruebas secretas para neutralizar movilidad aracnida.",
        tag: "Investigacion",
        author: "Ben Urich",
        read: "8 min",
        time: "hace 1 h",
      },
      {
        title: "Madame Web detecta picos de actividad dimensional",
        excerpt:
          "Peter recibe nuevas coordenadas que apuntan a alianzas entre realidades.",
        tag: "Multiverso",
        author: "Madame Web",
        read: "6 min",
        time: "hace 2 h",
      },
      {
        title: "Especial: mejores planes tacticos del Spider animado",
        excerpt:
          "Repasamos maniobras clasicas contra Sinister Six que siguen vigentes hoy.",
        tag: "Estrategia",
        author: "Felicia Hardy",
        read: "5 min",
        time: "hace 4 h",
      },
    ],
    ticker: [
      "Shocker reaparece con guantes potenciados.",
      "Avistamiento de simbionte en zona industrial.",
      "Madame Web confirma cruces entre cuatro realidades.",
      "La audiencia rompe record en la señal aracnida nocturna.",
    ],
  },
];

const themes = [
  { name: "Scarlet Pulse", hue: 355, sat: 86 },
  { name: "Daily Blue", hue: 210, sat: 82 },
  { name: "Neon Citrus", hue: 110, sat: 88 },
  { name: "Sunset Dash", hue: 24, sat: 92 },
  { name: "Steel Spider", hue: 265, sat: 72 },
];

const postGrid = document.querySelector("#postGrid");
const postTemplate = document.querySelector("#postTemplate");
const heroTitle = document.querySelector("#heroTitle");
const heroExcerpt = document.querySelector("#heroExcerpt");
const heroTag = document.querySelector("#heroTag");
const heroTime = document.querySelector("#heroTime");
const ticker = document.querySelector("#ticker");
const tagFilters = document.querySelector("#tagFilters");
const searchInput = document.querySelector("#searchInput");
const paletteButtons = document.querySelector("#paletteButtons");
const themeName = document.querySelector("#themeName");
const hueRange = document.querySelector("#hueRange");
const satRange = document.querySelector("#satRange");
const surpriseBtn = document.querySelector("#surpriseBtn");
const clock = document.querySelector("#clock");
const universeButtons = document.querySelector("#universeButtons");
const universeName = document.querySelector("#universeName");
const universeBio = document.querySelector("#universeBio");
const feedLabel = document.querySelector("#feedLabel");

let activeTag = "Todos";
let activeTheme = themes[0];
let activeUniverse = universeVariants[0];
let transitionTimeoutId;

function setTheme(hue, sat, name = "Custom") {
  const root = document.documentElement;
  root.style.setProperty("--accent-h", String(hue));
  root.style.setProperty("--accent-s", `${sat}%`);

  themeName.textContent = `Tema: ${name}`;

  activeTheme = { name, hue, sat };
  hueRange.value = String(hue);
  satRange.value = String(sat);
}

function renderPalette() {
  paletteButtons.innerHTML = "";

  themes.forEach((theme) => {
    const button = document.createElement("button");
    button.className = "palette-btn";
    button.title = theme.name;
    button.style.background = `hsl(${theme.hue}, ${theme.sat}%, 56%)`;

    if (theme.name === activeTheme.name) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      setTheme(theme.hue, theme.sat, theme.name);
      highlightActivePalette(theme.name);
    });

    paletteButtons.appendChild(button);
  });
}

function highlightActivePalette(name) {
  [...paletteButtons.children].forEach((btn, idx) => {
    btn.classList.toggle("active", themes[idx].name === name);
  });
}

function renderTicker() {
  ticker.innerHTML = "";

  activeUniverse.ticker.forEach((item) => {
    const li = document.createElement("li");
    li.className = "ticker-item";
    li.textContent = item;
    ticker.appendChild(li);
  });
}

function renderHero() {
  const featured = activeUniverse.posts[0];
  heroTitle.textContent = featured.title;
  heroExcerpt.textContent = featured.excerpt;
  heroTag.textContent = featured.tag;
  heroTime.textContent = featured.time;
}

function uniqueTags() {
  return ["Todos", ...new Set(activeUniverse.posts.map((post) => post.tag))];
}

function renderFilters() {
  tagFilters.innerHTML = "";

  uniqueTags().forEach((tag) => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.className =
      "rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest transition hover:border-white/40";

    if (tag === activeTag) {
      btn.style.background = "color-mix(in hsl, var(--accent) 22%, rgba(255,255,255,0.08))";
      btn.style.borderColor = "color-mix(in hsl, var(--accent) 60%, #ffffff)";
    }

    btn.addEventListener("click", () => {
      activeTag = tag;
      renderFilters();
      renderPosts();
    });

    tagFilters.appendChild(btn);
  });
}

function matchesSearch(post, text) {
  const haystack = `${post.title} ${post.excerpt} ${post.tag} ${post.author}`.toLowerCase();
  return haystack.includes(text.toLowerCase());
}

function renderPosts() {
  postGrid.innerHTML = "";

  const query = searchInput.value.trim();

  const filtered = activeUniverse.posts.filter((post) => {
    const tagOk = activeTag === "Todos" || post.tag === activeTag;
    const queryOk = query.length === 0 || matchesSearch(post, query);
    return tagOk && queryOk;
  });

  filtered.forEach((post) => {
    const node = postTemplate.content.cloneNode(true);
    node.querySelector(".post-tag").textContent = post.tag;
    node.querySelector(".post-title").textContent = post.title;
    node.querySelector(".post-excerpt").textContent = post.excerpt;
    node.querySelector(".post-author").textContent = post.author;
    node.querySelector(".post-read").textContent = post.read;
    postGrid.appendChild(node);
  });

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "col-span-full rounded-xl border border-white/10 bg-zinc-900/70 p-5 text-sm text-zinc-300";
    empty.textContent = "No hay resultados. Prueba con otro filtro o cambia el termino de busqueda.";
    postGrid.appendChild(empty);
  }

  revealOnScroll();
}

function renderUniverseSelector() {
  universeButtons.innerHTML = "";

  universeVariants.forEach((variant) => {
    const btn = document.createElement("button");
    btn.textContent = variant.label;
    btn.className = "universe-btn";
    btn.classList.toggle("active", variant.key === activeUniverse.key);

    btn.addEventListener("click", () => {
      activeUniverse = variant;
      activeTag = "Todos";
      searchInput.value = "";
      triggerUniverseTransition();
      renderUniverseMeta();
      renderUniverseSelector();
      renderHero();
      renderTicker();
      renderFilters();
      renderPosts();
      applyUniverseVisualTheme();
    });

    universeButtons.appendChild(btn);
  });
}

function renderUniverseMeta() {
  universeName.textContent = `Universo activo: ${activeUniverse.label}`;
  universeBio.textContent = activeUniverse.bio;
  feedLabel.textContent = activeUniverse.feedLabel;
  document.body.dataset.universe = activeUniverse.key;
}

function applyUniverseVisualTheme() {
  const { hue, sat, name } = activeUniverse.visualTheme;
  setTheme(hue, sat, name);
  highlightActivePalette("__none__");
}

function triggerUniverseTransition() {
  document.body.classList.remove("universe-switching");
  if (transitionTimeoutId) {
    clearTimeout(transitionTimeoutId);
  }

  requestAnimationFrame(() => {
    document.body.classList.add("universe-switching");
    transitionTimeoutId = setTimeout(() => {
      document.body.classList.remove("universe-switching");
    }, 650);
  });
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal:not(.in)").forEach((el) => observer.observe(el));
}

function attachEvents() {
  searchInput.addEventListener("input", renderPosts);

  hueRange.addEventListener("input", (event) => {
    setTheme(Number(event.target.value), Number(satRange.value), "Custom Hue");
    highlightActivePalette("__none__");
  });

  satRange.addEventListener("input", (event) => {
    setTheme(Number(hueRange.value), Number(event.target.value), "Custom Hue");
    highlightActivePalette("__none__");
  });

  surpriseBtn.addEventListener("click", () => {
    const surpriseHue = Math.floor(Math.random() * 361);
    const surpriseSat = 65 + Math.floor(Math.random() * 31);
    setTheme(surpriseHue, surpriseSat, "Spider Surprise");
    highlightActivePalette("__none__");
  });

  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth) * 14 - 7;
    const y = (event.clientY / window.innerHeight) * 12 - 6;
    document.getElementById("bgGlow").style.transform = `translate(${x}px, ${y}px)`;
  });
}

function startClock() {
  const update = () => {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("es-GT", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    clock.textContent = `NYC Feed | ${fmt.format(now)}`;
  };

  update();
  setInterval(update, 1000);
}

function init() {
  applyUniverseVisualTheme();
  renderUniverseMeta();
  renderUniverseSelector();
  renderPalette();
  renderTicker();
  renderHero();
  renderFilters();
  renderPosts();
  attachEvents();
  startClock();
}

init();
