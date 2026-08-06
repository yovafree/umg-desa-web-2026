const universes = [
  {
    key: "prime-earth",
    label: "Prime Earth",
    summary:
      "Clark Kent al frente del Daily Planet: esperanza, ciencia y heroismo urbano en el canon principal.",
    meta: "Earth-0 / Hope-forward / Classic Superman",
    hope: "98%",
    threat: "Moderate",
    accent: { hue: 52, sat: 95 },
    ticker: [
      "Superman evacua un puente colapsado sobre Metropolis.",
      "Lois Lane publica una exclusiva sobre tecnologia kryptoniana.",
      "LexCorp niega actividad sospechosa en el centro financiero.",
      "La Liga de la Justicia monitorea un pico de energia en el cielo.",
    ],
    posts: [
      {
        title: "Clark Kent salva el centro de Metropolis durante un apagón total",
        excerpt:
          "En segundos, Superman estabiliza las torres, protege a civiles y restablece la energia con apoyo de la prensa local.",
        tag: "Metropolis",
        author: "Lois Lane",
        read: "4 min",
        time: "hace 12 min",
      },
      {
        title: "Daily Planet investiga una nueva firma de kriptonita sintetica",
        excerpt:
          "Un lote experimental promete alterar la fisiologia kryptoniana y ya genero alarma en S.T.A.R. Labs.",
        tag: "Investigacion",
        author: "Jimmy Olsen",
        read: "5 min",
        time: "hace 34 min",
      },
      {
        title: "Superman y la Liga contienen una brecha en el cielo de Kansas",
        excerpt:
          "La emergencia obliga a coordinar rescate, contención y evacuacion en una sola maniobra aérea.",
        tag: "Liga",
        author: "Perry White",
        read: "6 min",
        time: "hace 1 h",
      },
      {
        title: "La Fortaleza de la Soledad vuelve a registrar actividad",
        excerpt:
          "Los archivos kriptonianos responden a una señal que podria venir de otro universo.",
        tag: "Multiverso",
        author: "Lois Lane",
        read: "7 min",
        time: "hace 2 h",
      },
    ],
  },
  {
    key: "kingdom-come",
    label: "Kingdom Come",
    summary:
      "Un Superman veterano y solemne que vuelve a un mundo tenso, con un simbolo que aun inspira reconciliación.",
    meta: "Future Earth / Legacy / Rebuild the world",
    hope: "86%",
    threat: "High",
    accent: { hue: 41, sat: 92 },
    ticker: [
      "Superman reaparece sobre un Metropolis reconstruido.",
      "La resistencia civil discute la vuelta del simbolo kryptoniano.",
      "Nuevas patrullas coordinan evacuaciones nocturnas.",
      "Un relámpago rojo fue visto cerca de Kansas.",
    ],
    posts: [
      {
        title: "El regreso del Hombre de Acero reordena la defensa de Metropolis",
        excerpt:
          "Viejos aliados y nuevas generaciones revisan protocolos ante una crisis que exige liderazgo sereno.",
        tag: "Legado",
        author: "Lois Lane",
        read: "5 min",
        time: "hace 20 min",
      },
      {
        title: "Monitores de S.T.A.R. Labs detectan energías fuera de escala",
        excerpt:
          "Los tecnicos comparan el evento con viejas señales del multiverso y piden cautela.",
        tag: "Ciencia",
        author: "Dr. Hamilton",
        read: "4 min",
        time: "hace 45 min",
      },
      {
        title: "La nueva Liga de la Justicia ensaya una respuesta global",
        excerpt:
          "Coordinación táctica, apoyo aéreo y una visión mas humana de la protección planetaria.",
        tag: "Liga",
        author: "Wonder Woman",
        read: "6 min",
        time: "hace 1 h",
      },
      {
        title: "Visión del futuro: Superman frente a una era más dura",
        excerpt:
          "Analistas discuten como el símbolo de esperanza sobrevive cuando el mundo lo ha perdido casi todo.",
        tag: "Multiverso",
        author: "Perry White",
        read: "7 min",
        time: "hace 2 h",
      },
    ],
  },
  {
    key: "red-son",
    label: "Red Son",
    summary:
      "Clark criado bajo otra bandera: una visión política, estratégica y totalmente distinta del mismo poder kryptoniano.",
    meta: "Alternate timeline / State symbol / Cold War tension",
    hope: "74%",
    threat: "Critical",
    accent: { hue: 358, sat: 90 },
    ticker: [
      "Superman desactiva una ofensiva en la frontera del bloque rival.",
      "Los medios discuten si el símbolo es heroismo o propaganda.",
      "Satélites detectan una ruta orbital desconocida.",
      "Lex Luthor prepara una respuesta intelectual al kryptoniano.",
    ],
    posts: [
      {
        title: "Clark Kent convierte una crisis de estado en una tregua internacional",
        excerpt:
          "Diplomacia, fuerza y un cambio de rumbo que altera la narrativa de dos superpotencias.",
        tag: "Politica",
        author: "Lois Lane",
        read: "5 min",
        time: "hace 11 min",
      },
      {
        title: "Lex Luthor diseña una contraestrategia para detener a Superman",
        excerpt:
          "Ciencia, ideologia y una guerra de inteligencia entre el hombre más listo y el más fuerte.",
        tag: "LexCorp",
        author: "Lex Luthor",
        read: "6 min",
        time: "hace 29 min",
      },
      {
        title: "Sombreado rojo sobre la URSS: ¿mito o realidad kryptoniana?",
        excerpt:
          "Fotografías, testimonios y una base de datos que sugiere otra historia para el mismo héroe.",
        tag: "Historia",
        author: "Perry White",
        read: "4 min",
        time: "hace 1 h",
      },
      {
        title: "La señal multiversal se intensifica sobre Kiev",
        excerpt:
          "Una grieta dimensional podría conectar este mundo con la versión principal de Earth-0.",
        tag: "Multiverso",
        author: "Mikhail Ivanov",
        read: "7 min",
        time: "hace 2 h",
      },
    ],
  },
  {
    key: "injustice",
    label: "Injustice",
    summary:
      "Un Clark marcado por la tragedia: un blog más sombrío, con vigilancia, tensión y una esperanza en conflicto.",
    meta: "Broken world / Regime era / Dark Kryptonian pulse",
    hope: "53%",
    threat: "Severe",
    accent: { hue: 218, sat: 88 },
    ticker: [
      "Patrullas blindadas vigilan la ciudad durante el toque de queda.",
      "Batman advierte una fractura irreparable en la alianza metahumana.",
      "El cielo de Gotham muestra un patrón de energia kryptoniana.",
      "Zonas seguras fueron activadas en Metropolis norte.",
    ],
    posts: [
      {
        title: "Superman impone una nueva zona de exclusión sobre Metropolis",
        excerpt:
          "La medida divide a la ciudad entre seguridad inmediata y temor a perder la libertad.",
        tag: "Regimen",
        author: "Lois Lane",
        read: "6 min",
        time: "hace 15 min",
      },
      {
        title: "Batman prepara una respuesta táctica desde la sombra",
        excerpt:
          "Un plan de contención se abre paso entre satélites, refugios y una lucha por el control moral.",
        tag: "Batalla",
        author: "Oracle",
        read: "5 min",
        time: "hace 38 min",
      },
      {
        title: "La resistencia busca una forma de romper el cerco kryptoniano",
        excerpt:
          "Varios equipos coordinaron rutas de escape, comunicaciones y apoyo civil.",
        tag: "Resistencia",
        author: "Nightwing",
        read: "4 min",
        time: "hace 1 h",
      },
      {
        title: "Una fisura multiversal abre una ruta hacia un mundo más luminoso",
        excerpt:
          "Los observadores detectan un contraste brutal entre esta realidad y la de Prime Earth.",
        tag: "Multiverso",
        author: "The Flash",
        read: "7 min",
        time: "hace 2 h",
      },
    ],
  },
];

