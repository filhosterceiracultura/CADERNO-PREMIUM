const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SECURITY_KEY = 'cadernoEspecial.v2.security';
const DATA_KEY = 'cadernoEspecial.v2.encryptedData';
const AUTO_LOCK_MS = 5 * 60 * 1000;
const FIREBASE_SDK_VERSION = '12.17.1';

const COVER_OPTIONS = Array.from({ length: 34 }, (_, index) => `assets/capas-espiral/capa-${String(index + 1).padStart(2, '0')}.webp`);

const FLAG_CODES = `AF AL DE AD AO AG SA DZ AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BO BA BW BR BN BG BF BI BT CV CM KH CA QA KZ TD CL CN CY CO KM CG CD KP KR CI CR HR CU DK DJ DM EG SV AE EC ER SK SI ES US EE SZ ET FJ PH FI FR GA GM GH GE GD GR GT GY GN GW GQ HT HN HU YE MH SB IN ID IR IQ IE IS IL IT JM JP JO KI KW LA LS LV LB LR LY LI LT LU MK MG MY MW MV ML MT MA MU MR MX FM MD MC MN ME MZ MM NA NR NP NI NE NG NO NZ OM NL PW PA PG PK PY PE PL PT KE KG GB CF CZ DO RO RW RU WS KN SM VC LC ST SN RS SC SL SG SY SO LK ZA SD SS SE CH SR TJ TH TL TG TO TT TN TM TR TV UA UG UY UZ VU VA VE VN ZM ZW`.split(' ');

const TEXT_COLLECTIONS = [
  {
    title: 'Palavras que acolhem',
    note: '20 adesivos delicados para sentimentos, ideias e motivação.',
    theme: 'words',
    items: [
      '✦ Gratidão', '♡ Amor', '✦ Paz', '✦ Coragem', '♡ Esperança',
      '☁ Pausa', 'Respire', 'Hoje', 'Prioridade', 'Importante',
      '✓ Feito', 'Começar', 'Recomeçar', 'Celebre', 'Foco',
      'Leveza', 'Presença', 'Cuidar de mim', 'Um passo de cada vez', 'Eu consigo'
    ]
  },
  {
    title: 'Dias e meses',
    note: 'Os sete dias, os doze meses e um marcador para hoje.',
    theme: 'calendar',
    items: [
      'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira',
      'Sábado', 'Domingo', 'Janeiro', 'Fevereiro', 'Março',
      'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro', '✦ Hoje'
    ]
  },
  {
    title: 'Mundo e caminhos',
    note: '20 adesivos para travessias, pertencimento e vida intercultural.',
    theme: 'world',
    items: [
      '🗺 Mapa-múndi', '🌍 Meu mundo', '✈ Viagem', '⌂ Novo lar', '⌖ Países',
      '↔ Travessia', '♡ Pertencimento', 'Chegada', 'Partida', 'Raízes',
      'Asas', 'Entre culturas', 'Minha história', 'Meu lugar', 'Conexões',
      'Saudade', 'Descoberta', 'Reentrada', 'Adaptação', 'Casa é onde...'
    ]
  },
  {
    title: 'Promessas bíblicas',
    note: '20 promessas breves, coloridas e com suas referências.',
    theme: 'bible',
    items: [
      'O Senhor é meu pastor. — Salmo 23:1',
      'Deus é nosso refúgio e fortaleza. — Salmo 46:1',
      'Não temas, porque eu sou contigo. — Isaías 41:10',
      'A minha graça te basta. — 2 Coríntios 12:9',
      'Tudo posso naquele que me fortalece. — Filipenses 4:13',
      'Entregue seu caminho ao Senhor. — Salmo 37:5',
      'A alegria vem pela manhã. — Salmo 30:5',
      'A alegria do Senhor é sua força. — Neemias 8:10',
      'Eu conheço os planos que tenho para vocês. — Jeremias 29:11',
      'Em paz me deito e adormeço. — Salmo 4:8',
      'O Senhor é bom e fortaleza. — Naum 1:7',
      'Ele cura os de coração quebrantado. — Salmo 147:3',
      'Nada nos separará do amor de Deus. — Romanos 8:39',
      'Seja forte e corajoso. — Josué 1:9',
      'O Senhor lutará por vocês. — Êxodo 14:14',
      'Tua palavra é lâmpada para meus pés. — Salmo 119:105',
      'Clame a mim, e eu responderei. — Jeremias 33:3',
      'Lancem sobre Ele toda ansiedade. — 1 Pedro 5:7',
      'Fiel é aquele que prometeu. — Hebreus 10:23',
      'O amor jamais acaba. — 1 Coríntios 13:8'
    ]
  }
];

const IMAGE_COLLECTIONS = [
  { title: 'Emoções', folder: 'emocoes', total: 10 },
  { title: 'Terapia e cuidado', folder: 'terapia', total: 10 },
  { title: 'Psicologia', folder: 'psicologia', total: 10 },
  { title: 'Natureza', folder: 'natureza', total: 10 },
  { title: 'Exterior e viagens', folder: 'exterior', total: 10 },
  { title: 'Organização', folder: 'organizacao', numbers: [1, 2, 3, 5] },
  { title: 'Acolhimento', folder: 'acolhimento', total: 5 }
];

const LEGACY_DEFAULT_NOTEBOOKS = [
  ['Projetos PHILHOS', 'Projetos e materiais', 'assets/capas-espiral/capa-29.webp'],
  ['Capacitação', 'Aulas e formações', 'assets/capas-espiral/capa-26.webp'],
  ['Coordenação CTC', 'Coordenação e conexões', 'assets/capas-espiral/capa-25.webp'],
  ['Mesa CTC', 'Encontros e decisões', 'assets/capas-espiral/capa-27.webp'],
  ['Criações em Andamento', 'Ideias e próximos passos', 'assets/capas-espiral/capa-24.webp'],
  ['Psi Terapia no Exterior', 'Sessões e materiais', 'assets/capas-espiral/capa-28.webp'],
  ['Formação Intercultural', 'Curso Psi Terapia no Exterior', 'assets/capas-espiral/capa-31.webp'],
  ['Caderno PHILHOS', 'Projetos e materiais', 'assets/capas-espiral/capa-33.webp'],
  ['Caderno Bíblico', 'Reflexões e promessas', 'assets/capas-espiral/capa-32.webp'],
  ['Caderno CTC', 'Coordenação e conexões', 'assets/capas-espiral/capa-30.webp'],
  ['Caderno Girassóis', 'Natureza e inspirações', 'assets/capas-espiral/capa-01.webp'],
  ['Caderno Rosa e Dourado', 'Ideias delicadas', 'assets/capas-espiral/capa-02.webp'],
  ['Caderno Aquarela Rosa', 'Escritas e reflexões', 'assets/capas-espiral/capa-03.webp'],
  ['Caderno Jesus', 'Fé e esperança', 'assets/capas-espiral/capa-04.webp'],
  ['Caderno de Anotações', 'Notas do dia', 'assets/capas-espiral/capa-05.webp'],
  ['Meu Diário', 'Memórias e sonhos', 'assets/capas-espiral/capa-06.webp'],
  ['Caderno Floral', 'Flores e pensamentos', 'assets/capas-espiral/capa-07.webp'],
  ['Caderno Foco', 'Disciplina e produtividade', 'assets/capas-espiral/capa-08.webp'],
  ['Caderno Azul Clássico', 'Estudos e projetos', 'assets/capas-espiral/capa-09.webp'],
  ['Caderno Verde Elegante', 'Planos e caminhos', 'assets/capas-espiral/capa-10.webp'],
  ['Caderno Borboletas', 'Sonhos e transformações', 'assets/capas-espiral/capa-11.webp'],
  ['Caderno Verde Essencial', 'Escritas livres', 'assets/capas-espiral/capa-12.webp'],
  ['Caderno Caminhos', 'Jornada e crescimento', 'assets/capas-espiral/capa-13.webp'],
  ['Caderno Paisagem', 'Paisagens e descanso', 'assets/capas-espiral/capa-14.webp'],
  ['Caderno Aquarela Natural', 'Reflexões serenas', 'assets/capas-espiral/capa-15.webp'],
  ['Caderno Fundo do Mar', 'Descobertas e criatividade', 'assets/capas-espiral/capa-16.webp'],
  ['Caderno Menina e Borboletas', 'Sensibilidade e inspiração', 'assets/capas-espiral/capa-17.webp'],
  ['Caderno Ondas Azuis', 'Ondas e emoções', 'assets/capas-espiral/capa-18.webp'],
  ['Meu Planner', 'Planejamento de vida', 'assets/capas-espiral/capa-19.webp'],
  ['Caderno Barco', 'Viagens e sonhos', 'assets/capas-espiral/capa-20.webp'],
  ['Caderno Mar', 'Mar e tranquilidade', 'assets/capas-espiral/capa-21.webp'],
  ['Caderno Céu e Montanhas', 'Céu e horizontes', 'assets/capas-espiral/capa-22.webp'],
  ['Caderno Unicórnio', 'Imaginação e sonhos', 'assets/capas-espiral/capa-23.webp'],
  ['Caderno Conexões pelo Mundo', 'Conexões e projetos', 'assets/capas-espiral/capa-34.webp']
];

const STARTER_NOTEBOOK = ['Conexões pelo Mundo', 'Conexões e projetos', 'assets/capas-espiral/capa-34.webp'];

const LEGACY_COVER_MAP = {
  'assets/philhos.png': 'assets/capas-espiral/capa-29.webp',
  'assets/philhos.webp': 'assets/capas-espiral/capa-29.webp',
  'assets/capacitacao.png': 'assets/capas-espiral/capa-26.webp',
  'assets/capacitacao.webp': 'assets/capas-espiral/capa-26.webp',
  'assets/coordenacao-ctc.png': 'assets/capas-espiral/capa-25.webp',
  'assets/coordenacao-ctc.webp': 'assets/capas-espiral/capa-25.webp',
  'assets/mesa-ctc.png': 'assets/capas-espiral/capa-27.webp',
  'assets/mesa-ctc.webp': 'assets/capas-espiral/capa-27.webp',
  'assets/criacoes.png': 'assets/capas-espiral/capa-24.webp',
  'assets/criacoes.webp': 'assets/capas-espiral/capa-24.webp',
  'assets/psi-terapia-exterior.png': 'assets/capas-espiral/capa-28.webp',
  'assets/psi-terapia-exterior.webp': 'assets/capas-espiral/capa-28.webp',
  'assets/capas/formacao-psicologia-intercultural.png': 'assets/capas-espiral/capa-31.webp',
  'assets/capas/formacao-psicologia-intercultural.webp': 'assets/capas-espiral/capa-31.webp',
  'assets/capas/philhos-azul.png': 'assets/capas-espiral/capa-33.webp',
  'assets/capas/philhos-azul.webp': 'assets/capas-espiral/capa-33.webp',
  'assets/capas/biblia-verde.png': 'assets/capas-espiral/capa-32.webp',
  'assets/capas/biblia-verde.webp': 'assets/capas-espiral/capa-32.webp',
  'assets/capas/ctc-laranja.png': 'assets/capas-espiral/capa-30.webp',
  'assets/capas/ctc-laranja.webp': 'assets/capas-espiral/capa-30.webp'
};