const postGrid = document.querySelector("#postGrid");
const postTemplate = document.querySelector("#postTemplate");
const featuredTitle = document.querySelector("#featuredTitle");
const featuredExcerpt = document.querySelector("#featuredExcerpt");
const featuredAuthor = document.querySelector("#featuredAuthor");
const featuredTime = document.querySelector("#featuredTime");
const featuredTag = document.querySelector("#featuredTag");
const tickerList = document.querySelector("#tickerList");
const tagFilters = document.querySelector("#tagFilters");
const searchInput = document.querySelector("#searchInput");
const universeButtons = document.querySelector("#universeButtons");
const universeTitle = document.querySelector("#universeTitle");
const universeSummary = document.querySelector("#universeSummary");
const universeMeta = document.querySelector("#universeMeta");
const hopeValue = document.querySelector("#hopeValue");
const threatValue = document.querySelector("#threatValue");

let activeUniverse = universes[0];
let activeTag = "Todos";
let switchingTimer;

function setBodyTheme(universe) {
  const root = document.documentElement;
  root.style.setProperty("--accent-h", String(universe.accent.hue));
  root.style.setProperty("--accent-s", `${universe.accent.sat}%`);
  document.body.dataset.universe = universe.key;
}

function renderUniverseButtons() {
  universeButtons.innerHTML = "";

  universes.forEach((universe) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = universe.label;
    button.className = "btn btn-sm btn-outline-light universe-chip";

    if (universe.key === activeUniverse.key) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => changeUniverse(universe));
    universeButtons.appendChild(button);
  });
}