let state = null;
let localCryptoKey = null;
let activeNotebookId = null;
let currentPageIndex = 0;
let managedNotebookId = null;
let selectedNewCover = COVER_OPTIONS[0];
let selectedStickerId = null;
let coverDraft = null;
let coverDrag = null;
let saveTimer = null;
let toastTimer = null;
let autoLockTimer = null;
let saveChain = Promise.resolve();
let firebaseApi = null;
let firestoreDb = null;
let syncUnsubscribe = null;
let remoteWriteTimer = null;
let receivingRemote = false;
let inkTool = 'none';
let inkActiveStroke = null;
let inkRedoStack = [];
let inkResizeFrame = null;
let inkResizeObserver = null;
let paginationFrame = null;
let paginating = false;

const uid = () => `${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const clone = value => JSON.parse(JSON.stringify(value));
const bytesToBase64 = bytes => btoa(String.fromCharCode(...bytes));
const base64ToBytes = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));
const bytesToBase64Url = bytes => bytesToBase64(bytes).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
const base64UrlToBytes = value => base64ToBytes(value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4));

function defaultCoverText(title = '') {
  return {
    title,
    subtitle: '',
    font: 'Georgia, serif',
    color: '#fff8e8',
    titleSize: 31,
    subtitleSize: 17,
    titlePosition: { x: 50, y: 34 },
    subtitlePosition: { x: 50, y: 47 }
  };
}

function createPage(title = 'Página 1') {
  return {
    id: uid(),
    title,
    body: '',
    stickers: [],
    ink: { strokes: [] },
    smart: { summary: null, infographic: null },
    autoCreated: false
  };
}

function createNotebook(name, description, cover, showTitle = false) {
  return {
    id: uid(),
    name,
    description,
    cover,
    coverText: defaultCoverText(showTitle ? name : ''),
    pages: [createPage()],
    updatedAt: Date.now()
  };
}

function createDefaultState() {
  return {
    version: 8,
    spiralCoverSetVersion: 2,
    shelfSetupVersion: 2,
    notebooks: [createNotebook(...STARTER_NOTEBOOK, false)],
    customStickers: [],
    sync: { code: '' },
    updatedAt: Date.now()
  };
}

function isUntouchedLegacyNotebook(notebook, template) {
  if (!template || notebook.name !== template[0] || notebook.description !== template[1] || notebook.cover !== template[2]) return false;
  if (notebook.coverText?.title || notebook.coverText?.subtitle) return false;
  if (!Array.isArray(notebook.pages) || notebook.pages.length !== 1) return false;
  const [page] = notebook.pages;
  return page?.title === 'Página 1' && !page.body && (!Array.isArray(page.stickers) || page.stickers.length === 0);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function setSaveIndicator(text, saving = false) {
  const indicator = $('#saveIndicator');
  indicator.textContent = text;
  indicator.classList.toggle('saving', saving);
}

async function sha256(bytes) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
}

function equalBytes(first, second) {
  if (first.length !== second.length) return false;
  let difference = 0;
  for (let index = 0; index < first.length; index += 1) difference |= first[index] ^ second[index];
  return difference === 0;
}

async function derivePasswordMaterial(password, saltBytes) {
  const base = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: 180000, hash: 'SHA-256' }, base, 256);
  return new Uint8Array(bits);
}

async function importAesKey(material) {
  return crypto.subtle.importKey('raw', material, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function passwordVerifier(material) {
  const marker = encoder.encode('caderno-especial-verificador-v2');
  const combined = new Uint8Array(material.length + marker.length);
  combined.set(material);
  combined.set(marker, material.length);
  return sha256(combined);
}

async function encryptObject(value, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(value)));
  return { iv: bytesToBase64(iv), cipher: bytesToBase64(new Uint8Array(cipher)) };
}

async function decryptObject(value, key) {
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(value.iv) }, key, base64ToBytes(value.cipher));
  return JSON.parse(decoder.decode(plain));
}

function currentNotebook() {
  return state?.notebooks.find(notebook => notebook.id === activeNotebookId) || null;
}

function currentPage() {
  const notebook = currentNotebook();
  return notebook?.pages[currentPageIndex] || null;
}

function securityMetadata() {
  try { return JSON.parse(localStorage.getItem(SECURITY_KEY)); } catch { return null; }
}

async function createPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const material = await derivePasswordMaterial(password, salt);
  const verifier = await passwordVerifier(material);
  localStorage.setItem(SECURITY_KEY, JSON.stringify({ version: 2, salt: bytesToBase64(salt), verifier: bytesToBase64(verifier) }));
  localCryptoKey = await importAesKey(material);
  state = createDefaultState();
  await persistState(false);
}

async function verifyAndUnlock(password) {
  const metadata = securityMetadata();
  if (!metadata) return false;
  const material = await derivePasswordMaterial(password, base64ToBytes(metadata.salt));
  const verifier = await passwordVerifier(material);
  if (!equalBytes(verifier, base64ToBytes(metadata.verifier))) return false;
  const candidateKey = await importAesKey(material);
  const encrypted = localStorage.getItem(DATA_KEY);
  state = encrypted ? await decryptObject(JSON.parse(encrypted), candidateKey) : createDefaultState();
  localCryptoKey = candidateKey;
  normalizeState();
  await persistState(false);
  return true;
}

function normalizeState() {
  if (!state || !Array.isArray(state.notebooks)) state = createDefaultState();
  state.version = 8;
  state.customStickers ||= [];
  state.sync ||= { code: '' };
  state.notebooks.forEach(notebook => {
    notebook.id ||= uid();
    notebook.cover = LEGACY_COVER_MAP[notebook.cover] || notebook.cover;
    if (notebook.name === 'Agenda PHILHOS') notebook.name = 'Caderno PHILHOS';
    if (notebook.name === 'Agenda Bíblica') notebook.name = 'Caderno Bíblico';
    if (notebook.name === 'Agenda CTC') notebook.name = 'Caderno CTC';
    notebook.coverText = { ...defaultCoverText(), ...(notebook.coverText || {}) };
    notebook.pages ||= [createPage()];
    notebook.pages.forEach(page => {
      page.id ||= uid();
      page.stickers ||= [];
      page.ink ||= { strokes: [] };
      page.ink.strokes ||= [];
      page.smart ||= { summary: null, infographic: null };
      page.smart.summary ||= null;
      page.smart.infographic ||= null;
      page.autoCreated = Boolean(page.autoCreated);
      page.stickers = page.stickers.filter(sticker => !String(sticker.src || '').endsWith('/organizacao-04.png'));
      page.stickers.forEach(sticker => {
        if (typeof sticker.src === 'string' && sticker.src.startsWith('assets/stickers/') && sticker.src.endsWith('.png')) {
          sticker.src = sticker.src.replace(/\.png$/, '.webp');
        }
      });
      page.body ||= '';
    });
  });
  if ((state.shelfSetupVersion || 0) < 2) {
    state.notebooks = state.notebooks.filter(notebook => {
      const template = LEGACY_DEFAULT_NOTEBOOKS.find(item => item[2] === notebook.cover);
      if (notebook.cover === STARTER_NOTEBOOK[2]) return true;
      return !isUntouchedLegacyNotebook(notebook, template);
    });
    const starter = state.notebooks.find(notebook => notebook.cover === STARTER_NOTEBOOK[2]);
    const starterTemplate = LEGACY_DEFAULT_NOTEBOOKS.find(item => item[2] === STARTER_NOTEBOOK[2]);
    if (starter && isUntouchedLegacyNotebook(starter, starterTemplate)) {
      starter.name = STARTER_NOTEBOOK[0];
      starter.description = STARTER_NOTEBOOK[1];
    }
    state.shelfSetupVersion = 2;
    state.spiralCoverSetVersion = 2;
  }
}

async function persistState(pushRemote = true) {
  if (!state || !localCryptoKey) return;
  state.updatedAt = Date.now();
  const encrypted = await encryptObject(state, localCryptoKey);
  localStorage.setItem(DATA_KEY, JSON.stringify(encrypted));
  setSaveIndicator('Salvo');
  if (pushRemote && state.sync?.code && !receivingRemote) scheduleRemoteWrite();
}

function queueSave(pushRemote = true) {
  setSaveIndicator('Salvando…', true);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveChain = saveChain.then(() => persistState(pushRemote)).catch(() => showToast('Não foi possível salvar esta alteração.'));
  }, 280);
}

function resetAutoLock() {
  if (!localCryptoKey) return;
  clearTimeout(autoLockTimer);
  autoLockTimer = setTimeout(() => lockApplication(true), AUTO_LOCK_MS);
}

async function unlockApplication() {
  $('#lockScreen').classList.add('unlocked');
  $('#appShell').classList.add('ready');
  $('#appShell').setAttribute('aria-hidden', 'false');
  renderAll();
  resetAutoLock();
  await initializeFirebase();
  if (state.sync?.code) startRealtimeSync().catch(() => updateSyncStatus('waiting', 'Sincronização pendente'));
}

async function lockApplication(automatic = false) {
  syncCurrentPageFromEditor();
  await persistState();
  stopRealtimeSync();
  localCryptoKey = null;
  state = null;
  activeNotebookId = null;
  currentPageIndex = 0;
  selectedStickerId = null;
  inkTool = 'none';
  inkActiveStroke = null;
  inkRedoStack = [];
  $('.paper').classList.remove('ink-active');
  $$('.placed-sticker').forEach(element => element.remove());
  $('#writingArea').innerHTML = '';
  $('#pageTitle').value = '';
  $$('dialog[open]').forEach(dialog => dialog.close());
  $('#coverPreview').classList.remove('active');
  $('#appShell').classList.remove('ready');
  $('#appShell').setAttribute('aria-hidden', 'true');
  $('#lockScreen').classList.remove('unlocked');
  $('#passwordInput').value = '';
  $('#passwordInput').focus();
  if (automatic) $('#lockText').textContent = 'O Caderno foi bloqueado após 5 minutos sem uso. Digite sua senha para entrar.';
}

function applyCoverVariables(element, coverText) {
  element.style.setProperty('--cover-color', coverText.color);
  element.style.setProperty('--cover-font', coverText.font);
  element.style.setProperty('--title-size', `${coverText.titleSize}px`);
  element.style.setProperty('--subtitle-size', `${coverText.subtitleSize}px`);
}

function makeCoverWriting(className, text, position) {
  const writing = document.createElement('span');
  writing.className = `notebook-cover-writing ${className}`;
  writing.textContent = text;
  writing.style.setProperty('--x', `${position.x}%`);
  writing.style.setProperty('--y', `${position.y}%`);
  return writing;
}

function renderShelf() {
  const grid = $('#shelfGrid');
  grid.innerHTML = '';
  state.notebooks.forEach(notebook => {
    const article = document.createElement('article');
    article.className = 'notebook';
    applyCoverVariables(article, notebook.coverText);
    const cover = document.createElement('div');
    cover.className = 'notebook-cover';
    const image = document.createElement('img');
    image.src = notebook.cover;
    image.alt = `Capa ${notebook.name}`;
    cover.append(image);
    if (notebook.coverText.title) cover.append(makeCoverWriting('title', notebook.coverText.title, notebook.coverText.titlePosition));
    if (notebook.coverText.subtitle) cover.append(makeCoverWriting('subtitle', notebook.coverText.subtitle, notebook.coverText.subtitlePosition));
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'notebook-open';
    open.setAttribute('aria-label', `Visualizar ${notebook.name}`);
    open.addEventListener('click', () => showCoverPreview(notebook.id));
    cover.append(open);
    const body = document.createElement('div');
    body.className = 'notebook-body';
    const title = document.createElement('h3');
    title.textContent = notebook.name;
    const description = document.createElement('p');
    description.textContent = notebook.description || `${notebook.pages.length} página${notebook.pages.length === 1 ? '' : 's'}`;
    body.append(title, description);
    const manage = document.createElement('button');
    manage.type = 'button';
    manage.className = 'manage-notebook';
    manage.textContent = '✎';
    manage.setAttribute('aria-label', `Editar ${notebook.name}`);
    manage.addEventListener('click', () => openManageNotebook(notebook.id));
    article.append(cover, body, manage);
    grid.append(article);
  });
  const create = document.createElement('button');
  create.type = 'button';
  create.className = 'new-card';
  create.innerHTML = '<span>+</span><strong>Criar novo caderno</strong><small>Escolha uma capa e escreva nela</small>';
  create.addEventListener('click', openNewNotebook);
  grid.append(create);
}

function renderAll() {
  renderShelf();
  renderStickerCollections();
  updateSyncUi();
  if (activeNotebookId && currentNotebook()) {
    renderPages();
    loadCurrentPage();
  }
}

function showView(id) {
  syncCurrentPageFromEditor();
  $('#editor').classList.remove('open');
  $$('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === id));
  $$('.view').forEach(view => view.classList.toggle('active', view.id === id));
}

function openNotebook(notebookId) {
  activeNotebookId = notebookId;
  currentPageIndex = 0;
  const notebook = currentNotebook();
  if (!notebook) return;
  $$('.view').forEach(view => view.classList.remove('active'));
  $$('.tab').forEach(tab => tab.classList.remove('active'));
  $('#editor').classList.add('open');
  $('#editorTitle').textContent = notebook.name;
  renderPages();
  loadCurrentPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeNotebook() {
  syncCurrentPageFromEditor();
  queueSave();
  activeNotebookId = null;
  currentPageIndex = 0;
  showView('shelf');
  renderShelf();
}

function renderPages() {
  const notebook = currentNotebook();
  const list = $('#pageList');
  list.innerHTML = '';
  if (!notebook) return;
  notebook.pages.forEach((page, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `page-item ${index === currentPageIndex ? 'active' : ''}`;
    button.textContent = page.title || `Página ${index + 1}`;
    button.addEventListener('click', () => {
      syncCurrentPageFromEditor();
      currentPageIndex = index;
      loadCurrentPage();
      renderPages();
      queueSave();
    });
    list.append(button);
  });
}

function loadCurrentPage() {
  const page = currentPage();
  if (!page) return;
  $('#pageTitle').value = page.title;
  $('#writingArea').innerHTML = page.body;
  renderPlacedStickers();
  renderSmartResults();
  inkRedoStack = [];
  scheduleInkCanvasResize();
  schedulePagination();
}

function syncCurrentPageFromEditor() {
  const page = currentPage();
  if (!page || !$('#editor').classList.contains('open')) return;
  page.title = $('#pageTitle').value.trim() || `Página ${currentPageIndex + 1}`;
  page.body = $('#writingArea').innerHTML;
  const notebook = currentNotebook();
  if (notebook) notebook.updatedAt = Date.now();
}

function normalizePastedText(text) {
  return String(text || '')
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n+/)
    .map(paragraph => paragraph.replace(/[ \t]*\n[ \t]*/g, ' ').replace(/[ \t]{2,}/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');
}

function insertPlainTextAtSelection(text) {
  if (document.queryCommandSupported?.('insertText')) {
    document.execCommand('insertText', false, text);
    return;
  }
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    $('#writingArea').append(document.createTextNode(text));
    return;
  }
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function handleCleanPaste(event) {
  event.preventDefault();
  const text = normalizePastedText(event.clipboardData?.getData('text/plain') || '');
  if (!text) return;
  insertPlainTextAtSelection(text);
  syncCurrentPageFromEditor();
  schedulePagination();
  queueSave();
  showToast('Texto colado com espaçamento limpo.');
}

function cloneNodeWithText(node, text) {
  if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(text);
  const cloneNode = node.cloneNode(false);
  cloneNode.textContent = text;
  return cloneNode;
}

function splitLastWritingNode(area, node) {
  const original = node.textContent || '';
  if (original.length < 2) return null;
  let low = 1;
  let high = original.length - 1;
  let best = 0;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    node.textContent = original.slice(0, middle);
    if (area.scrollHeight <= area.clientHeight + 2) {
      best = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  if (!best) {
    node.textContent = original;
    return null;
  }
  const wordBoundary = original.slice(0, best).lastIndexOf(' ');
  const cut = wordBoundary > Math.max(20, best * .55) ? wordBoundary : best;
  const before = original.slice(0, cut).trimEnd();
  const after = original.slice(cut).trimStart();
  node.textContent = before;
  return after ? cloneNodeWithText(node, after) : null;
}

function extractWritingOverflow(area) {
  const moved = [];
  let guard = 0;
  while (area.scrollHeight > area.clientHeight + 2 && area.lastChild && guard < 500) {
    guard += 1;
    const node = area.lastChild;
    if (area.childNodes.length > 1) {
      node.remove();
      moved.unshift(node);
      continue;
    }
    const suffix = splitLastWritingNode(area, node);
    if (suffix) moved.unshift(suffix);
    break;
  }
  const container = document.createElement('div');
  moved.forEach(node => container.append(node));
  return container.innerHTML;
}

function renumberAutomaticPages(notebook) {
  notebook.pages.forEach((page, index) => {
    if (page.autoCreated || /^Página \d+$/.test(page.title || '')) page.title = `Página ${index + 1}`;
  });
}

function focusWritingEnd() {
  const area = $('#writingArea');
  area.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(area);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

async function paginateCurrentPageIfNeeded() {
  paginationFrame = null;
  if (paginating || !$('#editor').classList.contains('open')) return;
  const notebook = currentNotebook();
  if (!notebook) return;
  paginating = true;
  let pagesCreated = 0;
  try {
    let area = $('#writingArea');
    while (area.scrollHeight > area.clientHeight + 2 && pagesCreated < 100) {
      const overflowHtml = extractWritingOverflow(area);
      if (!overflowHtml.trim()) break;
      const page = currentPage();
      page.body = area.innerHTML;
      const overflowPage = createPage(`Página ${currentPageIndex + 2}`);
      overflowPage.body = overflowHtml;
      overflowPage.autoCreated = true;
      notebook.pages.splice(currentPageIndex + 1, 0, overflowPage);
      currentPageIndex += 1;
      pagesCreated += 1;
      renumberAutomaticPages(notebook);
      loadCurrentPage();
      await new Promise(resolve => requestAnimationFrame(resolve));
      area = $('#writingArea');
    }
    if (pagesCreated) {
      renderPages();
      focusWritingEnd();
      queueSave();
      showToast(`${pagesCreated} nova${pagesCreated === 1 ? '' : 's'} página${pagesCreated === 1 ? '' : 's'} criada${pagesCreated === 1 ? '' : 's'} automaticamente.`);
    }
  } finally {
    paginating = false;
  }
}

function schedulePagination() {
  cancelAnimationFrame(paginationFrame);
  paginationFrame = requestAnimationFrame(paginateCurrentPageIfNeeded);
}

function addPage() {
  const notebook = currentNotebook();
  if (!notebook) return;
  syncCurrentPageFromEditor();
  notebook.pages.push(createPage(`Página ${notebook.pages.length + 1}`));
  currentPageIndex = notebook.pages.length - 1;
  renderPages();
  loadCurrentPage();
  queueSave();
}

function inkStrokeWidth(stroke, pressure = .5) {
  const base = Number(stroke.size || 4);
  if (stroke.tool === 'eraser') return base * 5;
  if (stroke.tool === 'highlighter') return base * 3.5;
  return base * (.68 + clamp(Number(pressure || .5), .1, 1) * .72);
}

function drawInkStroke(context, stroke, width, height) {
  const points = Array.isArray(stroke?.points) ? stroke.points : [];
  if (!points.length) return;
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
  context.globalAlpha = stroke.tool === 'highlighter' ? .28 : 1;
  context.strokeStyle = stroke.color || '#173641';
  context.fillStyle = stroke.color || '#173641';
  if (points.length === 1) {
    const [x, y, pressure] = points[0];
    context.beginPath();
    context.arc(x * width, y * height, inkStrokeWidth(stroke, pressure) / 2, 0, Math.PI * 2);
    context.fill();
    context.restore();
    return;
  }
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    context.lineWidth = inkStrokeWidth(stroke, (Number(previous[2] || .5) + Number(point[2] || .5)) / 2);
    context.beginPath();
    context.moveTo(previous[0] * width, previous[1] * height);
    context.lineTo(point[0] * width, point[1] * height);
    context.stroke();
  }
  context.restore();
}

function redrawInk() {
  const canvas = $('#inkCanvas');
  const page = currentPage();
  if (!canvas || !page) return;
  const context = canvas.getContext('2d');
  const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = canvas.width / ratio;
  const height = canvas.height / ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);
  page.ink.strokes.forEach(stroke => drawInkStroke(context, stroke, width, height));
}

function resizeInkCanvas() {
  inkResizeFrame = null;
  const canvas = $('#inkCanvas');
  const paper = $('.paper');
  if (!canvas || !paper) return;
  const width = Math.max(1, paper.clientWidth);
  const height = Math.max(1, paper.scrollHeight);
  const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const nextWidth = Math.round(width * ratio);
  const nextHeight = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }
  redrawInk();
}

function scheduleInkCanvasResize() {
  cancelAnimationFrame(inkResizeFrame);
  inkResizeFrame = requestAnimationFrame(resizeInkCanvas);
}

function setInkTool(tool) {
  inkTool = inkTool === tool ? 'none' : tool;
  $('.paper').classList.toggle('ink-active', inkTool !== 'none');
  ['pen', 'highlighter', 'eraser'].forEach(name => {
    $(`#ink${name[0].toUpperCase()}${name.slice(1)}`).classList.toggle('active', inkTool === name);
  });
  const messages = {
    pen: 'Caneta ativada. Use a caneta digital ou o mouse para escrever.',
    highlighter: 'Marca-texto ativado.',
    eraser: 'Borracha ativada. Passe sobre os traços que deseja apagar.',
    none: 'Modo de escrita manual encerrado.'
  };
  showToast(messages[inkTool]);
}

function inkPointFromEvent(event) {
  const rectangle = $('#inkCanvas').getBoundingClientRect();
  return [
    Number(clamp((event.clientX - rectangle.left) / rectangle.width, 0, 1).toFixed(4)),
    Number(clamp((event.clientY - rectangle.top) / rectangle.height, 0, 1).toFixed(4)),
    Number(clamp(event.pressure || .5, .1, 1).toFixed(2))
  ];
}

function beginInkStroke(event) {
  if (inkTool === 'none' || event.pointerType === 'touch') return;
  const page = currentPage();
  if (!page) return;
  event.preventDefault();
  const stroke = {
    id: uid(),
    tool: inkTool,
    color: $('#inkColor').value,
    size: Number($('#inkSize').value),
    points: [inkPointFromEvent(event)]
  };
  page.ink.strokes.push(stroke);
  inkRedoStack = [];
  inkActiveStroke = { pointerId: event.pointerId, stroke };
  $('#inkCanvas').setPointerCapture(event.pointerId);
  redrawInk();
}

function moveInkStroke(event) {
  if (!inkActiveStroke || event.pointerId !== inkActiveStroke.pointerId) return;
  event.preventDefault();
  const point = inkPointFromEvent(event);
  const previous = inkActiveStroke.stroke.points.at(-1);
  if (Math.hypot(point[0] - previous[0], point[1] - previous[1]) < .0014) return;
  inkActiveStroke.stroke.points.push(point);
  redrawInk();
}