function changeUniverse(universe) {
  activeUniverse = universe;
  activeTag = "Todos";
  searchInput.value = "";

  document.body.classList.remove("universe-switching");
  window.clearTimeout(switchingTimer);
  requestAnimationFrame(() => {
    document.body.classList.add("universe-switching");
    switchingTimer = window.setTimeout(() => {
      document.body.classList.remove("universe-switching");
    }, 650);
  });

  setBodyTheme(universe);
  renderUniverseButtons();
  renderUniverseInfo();
  renderFilters();
  renderFeatured();
  renderTicker();
  renderPosts();
}

function renderUniverseInfo() {
  universeTitle.textContent = activeUniverse.label;
  universeSummary.textContent = activeUniverse.summary;
  universeMeta.textContent = activeUniverse.meta;
  hopeValue.textContent = activeUniverse.hope;
  threatValue.textContent = activeUniverse.threat;
}

function renderFeatured() {
  const post = activeUniverse.posts[0];
  featuredTitle.textContent = post.title;
  featuredExcerpt.textContent = post.excerpt;
  featuredAuthor.textContent = post.author;
  featuredTime.textContent = post.time;
  featuredTag.textContent = post.tag;
}

function renderTicker() {
  tickerList.innerHTML = "";

  activeUniverse.ticker.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    tickerList.appendChild(li);
  });
}

function renderFilters() {
  tagFilters.innerHTML = "";
  const tags = ["Todos", ...new Set(activeUniverse.posts.map((post) => post.tag))];

  tags.forEach((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = tag;

    if (tag === activeTag) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeTag = tag;
      renderFilters();
      renderPosts();
    });

    tagFilters.appendChild(button);
  });
}

function renderPosts() {
  postGrid.innerHTML = "";
  const query = searchInput.value.trim().toLowerCase();

  const posts = activeUniverse.posts.filter((post) => {
    const matchesTag = activeTag === "Todos" || post.tag === activeTag;
    const matchesQuery =
      !query || `${post.title} ${post.excerpt} ${post.tag} ${post.author}`.toLowerCase().includes(query);
    return matchesTag && matchesQuery;
  });

  posts.forEach((post) => {
    const node = postTemplate.content.cloneNode(true);
    node.querySelector(".story-tag").textContent = post.tag;
    node.querySelector(".story-title").textContent = post.title;
    node.querySelector(".story-excerpt").textContent = post.excerpt;
    node.querySelector(".story-author").textContent = post.author;
    node.querySelector(".story-read").textContent = post.read;
    postGrid.appendChild(node);
  });

  if (posts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "story-card";
    empty.textContent = "No hay resultados para esa búsqueda en este universo. Prueba otro término o cambia de variante.";
    postGrid.appendChild(empty);
  }
}

function init() {
  setBodyTheme(activeUniverse);
  renderUniverseButtons();
  renderUniverseInfo();
  renderFeatured();
  renderTicker();
  renderFilters();
  renderPosts();

  searchInput.addEventListener("input", renderPosts);
}

document.addEventListener("DOMContentLoaded", init);