function endInkStroke(event) {
  if (!inkActiveStroke || event.pointerId !== inkActiveStroke.pointerId) return;
  const canvas = $('#inkCanvas');
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  inkActiveStroke = null;
  queueSave();
}

function undoInk() {
  const strokes = currentPage()?.ink?.strokes;
  if (!strokes?.length) return showToast('Não há traços para desfazer.');
  inkRedoStack.push(strokes.pop());
  redrawInk();
  queueSave();
}

function redoInk() {
  if (!inkRedoStack.length) return showToast('Não há traços para refazer.');
  currentPage().ink.strokes.push(inkRedoStack.pop());
  redrawInk();
  queueSave();
}

function inkDataUrlForPage(page, width = 1200, height = 1600, whiteBackground = false) {
  const drawing = document.createElement('canvas');
  drawing.width = width;
  drawing.height = height;
  const drawingContext = drawing.getContext('2d');
  page?.ink?.strokes?.forEach(stroke => drawInkStroke(drawingContext, stroke, width, height));
  if (!whiteBackground) return drawing.toDataURL('image/png');
  const composed = document.createElement('canvas');
  composed.width = width;
  composed.height = height;
  const context = composed.getContext('2d');
  context.fillStyle = '#fffdf8';
  context.fillRect(0, 0, width, height);
  context.drawImage(drawing, 0, 0);
  return composed.toDataURL('image/jpeg', .88);
}

function pagePlainText(page = currentPage()) {
  if (!page) return '';
  const container = document.createElement('div');
  container.innerHTML = page.body || '';
  return (container.textContent || '').replace(/\s+/g, ' ').trim();
}

const SUMMARY_STOP_WORDS = new Set(`a o as os de da do das dos e em um uma uns umas para por com sem que se na no nas nos ao aos à às é são foi foram ser ter tem já mais menos muito como mas ou quando onde quem qual quais sua seu suas seus meu minha meus minhas este esta isso isto aquele aquela também entre sobre após antes durante cada todo toda todos todas pode podem pela pelo pelas pelos porque então não sim ele ela eles elas dele dela deles delas vida vidas texto textos ftc ftcs coisa coisas`.split(' '));

const SEMANTIC_CONCEPTS = [
  { label: 'Filhos de Terceira Cultura', pattern: /filh[oa]s?\s+de\s+terceira\s+cultura|\bftcs?\b/i },
  { label: 'Identidade e construção de si', pattern: /identidade|autoconhecimento|quem\s+sou/i },
  { label: 'Pertencimento e lar', pattern: /pertenc|sentir(?:-se)?\s+em\s+casa|meu\s+lugar|lar\b/i },
  { label: 'Vida entre culturas', pattern: /intercultural|entre\s+culturas|multicultur|transcultur/i },
  { label: 'Mobilidade e transições', pattern: /mobilidade|mudan[çc]|mudar\s+de\s+pa[ií]s|transi[çc]|partida|chegada|reentrada/i },
  { label: 'Adaptação cultural', pattern: /adapta|integra[çc]|ajuste\s+cultural|choque\s+cultural/i },
  { label: 'Família e vínculos', pattern: /fam[ií]lia|pais\b|m[aã]e|v[ií]ncul|relacionamento/i },
  { label: 'Perdas, luto e saudade', pattern: /saudade|perda|luto|despedida|ruptura/i },
  { label: 'Resiliência e crescimento', pattern: /resili|fortalec|crescimento|recursos\s+internos/i },
  { label: 'Escola e aprendizagem', pattern: /escola|educa|aprendiz|professor|estudante/i },
  { label: 'Idioma e comunicação', pattern: /idioma|l[ií]ngua|bil[ií]ng|comunica/i },
  { label: 'Saúde emocional', pattern: /emo[çc]|ansiedade|bem-estar|sa[uú]de\s+mental|psicol/i },
  { label: 'Amizades e rede de apoio', pattern: /amizade|amigos?|rede\s+de\s+apoio|comunidade/i },
  { label: 'Fé e espiritualidade', pattern: /espiritual|igreja|\bf[eé]\b|\bDeus\b/i },
  { label: 'Desenvolvimento e fases da vida', pattern: /adolesc|crian[çc]|inf[aâ]ncia|jovem|desenvolvimento/i },
  { label: 'Cultura e contexto', pattern: /cultura|cultural/i }
];

function topicDetailFromText(text, pattern) {
  const sentence = (text.match(/[^.!?]+[.!?]?/g) || []).map(item => item.trim()).find(item => pattern.test(item));
  if (!sentence) return '';
  return sentence.length > 170 ? `${sentence.slice(0, 167).trim()}…` : sentence;
}

function semanticTopics(text, rankedSentences) {
  const topics = [];
  SEMANTIC_CONCEPTS.forEach(concept => {
    concept.pattern.lastIndex = 0;
    if (!concept.pattern.test(text)) return;
    topics.push({ label: concept.label, detail: topicDetailFromText(text, concept.pattern) });
  });
  if (topics.length < 4) {
    rankedSentences.forEach(({ sentence }) => {
      if (topics.length >= 6) return;
      const keywords = (sentence.match(/[\p{L}\p{N}]{3,}/gu) || []).filter(word => !SUMMARY_STOP_WORDS.has(word.toLocaleLowerCase('pt-BR'))).slice(0, 5);
      if (keywords.length < 2) return;
      const label = keywords.join(' ');
      if (topics.some(topic => topic.label.toLocaleLowerCase('pt-BR').includes(keywords[0].toLocaleLowerCase('pt-BR')))) return;
      topics.push({ label: label[0].toLocaleUpperCase('pt-BR') + label.slice(1), detail: sentence });
    });
  }
  return topics.slice(0, 6);
}

function localSmartAnalysis(text) {
  const sentences = (text.match(/[^.!?]+[.!?]?/g) || [text]).map(item => item.trim()).filter(item => item.length > 18);
  const words = (text.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{3,}/gu) || []).filter(word => !SUMMARY_STOP_WORDS.has(word));
  const frequencies = new Map();
  words.forEach(word => frequencies.set(word, (frequencies.get(word) || 0) + 1));
  const ranked = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]{3,}/gu) || [];
    const score = sentenceWords.reduce((total, word) => total + (frequencies.get(word) || 0), 0) / Math.max(1, sentenceWords.length);
    return { sentence, index, score };
  }).sort((a, b) => b.score - a.score);
  const topicDetails = semanticTopics(text, ranked);
  const summarySentences = ranked.slice(0, Math.min(3, sentences.length)).sort((a, b) => a.index - b.index);
  return {
    summary: summarySentences.map(item => item.sentence).join(' ') || text.slice(0, 600),
    topics: topicDetails.length ? topicDetails.map(item => item.label) : ['Ideias principais', 'Aprendizados da anotação'],
    topicDetails,
    createdAt: new Date().toISOString(),
    source: 'local'
  };
}

async function requestSmartService(task, payload) {
  const endpoint = String(window.CADERNO_AI_ENDPOINT || '').trim();
  if (!endpoint) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, ...payload }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('Serviço indisponível');
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function createSmartSummary() {
  syncCurrentPageFromEditor();
  const page = currentPage();
  const text = pagePlainText(page);
  if (text.length < 40) return showToast('Escreva ou dite um pouco mais antes de criar o resumo.');
  const button = $('#generateSummary');
  const previousLabel = button.textContent;
  button.disabled = true;
  button.textContent = 'Criando…';
  try {
    let analysis = null;
    try { analysis = await requestSmartService('summary', { title: page.title, text }); } catch {}
    if (!analysis?.summary || !Array.isArray(analysis.topics)) analysis = localSmartAnalysis(text);
    page.smart.summary = {
      summary: String(analysis.summary).trim(),
      topics: analysis.topics.map(item => String(item).trim()).filter(Boolean).slice(0, 8),
      topicDetails: Array.isArray(analysis.topicDetails) ? analysis.topicDetails.map(item => ({
        label: String(item.label || '').trim(),
        detail: String(item.detail || '').trim()
      })).filter(item => item.label).slice(0, 8) : [],
      createdAt: analysis.createdAt || new Date().toISOString(),
      source: analysis.source || 'online'
    };
    renderSmartResults();
    scheduleInkCanvasResize();
    queueSave();
    showToast('Resumo e tópicos principais criados.');
  } finally {
    button.disabled = false;
    button.textContent = previousLabel;
  }
}

async function createInfographic() {
  syncCurrentPageFromEditor();
  const page = currentPage();
  const text = pagePlainText(page);
  if (text.length < 40) return showToast('Escreva ou dite um pouco mais antes de criar o infográfico.');
  if (!page.smart.summary) {
    const analysis = localSmartAnalysis(text);
    page.smart.summary = analysis;
  }
  const colors = ['#2d7882', '#d79a29', '#dc7555', '#77946a', '#8d70a2', '#4f88a6', '#b06b65', '#7f8d55'];
  const details = new Map((page.smart.summary.topicDetails || []).map(item => [item.label, item.detail]));
  page.smart.infographic = {
    title: page.title || 'Infográfico',
    summary: page.smart.summary.summary,
    topics: page.smart.summary.topics.slice(0, 8).map((topic, index) => ({ topic, detail: details.get(topic) || '', color: colors[index % colors.length] })),
    createdAt: new Date().toISOString()
  };
  renderSmartResults();
  scheduleInkCanvasResize();
  queueSave();
  showToast('Infográfico criado e guardado nesta página.');
}

function smartCardHeader(title, removeAction) {
  const header = document.createElement('div');
  header.className = 'smart-card-header';
  const heading = document.createElement('h3');
  heading.textContent = title;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = 'Remover';
  remove.addEventListener('click', removeAction);
  header.append(heading, remove);
  return header;
}

function renderSmartResults() {
  const container = $('#smartResults');
  if (!container) return;
  container.innerHTML = '';
  const page = currentPage();
  if (!page) return;
  if (page.smart?.summary) {
    const card = document.createElement('section');
    card.className = 'smart-card summary-card';
    card.append(smartCardHeader('Resumo inteligente', () => {
      page.smart.summary = null;
      renderSmartResults();
      scheduleInkCanvasResize();
      queueSave();
    }));
    const paragraph = document.createElement('p');
    paragraph.textContent = page.smart.summary.summary;
    const list = document.createElement('ul');
    page.smart.summary.topics.forEach(topic => {
      const item = document.createElement('li');
      item.textContent = topic;
      list.append(item);
    });
    card.append(paragraph, list);
    container.append(card);
  }
  if (page.smart?.infographic) {
    const card = document.createElement('section');
    card.className = 'smart-card infographic-card';
    const head = document.createElement('div');
    head.className = 'infographic-head';
    head.append(smartCardHeader(page.smart.infographic.title || 'Infográfico', () => {
      page.smart.infographic = null;
      renderSmartResults();
      scheduleInkCanvasResize();
      queueSave();
    }));
    const summary = document.createElement('p');
    summary.textContent = page.smart.infographic.summary;
    head.append(summary);
    const body = document.createElement('div');
    body.className = 'infographic-body';
    page.smart.infographic.topics.forEach((item, index) => {
      const topic = document.createElement('div');
      topic.className = 'infographic-topic';
      topic.style.setProperty('--topic-color', item.color);
      topic.style.setProperty('--topic-bg', `${item.color}18`);
      const number = document.createElement('span');
      number.textContent = String(index + 1);
      const text = document.createElement('div');
      const label = document.createElement('strong');
      label.textContent = item.topic;
      text.append(label);
      if (item.detail) {
        const detail = document.createElement('small');
        detail.textContent = item.detail;
        text.append(detail);
      }
      topic.append(number, text);
      body.append(topic);
    });
    card.append(head, body);
    container.append(card);
  }
}

async function convertHandwritingToText() {
  const page = currentPage();
  if (!page?.ink?.strokes?.length) return showToast('Esta página ainda não tem escrita feita com caneta.');
  if (!String(window.CADERNO_AI_ENDPOINT || '').trim()) {
    return showToast('A leitura da escrita manual será ativada quando conectarmos o serviço inteligente protegido.');
  }
  const button = $('#handwritingToText');
  const previousLabel = button.textContent;
  button.disabled = true;
  button.textContent = 'Lendo…';
  try {
    const response = await requestSmartService('transcribe_handwriting', {
      title: page.title,
      image: inkDataUrlForPage(page, 1200, 1600, true)
    });
    const text = String(response?.text || '').trim();
    if (!text) throw new Error('Nenhum texto reconhecido');
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    $('#writingArea').append(paragraph);
    syncCurrentPageFromEditor();
    queueSave();
    showToast('Escrita manual transformada em texto.');
  } catch {
    showToast('Não foi possível ler a escrita manual agora.');
  } finally {
    button.disabled = false;
    button.textContent = previousLabel;
  }
}

function safeFileName(value, fallback = 'caderno') {
  return String(value || fallback)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || fallback;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function createProtectedBackup(payload, kind, name) {
  if (!localCryptoKey) return showToast('Desbloqueie o Caderno antes de fazer o backup.');
  syncCurrentPageFromEditor();
  const encrypted = await encryptObject(payload, localCryptoKey);
  const backup = {
    format: 'caderno-especial-ftc-backup',
    version: 1,
    kind,
    name,
    createdAt: new Date().toISOString(),
    security: securityMetadata(),
    encrypted
  };
  const filename = `${safeFileName(name)}_${new Date().toISOString().slice(0, 10)}.caderno-ftc`;
  downloadBlob(new Blob([JSON.stringify(backup)], { type: 'application/json' }), filename);
  showToast('Backup protegido criado. Guarde-o junto com sua senha.');
}

async function backupManagedNotebook() {
  const notebook = state.notebooks.find(item => item.id === managedNotebookId);
  if (!notebook) return;
  await createProtectedBackup({ notebook: clone(notebook) }, 'notebook', notebook.name);
}

async function backupAllNotebooks() {
  await createProtectedBackup({
    notebooks: clone(state.notebooks),
    customStickers: clone(state.customStickers || []),
    exportedStateVersion: state.version
  }, 'complete', 'Backup_completo_Caderno_Especial');
}

function restoredNotebookCopy(source) {
  const notebook = clone(source);
  const sameName = state.notebooks.some(item => item.name === notebook.name);
  notebook.id = uid();
  if (sameName) notebook.name = `${notebook.name} (restaurado)`;
  notebook.pages = (notebook.pages || []).map((page, index) => ({
    ...page,
    id: uid(),
    title: page.title || `Página ${index + 1}`,
    stickers: (page.stickers || []).map(sticker => ({ ...sticker, id: uid() })),
    ink: { strokes: (page.ink?.strokes || []).map(stroke => ({ ...stroke, id: uid() })) },
    smart: page.smart || { summary: null, infographic: null }
  }));
  if (!notebook.pages.length) notebook.pages = [createPage()];
  return notebook;
}

async function restoreBackupFile(file) {
  let backup;
  try { backup = JSON.parse(await file.text()); }
  catch { return showToast('Este arquivo de backup não pôde ser lido.'); }
  if (backup?.format !== 'caderno-especial-ftc-backup' || !backup.security || !backup.encrypted) {
    return showToast('Este não é um backup válido do Caderno Especial.');
  }
  const password = prompt('Digite a senha usada quando este backup foi criado:');
  if (!password) return;
  try {
    const material = await derivePasswordMaterial(password, base64ToBytes(backup.security.salt));
    const verifier = await passwordVerifier(material);
    if (!equalBytes(verifier, base64ToBytes(backup.security.verifier))) return showToast('Senha do backup incorreta.');
    const payload = await decryptObject(backup.encrypted, await importAesKey(material));
    const notebooks = backup.kind === 'notebook' ? [payload.notebook] : payload.notebooks;
    if (!Array.isArray(notebooks) || !notebooks.length) return showToast('O backup não contém cadernos.');
    notebooks.filter(Boolean).forEach(notebook => state.notebooks.push(restoredNotebookCopy(notebook)));
    if (Array.isArray(payload.customStickers)) {
      state.customStickers = [...new Set([...(state.customStickers || []), ...payload.customStickers])];
    }
    normalizeState();
    await persistState();
    renderAll();
    showToast(`${notebooks.length} caderno${notebooks.length === 1 ? '' : 's'} restaurado${notebooks.length === 1 ? '' : 's'} sem apagar os atuais.`);
  } catch {
    showToast('Não foi possível restaurar este backup. Confira a senha e o arquivo.');
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function printableAssetUrl(source) {
  if (!source || String(source).startsWith('data:')) return source || '';
  return new URL(source, location.href).href;
}

function printableSticker(sticker) {
  const style = `left:${Math.max(0, Number(sticker.x || 0))}px;top:${Math.max(70, Number(sticker.y || 0))}px;width:${Number(sticker.width || 90)}px;height:${Number(sticker.height || 90)}px`;
  if (sticker.kind === 'text') {
    return `<div class="print-sticker print-text-sticker" style="${style}">${escapeHtml(sticker.text)}</div>`;
  }
  return `<img class="print-sticker" style="${style}" src="${escapeHtml(printableAssetUrl(sticker.src))}" alt="" />`;
}

function printableSmartContent(page) {
  const summary = page.smart?.summary;
  const infographic = page.smart?.infographic;
  let html = '';
  if (summary) {
    html += `<section class="print-smart"><h3>Resumo inteligente</h3><p>${escapeHtml(summary.summary)}</p><ul>${summary.topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}</ul></section>`;
  }
  if (infographic) {
    html += `<section class="print-infographic"><header><h3>${escapeHtml(infographic.title)}</h3><p>${escapeHtml(infographic.summary)}</p></header><div>${infographic.topics.map((item, index) => `<p style="--c:${escapeHtml(item.color)}"><b>${index + 1}</b><span><strong>${escapeHtml(item.topic)}</strong>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ''}</span></p>`).join('')}</div></section>`;
  }
  return html;
}

function printableCoverText(notebook) {
  const text = notebook.coverText || defaultCoverText();
  const title = text.title || notebook.name;
  const subtitle = text.subtitle || notebook.description;
  return `<span class="print-cover-title" style="left:${text.titlePosition?.x || 50}%;top:${text.titlePosition?.y || 34}%;font-family:${escapeHtml(text.font)};color:${escapeHtml(text.color)};font-size:${Number(text.titleSize || 31)}px">${escapeHtml(title)}</span><span class="print-cover-subtitle" style="left:${text.subtitlePosition?.x || 50}%;top:${text.subtitlePosition?.y || 47}%;font-family:${escapeHtml(text.font)};color:${escapeHtml(text.color)};font-size:${Number(text.subtitleSize || 17)}px">${escapeHtml(subtitle)}</span>`;
}

async function exportNotebookToPdf(notebook) {
  if (!notebook) return;
  syncCurrentPageFromEditor();
  const printWindow = window.open('', '_blank');
  if (!printWindow) return showToast('Permita a abertura da janela para salvar o PDF.');
  printWindow.document.write('<p style="font:16px Arial;padding:30px">Preparando o caderno para PDF…</p>');
  const pages = notebook.pages.map((page, index) => {
    const ink = page.ink?.strokes?.length ? `<img class="print-ink" src="${inkDataUrlForPage(page, 1200, 1600)}" alt="" />` : '';
    return `<article class="print-page"><h2>${escapeHtml(page.title || `Página ${index + 1}`)}</h2><div class="print-writing">${page.body || ''}</div>${printableSmartContent(page)}${page.stickers.map(printableSticker).join('')}${ink}<footer>${index + 1}</footer></article>`;
  }).join('');
  const title = safeFileName(notebook.name, 'Caderno');
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title><style>
    @page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;background:#e8e8e8;color:#173641;font-family:Arial,sans-serif}.print-cover,.print-page{position:relative;width:210mm;min-height:297mm;margin:0 auto;background:#fffdf8;overflow:hidden;page-break-after:always}.print-cover>img{width:100%;height:297mm;display:block;object-fit:cover}.print-cover-title,.print-cover-subtitle{position:absolute;width:86%;transform:translate(-50%,-50%);font-weight:800;text-align:center;text-shadow:0 2px 8px #0008}.print-page{padding:24mm 20mm 18mm}.print-page h2{position:relative;z-index:2;margin:0 0 10mm;padding-bottom:5mm;border-bottom:1px solid #ded7ca;font:700 24pt Georgia,serif}.print-writing{position:relative;z-index:1;font-size:12pt;line-height:1.55;white-space:pre-wrap}.print-writing p,.print-writing div{margin:0 0 3mm!important;line-height:1.55!important}.print-ink{position:absolute;inset:0;z-index:4;width:100%;height:100%;object-fit:fill;pointer-events:none}.print-sticker{position:absolute;z-index:3;object-fit:contain}.print-text-sticker{display:grid;place-items:center;padding:9px;border:2px solid #d79a29;border-radius:16px;background:#fff0c9;color:#684a32;font-weight:800;text-align:center}.print-smart{position:relative;z-index:2;margin-top:10mm;padding:7mm;border:1px solid #cfe0da;border-radius:5mm;background:#f5fbf8}.print-smart h3,.print-infographic h3{margin:0;font:700 18pt Georgia,serif}.print-smart li{margin:2mm 0}.print-infographic{position:relative;z-index:2;margin-top:10mm;border:1px solid #cfe0da;border-radius:5mm;overflow:hidden}.print-infographic header{padding:7mm;background:#174853;color:white}.print-infographic header p{line-height:1.5}.print-infographic>div{display:grid;gap:3mm;padding:6mm}.print-infographic>div p{display:flex;align-items:center;gap:4mm;margin:0;padding:4mm;border-radius:3mm;background:#eef7f3}.print-infographic b{width:9mm;height:9mm;display:grid;place-items:center;flex:0 0 auto;border-radius:50%;background:var(--c);color:white}.print-infographic strong,.print-infographic small{display:block}.print-infographic small{margin-top:1mm;color:#5f7074;font-weight:400;line-height:1.4}.print-page footer{position:absolute;right:16mm;bottom:8mm;color:#8b8b82;font-size:9pt}@media print{body{background:white}.print-cover,.print-page{margin:0;box-shadow:none}}
  </style></head><body><section class="print-cover"><img src="${escapeHtml(printableAssetUrl(notebook.cover))}" alt="">${printableCoverText(notebook)}</section>${pages}<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),500));<\/script></body></html>`;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  showToast(`Na próxima tela, escolha “Salvar como PDF”. Nome sugerido: ${title}.pdf`);
}

function continuationName(name) {
  const year = String(name).match(/\b(20\d{2})\b/);
  if (year) return String(name).replace(year[1], String(Number(year[1]) + 1));
  return `${name} — Continuação`;
}

async function archiveAndContinueNotebook() {
  const notebook = state.notebooks.find(item => item.id === managedNotebookId);
  if (!notebook) return;
  if (!confirm('Salvar este caderno em PDF e criar uma continuação vazia? O caderno atual continuará guardado na estante.')) return;
  await exportNotebookToPdf(notebook);
  const nextName = continuationName(notebook.name);
  const next = createNotebook(nextName, notebook.description, notebook.cover, false);
  next.coverText = clone(notebook.coverText || defaultCoverText());
  next.coverText.title = nextName;
  state.notebooks.push(next);
  $('#manageNotebookDialog').close();
  managedNotebookId = null;
  renderShelf();
  queueSave();
  showToast(`${nextName} criado. O caderno anterior foi preservado.`);
}

function applyCommand(command, value) {
  $('#writingArea').focus();
  document.execCommand(command, false, value);
  syncCurrentPageFromEditor();
  schedulePagination();
  queueSave();
}

function renderCoverPickers() {
  [$('#newCoverPicker'), $('#manageCoverPicker')].forEach(picker => {
    picker.innerHTML = '';
    COVER_OPTIONS.forEach(source => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.cover = source;
      const image = document.createElement('img');
      image.src = source;
      image.alt = 'Capa disponível';
      button.append(image);
      picker.append(button);
    });
  });
}

function openNewNotebook() {
  selectedNewCover = COVER_OPTIONS[0];
  $('#notebookName').value = '';
  $('#notebookDescription').value = '';
  $$('#newCoverPicker button').forEach((button, index) => button.classList.toggle('selected', index === 0));
  $('#newNotebookDialog').showModal();
  $('#notebookName').focus();
}

function openManageNotebook(notebookId) {
  managedNotebookId = notebookId;
  const notebook = state.notebooks.find(item => item.id === notebookId);
  if (!notebook) return;
  $('#manageNotebookTitle').textContent = notebook.name;
  $$('#manageCoverPicker button').forEach(button => button.classList.toggle('selected', button.dataset.cover === notebook.cover));
  $('#manageNotebookDialog').showModal();
}

function showCoverPreview(notebookId) {
  const notebook = state.notebooks.find(item => item.id === notebookId);
  if (!notebook) return;
  managedNotebookId = notebookId;
  const preview = $('#coverPreview');
  $('#previewImage').src = notebook.cover;
  $('#previewImage').alt = `Capa ${notebook.name}`;
  $('#previewTitle').textContent = notebook.coverText.title;
  $('#previewSubtitle').textContent = notebook.coverText.subtitle;
  applyCoverVariables(preview, notebook.coverText);
  $('#previewTitle').style.setProperty('--x', `${notebook.coverText.titlePosition.x}%`);
  $('#previewTitle').style.setProperty('--y', `${notebook.coverText.titlePosition.y}%`);
  $('#previewSubtitle').style.setProperty('--x', `${notebook.coverText.subtitlePosition.x}%`);
  $('#previewSubtitle').style.setProperty('--y', `${notebook.coverText.subtitlePosition.y}%`);
  preview.classList.add('active');
  preview.setAttribute('aria-hidden', 'false');
  $('#previewCover').focus();
}

function closeCoverPreview() {
  $('#coverPreview').classList.remove('active');
  $('#coverPreview').setAttribute('aria-hidden', 'true');
}

function openCoverEditor() {
  const notebook = state.notebooks.find(item => item.id === managedNotebookId);
  if (!notebook) return;
  coverDraft = clone(notebook.coverText);
  if (!coverDraft.title) coverDraft.title = notebook.name || '';
  if (!coverDraft.subtitle) coverDraft.subtitle = notebook.description || '';
  if ($('#manageNotebookDialog').open) $('#manageNotebookDialog').close();
  $('#coverStageImage').src = notebook.cover;
  $('#coverTitleInput').value = coverDraft.title;
  $('#coverSubtitleInput').value = coverDraft.subtitle;
  $('#coverFontInput').value = coverDraft.font;
  $('#coverTitleSize').value = coverDraft.titleSize;
  $('#coverSubtitleSize').value = coverDraft.subtitleSize;
  $('#coverColorInput').value = coverDraft.color;
  updateCoverStage();
  $('#coverEditorDialog').showModal();
}

function updateCoverStage() {
  if (!coverDraft) return;
  const stage = $('#coverStage');
  applyCoverVariables(stage, coverDraft);
  const title = $('#coverTitleWriting');
  const subtitle = $('#coverSubtitleWriting');
  title.textContent = coverDraft.title || 'Matéria ou título';
  subtitle.textContent = coverDraft.subtitle || 'Informação adicional';
  title.style.setProperty('--x', `${coverDraft.titlePosition.x}%`);
  title.style.setProperty('--y', `${coverDraft.titlePosition.y}%`);
  subtitle.style.setProperty('--x', `${coverDraft.subtitlePosition.x}%`);
  subtitle.style.setProperty('--y', `${coverDraft.subtitlePosition.y}%`);
}

function beginCoverDrag(event, targetName) {
  if (!coverDraft) return;
  event.preventDefault();
  const target = event.currentTarget;
  target.setPointerCapture(event.pointerId);
  coverDrag = { pointerId: event.pointerId, targetName, target };
}

function moveCoverDrag(event) {
  if (!coverDrag || event.pointerId !== coverDrag.pointerId) return;
  const rectangle = $('#coverStage').getBoundingClientRect();
  const position = {
    x: clamp(((event.clientX - rectangle.left) / rectangle.width) * 100, 8, 92),
    y: clamp(((event.clientY - rectangle.top) / rectangle.height) * 100, 7, 93)
  };
  coverDraft[coverDrag.targetName] = position;
  updateCoverStage();
}

function endCoverDrag(event) {
  if (!coverDrag || event.pointerId !== coverDrag.pointerId) return;
  coverDrag.target.releasePointerCapture(event.pointerId);
  coverDrag = null;
}

function setCoverPreset(position) {
  const positions = {
    top: [{ x: 50, y: 22 }, { x: 50, y: 33 }],
    center: [{ x: 50, y: 46 }, { x: 50, y: 57 }],
    bottom: [{ x: 50, y: 70 }, { x: 50, y: 81 }]
  };
  [coverDraft.titlePosition, coverDraft.subtitlePosition] = positions[position];
  updateCoverStage();
}

async function resizeImageFile(file, maxSide = 1200, preserveTransparency = false) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = await new Promise((resolve, reject) => {
    const candidate = new Image();
    candidate.onload = () => resolve(candidate);
    candidate.onerror = reject;
    candidate.src = dataUrl;
  });
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(preserveTransparency ? 'image/png' : 'image/jpeg', preserveTransparency ? undefined : .84);
}

function createTextStickerChoice(item, theme, index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sticker-choice';
  const art = document.createElement('span');
  art.className = `text-sticker-art theme-${theme} variant-${index % 4 + 1}`;
  art.textContent = item;
  button.append(art);
  button.addEventListener('click', () => insertSticker({ kind: 'text', text: item, theme, variant: index % 4 + 1 }));
  return button;
}

function createImageStickerChoice(source, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sticker-choice';
  const image = document.createElement('img');
  image.src = source;
  image.alt = `Adesivo ${label}`;
  image.loading = 'lazy';
  const small = document.createElement('small');
  small.textContent = label;
  button.append(image, small);
  button.addEventListener('click', () => insertSticker({ kind: 'image', src: source }));
  return button;
}

function addStickerCollection(title, note, choices, open = false) {
  const detail = document.createElement('details');
  detail.className = 'sticker-collection';
  detail.open = open;
  const summary = document.createElement('summary');
  summary.innerHTML = `✦ ${title} <small>${choices.length} adesivos</small>`;
  const copy = document.createElement('p');
  copy.className = 'dialog-copy';
  copy.style.padding = '0 14px';
  copy.textContent = note;
  const grid = document.createElement('div');
  grid.className = 'sticker-grid';
  choices.forEach(choice => grid.append(choice));
  detail.append(summary, copy, grid);
  $('#stickerCollections').append(detail);
}

function renderStickerCollections() {
  const container = $('#stickerCollections');
  container.innerHTML = '';
  TEXT_COLLECTIONS.forEach((collection, index) => {
    const choices = collection.items.map((item, itemIndex) => createTextStickerChoice(item, collection.theme, itemIndex));
    addStickerCollection(collection.title, collection.note, choices, index === 0);
  });
  IMAGE_COLLECTIONS.forEach(collection => {
    const numbers = collection.numbers || Array.from({ length: collection.total }, (_, index) => index + 1);
    const choices = numbers.map(number => {
      const source = `assets/stickers/${collection.folder}-${String(number).padStart(2, '0')}.webp`;
      return createImageStickerChoice(source, collection.title);
    });
    addStickerCollection(collection.title, 'Ilustrações delicadas já existentes no seu caderno.', choices);
  });
  const regionNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['pt-BR'], { type: 'region' }) : null;
  const flagChoices = FLAG_CODES.map(code => createImageStickerChoice(`assets/flags/${code.toLowerCase()}.webp`, regionNames?.of(code) || code));
  addStickerCollection('Bandeiras do mundo', '193 bandeiras guardadas no aplicativo para usar também sem internet.', flagChoices);
  if (state?.customStickers?.length) {
    const choices = state.customStickers.map((source, index) => createImageStickerChoice(source, `Meu adesivo ${index + 1}`));
    addStickerCollection('Meus adesivos', 'Imagens adicionadas por você.', choices);
  }
}

function insertSticker(sticker) {
  const page = currentPage();
  if (!page || !$('#editor').classList.contains('open')) {
    showToast('Abra um caderno e uma página para inserir o adesivo.');
    return;
  }
  const isText = sticker.kind === 'text';
  page.stickers.push({
    id: uid(),
    ...sticker,
    x: 55 + (page.stickers.length % 4) * 28,
    y: 150 + (page.stickers.length % 5) * 24,
    width: isText ? 190 : 92,
    height: isText ? 92 : 92
  });
  selectedStickerId = page.stickers.at(-1).id;
  renderPlacedStickers();
  $('#stickerDialog').close();
  queueSave();
  showToast('Adesivo inserido. Arraste para posicionar.');
}

function renderPlacedStickers() {
  const layer = $('#placedStickers');
  layer.innerHTML = '';
  const page = currentPage();
  if (!page) return;
  page.stickers.forEach(sticker => {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = `placed-sticker ${sticker.id === selectedStickerId ? 'selected' : ''}`;
    element.style.left = `${sticker.x}px`;
    element.style.top = `${sticker.y}px`;
    element.style.width = `${sticker.width}px`;
    element.style.height = `${sticker.height}px`;
    element.setAttribute('aria-label', 'Adesivo na página');
    if (sticker.kind === 'text') {
      const art = document.createElement('span');
      art.className = `text-sticker-art theme-${sticker.theme} variant-${sticker.variant}`;
      art.textContent = sticker.text;
      element.append(art);
    } else {
      const image = document.createElement('img');
      image.src = sticker.src;
      image.alt = 'Adesivo';
      element.append(image);
    }
    const remove = document.createElement('span');
    remove.className = 'sticker-remove';
    remove.textContent = '×';
    remove.setAttribute('role', 'button');
    remove.setAttribute('aria-label', 'Remover adesivo');
    const resize = document.createElement('span');
    resize.className = 'resize-handle';
    element.append(remove, resize);
    element.addEventListener('pointerdown', event => beginStickerPointer(event, sticker, element));
    remove.addEventListener('pointerdown', event => {
      event.stopPropagation();
      page.stickers = page.stickers.filter(item => item.id !== sticker.id);
      selectedStickerId = null;
      renderPlacedStickers();
      queueSave();
    });
    resize.addEventListener('pointerdown', event => beginStickerResize(event, sticker, element));
    layer.append(element);
  });
}

function beginStickerPointer(event, sticker, element) {
  if (event.target.closest('.resize-handle, .sticker-remove')) return;
  event.preventDefault();
  selectedStickerId = sticker.id;
  $$('.placed-sticker').forEach(item => item.classList.toggle('selected', item === element));
  const start = { x: event.clientX, y: event.clientY, left: sticker.x, top: sticker.y };
  element.setPointerCapture(event.pointerId);
  const move = moveEvent => {
    const paper = $('.paper');
    sticker.x = clamp(start.left + moveEvent.clientX - start.x, 0, paper.clientWidth - sticker.width);
    sticker.y = clamp(start.top + moveEvent.clientY - start.y, 80, paper.clientHeight - sticker.height);
    element.style.left = `${sticker.x}px`;
    element.style.top = `${sticker.y}px`;
  };
  const end = endEvent => {
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', end);
    if (element.hasPointerCapture(endEvent.pointerId)) element.releasePointerCapture(endEvent.pointerId);
    queueSave();
  };
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerup', end);
}

function beginStickerResize(event, sticker, element) {
  event.preventDefault();
  event.stopPropagation();
  const start = { x: event.clientX, y: event.clientY, width: sticker.width, height: sticker.height };
  element.setPointerCapture(event.pointerId);
  const move = moveEvent => {
    const delta = Math.max(moveEvent.clientX - start.x, moveEvent.clientY - start.y);
    const ratio = start.height / start.width;
    sticker.width = clamp(start.width + delta, 54, 280);
    sticker.height = clamp(sticker.width * ratio, 45, 220);
    element.style.width = `${sticker.width}px`;
    element.style.height = `${sticker.height}px`;
  };
  const end = endEvent => {
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', end);
    if (element.hasPointerCapture(endEvent.pointerId)) element.releasePointerCapture(endEvent.pointerId);
    queueSave();
  };
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerup', end);
}

function randomSyncCode() {
  const raw = bytesToBase64Url(crypto.getRandomValues(new Uint8Array(24)));
  return `CADERNO-${raw.match(/.{1,4}/g).join('-')}`;
}

function normalizeSyncCode(code) {
  return code.trim().toUpperCase().replace(/^CADERNO-/, '').replace(/[^A-Z0-9_-]/g, '').replaceAll('-', '');
}

async function syncKeyFromCode(code) {
  const normalized = normalizeSyncCode(code);
  if (normalized.length < 30) throw new Error('Código incompleto');
  const marker = encoder.encode(`caderno-especial-sync-v2:${normalized}`);
  return importAesKey(await sha256(marker));
}

async function syncDocumentId(code) {
  return bytesToBase64Url(await sha256(encoder.encode(`caderno-especial-documento:${normalizeSyncCode(code)}`)));
}

async function initializeFirebase() {
  const config = window.CADERNO_FIREBASE_CONFIG;
  if (!config?.apiKey || !config?.projectId) {
    updateSyncStatus(state?.sync?.code ? 'waiting' : '', state?.sync?.code ? 'Preparada' : 'Sincronizar');
    return false;
  }
  try {
    const appModule = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`);
    const firestoreModule = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`);
    const app = appModule.initializeApp(config, 'caderno-especial-ftc');
    firebaseApi = firestoreModule;
    firestoreDb = firestoreModule.getFirestore(app);
    updateSyncStatus(state?.sync?.code ? 'waiting' : '', state?.sync?.code ? 'Conectando…' : 'Sincronizar');
    return true;
  } catch {
    updateSyncStatus('waiting', 'Sem conexão');
    return false;
  }
}

function updateSyncStatus(statusClass = '', text = 'Sincronizar') {
  $('#syncDot').className = `status-dot ${statusClass}`.trim();
  $('#syncButtonText').textContent = text;
}

function updateSyncUi() {
  if (!state) return;
  const connected = Boolean(state.sync?.code);
  $('#syncDisconnected').hidden = connected;
  $('#syncConnected').hidden = !connected;
  $('#syncCodeOutput').value = connected ? state.sync.code : '';
  if (!connected) {
    $('#syncMessage').textContent = 'Use um código particular para conectar celular e computador.';
    updateSyncStatus('', 'Sincronizar');
  } else if (!firestoreDb) {
    $('#syncMessage').textContent = 'Código preparado. A conexão on-line será ativada na etapa Firebase.';
    updateSyncStatus('waiting', 'Preparada');
  }
}

function stopRealtimeSync() {
  if (syncUnsubscribe) syncUnsubscribe();
  syncUnsubscribe = null;
  clearTimeout(remoteWriteTimer);
}

function scheduleRemoteWrite() {
  clearTimeout(remoteWriteTimer);
  remoteWriteTimer = setTimeout(() => pushStateToCloud().catch(() => updateSyncStatus('waiting', 'Sincronização pendente')), 850);
}

async function encryptedCloudPayload(code) {
  const cloudState = clone(state);
  cloudState.sync = { connected: true };
  return encryptObject(cloudState, await syncKeyFromCode(code));
}

async function pushStateToCloud() {
  if (!firestoreDb || !state?.sync?.code || receivingRemote) return false;
  updateSyncStatus('waiting', 'Sincronizando…');
  const code = state.sync.code;
  const documentId = await syncDocumentId(code);
  const encrypted = await encryptedCloudPayload(code);
  if (encrypted.cipher.length > 900000) throw new Error('Cadernos grandes demais para um único envio');
  await firebaseApi.setDoc(firebaseApi.doc(firestoreDb, 'caderno_sync', documentId), {
    version: 2,
    updatedAt: state.updatedAt,
    iv: encrypted.iv,
    payload: encrypted.cipher
  });
  updateSyncStatus('online', 'Sincronizada');
  $('#syncMessage').textContent = 'Sincronização automática ativa neste aparelho.';
  return true;
}

async function readRemoteSnapshot(snapshot, code) {
  if (!snapshot.exists()) return null;
  const remote = snapshot.data();
  if (!remote?.iv || !remote?.payload) return null;
  const remoteState = await decryptObject({ iv: remote.iv, cipher: remote.payload }, await syncKeyFromCode(code));
  return { remoteState, updatedAt: Number(remote.updatedAt || 0) };
}

async function startRealtimeSync(preferRemote = false) {
  stopRealtimeSync();
  if (!firestoreDb || !state?.sync?.code) {
    updateSyncUi();
    return;
  }
  const code = state.sync.code;
  const reference = firebaseApi.doc(firestoreDb, 'caderno_sync', await syncDocumentId(code));
  updateSyncStatus('waiting', 'Conectando…');
  const snapshot = await firebaseApi.getDoc(reference);
  if (snapshot.exists()) {
    const remote = await readRemoteSnapshot(snapshot, code);
    if (remote?.remoteState && (preferRemote || remote.updatedAt > Number(state.updatedAt || 0))) {
      receivingRemote = true;
      state = remote.remoteState;
      state.sync = { code };
      normalizeState();
      await persistState(false);
      receivingRemote = false;
      renderAll();
    } else {
      await pushStateToCloud();
    }
  } else {
    await pushStateToCloud();
  }
  syncUnsubscribe = firebaseApi.onSnapshot(reference, { includeMetadataChanges: true }, async next => {
    if (!next.exists() || next.metadata.hasPendingWrites || !state) return;
    try {
      const remote = await readRemoteSnapshot(next, code);
      if (!remote?.remoteState || remote.updatedAt <= Number(state.updatedAt || 0)) return;
      receivingRemote = true;
      syncCurrentPageFromEditor();
      state = remote.remoteState;
      state.sync = { code };
      normalizeState();
      await persistState(false);
      receivingRemote = false;
      renderAll();
      updateSyncStatus('online', 'Sincronizada');
      showToast('Cadernos atualizados neste aparelho.');
    } catch {
      receivingRemote = false;
      updateSyncStatus('waiting', 'Sincronização pendente');
    }
  }, () => updateSyncStatus('waiting', 'Sem conexão'));
  updateSyncStatus('online', 'Sincronizada');
  $('#syncMessage').textContent = 'Sincronização automática ativa neste aparelho.';
}

async function connectSyncCode(code, preferRemote = false) {
  if (!code.trim()) return showToast('Digite ou cole o código particular.');
  try { await syncKeyFromCode(code); } catch { return showToast('Esse código parece incompleto.'); }
  state.sync = { code: code.trim() };
  await persistState(false);
  updateSyncUi();
  if (firestoreDb) await startRealtimeSync(preferRemote);
  else showToast('Código guardado. Vamos ativar o Firebase na etapa de publicação.');
}

function bindEvents() {
  $('#unlockForm').addEventListener('submit', async event => {
    event.preventDefault();
    const password = $('#passwordInput').value;
    const metadata = securityMetadata();
    $('#lockError').textContent = '';
    try {
      if (!metadata) {
        const confirmation = $('#confirmPasswordInput').value;
        if (password.length < 6) return $('#lockError').textContent = 'Use pelo menos 6 caracteres.';
        if (password !== confirmation) return $('#lockError').textContent = 'As duas senhas precisam ser iguais.';
        await createPassword(password);
      } else if (!await verifyAndUnlock(password)) {
        return $('#lockError').textContent = 'Senha incorreta.';
      }
      $('#passwordInput').value = '';
      $('#confirmPasswordInput').value = '';
      await unlockApplication();
    } catch {
      $('#lockError').textContent = 'Não foi possível abrir os cadernos. Confira a senha.';
    }
  });

  ['pointerdown', 'keydown', 'touchstart'].forEach(name => document.addEventListener(name, resetAutoLock, { passive: true }));
  $$('.tab').forEach(tab => tab.addEventListener('click', () => showView(tab.dataset.view)));
  $('#newNotebook').addEventListener('click', openNewNotebook);
  $('#backShelf').addEventListener('click', closeNotebook);
  $('#closeNotebook').addEventListener('click', closeNotebook);
  $('#addPage').addEventListener('click', addPage);
  $('#pageTitle').addEventListener('input', () => { syncCurrentPageFromEditor(); renderPages(); queueSave(); });
  $('#writingArea').addEventListener('input', () => { syncCurrentPageFromEditor(); schedulePagination(); queueSave(); });
  $('#writingArea').addEventListener('paste', handleCleanPaste);
  $('#fontFamily').addEventListener('change', event => applyCommand('fontName', event.target.value));
  $('#fontSmall').addEventListener('click', () => applyCommand('fontSize', '3'));
  $('#fontLarge').addEventListener('click', () => applyCommand('fontSize', '5'));
  $$('[data-color]').forEach(button => button.addEventListener('click', () => applyCommand('foreColor', button.dataset.color)));

  $('#dictate').addEventListener('click', () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return showToast('O ditado por voz não está disponível neste navegador.');
    const recognition = new Recognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = false;
    const button = $('#dictate');
    button.classList.add('dictating');
    button.textContent = '● Ouvindo';
    recognition.onresult = result => {
      const text = [...result.results].slice(result.resultIndex).map(item => item[0].transcript).join(' ');
      applyCommand('insertText', `${text} `);
    };
    recognition.onend = () => { button.classList.remove('dictating'); button.textContent = '🎙 Falar'; };
    recognition.start();
  });

  $('#inkPen').addEventListener('click', () => setInkTool('pen'));
  $('#inkHighlighter').addEventListener('click', () => setInkTool('highlighter'));
  $('#inkEraser').addEventListener('click', () => setInkTool('eraser'));
  $('#inkUndo').addEventListener('click', undoInk);
  $('#inkRedo').addEventListener('click', redoInk);
  $('#inkCanvas').addEventListener('pointerdown', beginInkStroke);
  $('#inkCanvas').addEventListener('pointermove', moveInkStroke);
  $('#inkCanvas').addEventListener('pointerup', endInkStroke);
  $('#inkCanvas').addEventListener('pointercancel', endInkStroke);
  $('#generateSummary').addEventListener('click', createSmartSummary);
  $('#generateInfographic').addEventListener('click', createInfographic);
  $('#handwritingToText').addEventListener('click', convertHandwritingToText);
  if ('ResizeObserver' in window) {
    inkResizeObserver = new ResizeObserver(scheduleInkCanvasResize);
    inkResizeObserver.observe($('.paper'));
  }
  window.addEventListener('resize', scheduleInkCanvasResize);

  $('#newNotebookForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#notebookName').value.trim();
    if (!name) return;
    const description = $('#notebookDescription').value.trim();
    const notebook = createNotebook(name, description, selectedNewCover, true);
    notebook.coverText.subtitle = description;
    state.notebooks.push(notebook);
    managedNotebookId = notebook.id;
    $('#newNotebookDialog').close();
    renderShelf();
    queueSave();
    openCoverEditor();
  });
  $('#newCoverPicker').addEventListener('click', event => {
    const button = event.target.closest('[data-cover]');
    if (!button) return;
    selectedNewCover = button.dataset.cover;
    $$('#newCoverPicker button').forEach(item => item.classList.toggle('selected', item === button));
  });
  $('#manageCoverPicker').addEventListener('click', event => {
    const button = event.target.closest('[data-cover]');
    if (!button) return;
    const notebook = state.notebooks.find(item => item.id === managedNotebookId);
    if (!notebook) return;
    notebook.cover = button.dataset.cover;
    $$('#manageCoverPicker button').forEach(item => item.classList.toggle('selected', item === button));
    renderShelf();
    queueSave();
    showToast('Imagem da capa alterada.');
  });
  $('#editCoverText').addEventListener('click', openCoverEditor);
  $('#uploadCoverButton').addEventListener('click', () => $('#coverUpload').click());
  $('#exportNotebookPdf').addEventListener('click', () => exportNotebookToPdf(state.notebooks.find(item => item.id === managedNotebookId)));
  $('#backupNotebook').addEventListener('click', backupManagedNotebook);
  $('#archiveNotebook').addEventListener('click', archiveAndContinueNotebook);
  $('#coverUpload').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    const notebook = state.notebooks.find(item => item.id === managedNotebookId);
    if (!notebook) return;
    notebook.cover = await resizeImageFile(file, 1200, false);
    event.target.value = '';
    $('#manageNotebookDialog').close();
    renderShelf();
    queueSave();
    showToast('Sua imagem foi usada como capa.');
  });
  $('#deleteNotebook').addEventListener('click', () => {
    const notebook = state.notebooks.find(item => item.id === managedNotebookId);
    if (!notebook || !confirm(`Apagar “${notebook.name}”? Esta ação não poderá ser desfeita.`)) return;
    state.notebooks = state.notebooks.filter(item => item.id !== managedNotebookId);
    $('#manageNotebookDialog').close();
    managedNotebookId = null;
    renderShelf();
    queueSave();
  });

  $('#coverTitleInput').addEventListener('input', event => { coverDraft.title = event.target.value; updateCoverStage(); });
  $('#coverSubtitleInput').addEventListener('input', event => { coverDraft.subtitle = event.target.value; updateCoverStage(); });
  $('#coverFontInput').addEventListener('change', event => { coverDraft.font = event.target.value; updateCoverStage(); });
  $('#coverTitleSize').addEventListener('input', event => { coverDraft.titleSize = Number(event.target.value); updateCoverStage(); });
  $('#coverSubtitleSize').addEventListener('input', event => { coverDraft.subtitleSize = Number(event.target.value); updateCoverStage(); });
  $('#coverColorInput').addEventListener('input', event => { coverDraft.color = event.target.value; updateCoverStage(); });
  $$('[data-cover-color]').forEach(button => button.addEventListener('click', () => {
    coverDraft.color = button.dataset.coverColor;
    $('#coverColorInput').value = coverDraft.color;
    updateCoverStage();
  }));
  $$('[data-cover-position]').forEach(button => button.addEventListener('click', () => setCoverPreset(button.dataset.coverPosition)));
  $('#coverTitleWriting').addEventListener('pointerdown', event => beginCoverDrag(event, 'titlePosition'));
  $('#coverSubtitleWriting').addEventListener('pointerdown', event => beginCoverDrag(event, 'subtitlePosition'));
  $('#coverStage').addEventListener('pointermove', moveCoverDrag);
  $('#coverStage').addEventListener('pointerup', endCoverDrag);
  $('#coverEditorForm').addEventListener('submit', event => {
    event.preventDefault();
    const notebook = state.notebooks.find(item => item.id === managedNotebookId);
    if (!notebook || !coverDraft) return;
    notebook.coverText = clone(coverDraft);
    if (coverDraft.title.trim()) notebook.name = coverDraft.title.trim();
    notebook.description = coverDraft.subtitle.trim();
    $('#coverEditorDialog').close();
    renderShelf();
    queueSave();
    showToast('Capa personalizada e salva.');
  });

  $('#previewCover').addEventListener('click', () => { const id = managedNotebookId; closeCoverPreview(); openNotebook(id); });
  $('#previewCover').addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); $('#previewCover').click(); }
  });
  $('#closePreview').addEventListener('click', closeCoverPreview);
  $('#coverPreview').addEventListener('click', event => { if (event.target === $('#coverPreview')) closeCoverPreview(); });

  $('#openStickers').addEventListener('click', () => $('#stickerDialog').showModal());
  $('#stickersResource').addEventListener('click', () => $('#stickerDialog').showModal());
  $('#uploadStickerButton').addEventListener('click', () => $('#stickerUpload').click());
  $('#uploadStickerFolderButton').addEventListener('click', () => $('#stickerFolderUpload').click());
  const addUploadedStickers = async input => {
    const files = [...input.files].filter(file => file.type.startsWith('image/'));
    for (const file of files) state.customStickers.push(await resizeImageFile(file, 520, true));
    input.value = '';
    renderStickerCollections();
    queueSave();
    showToast(`${files.length} adesivo${files.length === 1 ? '' : 's'} adicionado${files.length === 1 ? '' : 's'}.`);
  };
  $('#stickerUpload').addEventListener('change', event => addUploadedStickers(event.target));
  $('#stickerFolderUpload').addEventListener('change', event => addUploadedStickers(event.target));

  $('#openSync').addEventListener('click', () => { updateSyncUi(); $('#syncDialog').showModal(); });
  $('#createSyncCode').addEventListener('click', () => connectSyncCode(randomSyncCode(), false));
  $('#connectSyncCode').addEventListener('click', () => connectSyncCode($('#syncCodeInput').value, true));
  $('#copySyncCode').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(state.sync.code); showToast('Código particular copiado.'); }
    catch { $('#syncCodeOutput').select(); document.execCommand('copy'); showToast('Código particular copiado.'); }
  });
  $('#syncNow').addEventListener('click', async () => {
    if (!firestoreDb) return showToast('A conexão on-line será ativada na etapa Firebase.');
    syncCurrentPageFromEditor();
    await persistState(false);
    try { await pushStateToCloud(); showToast('Sincronização concluída.'); }
    catch { showToast('Não foi possível sincronizar agora.'); }
  });
  $('#disconnectSync').addEventListener('click', async () => {
    if (!confirm('Desconectar este aparelho da sincronização? Seus cadernos continuarão salvos aqui.')) return;
    stopRealtimeSync();
    state.sync = { code: '' };
    await persistState(false);
    updateSyncUi();
    showToast('Este aparelho foi desconectado.');
  });

  $('#openSecurity').addEventListener('click', () => $('#securityDialog').showModal());
  $('#backupAll').addEventListener('click', backupAllNotebooks);
  $('#restoreBackup').addEventListener('click', () => $('#restoreBackupInput').click());
  $('#restoreBackupInput').addEventListener('change', async event => {
    const file = event.target.files[0];
    event.target.value = '';
    if (file) await restoreBackupFile(file);
  });
  $('#changePasswordForm').addEventListener('submit', async event => {
    event.preventDefault();
    $('#passwordError').textContent = '';
    const current = $('#currentPassword').value;
    const next = $('#newPasswordValue').value;
    const repeat = $('#repeatNewPassword').value;
    const metadata = securityMetadata();
    const currentMaterial = await derivePasswordMaterial(current, base64ToBytes(metadata.salt));
    if (!equalBytes(await passwordVerifier(currentMaterial), base64ToBytes(metadata.verifier))) return $('#passwordError').textContent = 'Senha atual incorreta.';
    if (next.length < 6) return $('#passwordError').textContent = 'A nova senha precisa ter pelo menos 6 caracteres.';
    if (next !== repeat) return $('#passwordError').textContent = 'As duas novas senhas precisam ser iguais.';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const material = await derivePasswordMaterial(next, salt);
    localStorage.setItem(SECURITY_KEY, JSON.stringify({ version: 2, salt: bytesToBase64(salt), verifier: bytesToBase64(await passwordVerifier(material)) }));
    localCryptoKey = await importAesKey(material);
    await persistState(false);
    event.target.reset();
    $('#securityDialog').close();
    showToast('Senha alterada com segurança.');
  });
  $('#lockNow').addEventListener('click', () => lockApplication(false));

  $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
}

function initializeLockScreen() {
  const hasPassword = Boolean(securityMetadata());
  $('#confirmPasswordWrap').hidden = hasPassword;
  $('#passwordLabel').textContent = hasPassword ? 'Digite sua senha' : 'Crie sua senha';
  $('#unlockButton').textContent = hasPassword ? 'Entrar' : 'Criar senha e entrar';
  $('#lockText').textContent = hasPassword ? 'Digite sua senha para abrir seus cadernos.' : 'Crie uma senha para proteger seus cadernos neste aparelho.';
}

renderCoverPickers();
bindEvents();
initializeLockScreen();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
