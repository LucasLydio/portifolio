const consoleElement = document.querySelector('.console');
const views = [...document.querySelectorAll('[data-view]')];
const choices = [...document.querySelectorAll('[data-choice]')];
const chapters = [...document.querySelectorAll('[data-chapter]')];
const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const content = document.querySelector('.chapter-content');
const announcement = document.querySelector('[data-announcement]');
const aButton = document.querySelector('[data-control="confirm"]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let view = 'boot';
let selection = 0;
let chapter = 'profile';
let readingMode = false;

function announce(message) {
  announcement.textContent = message;
}

function renderSelection() {
  const items = view === 'boot' ? choices : chapters;
  items.forEach((item, index) => {
    item.classList.toggle('is-selected', index === selection);
    item.setAttribute('aria-pressed', String(index === selection));
  });
}

function showView(next, focusTarget) {
  view = next;
  views.forEach((element) => { element.hidden = element.dataset.view !== next; });
  const isReader = view === 'reader';
  document.querySelector('[data-a-caption]').textContent = isReader ? 'A · MENU' : 'A · CONFIRM';
  aButton.setAttribute('aria-label', isReader ? 'A: open portfolio menu' : 'A: confirm selection');
  if (!isReader) renderSelection();
  focusTarget?.focus({ preventScroll: true });
}

function showMenu() {
  readingMode = false;
  selection = Math.max(0, chapters.findIndex((item) => item.dataset.chapter === chapter));
  showView('menu', document.querySelector('#menu-title'));
  announce('Portfolio menu. Use the arrow keys to choose a chapter, then A or Enter to open.');
}

function showBoot() {
  selection = 0;
  showView('boot', choices[0]);
  announce('Start the game? Yes is selected. No opens the reading view.');
}

function openChapter(name) {
  chapter = name;
  panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== name; });
  tabs.forEach((tab) => {
    if (tab.dataset.tab === name) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });
  showView('reader', panels.find((panel) => panel.dataset.panel === name).querySelector('h2'));
  content.scrollTop = 0;
  document.querySelector('[data-reader-hint]').textContent = readingMode
    ? 'Read at your pace. Choose a section above. B to return.'
    : 'Up / down to scroll · B to return to the menu';
  announce(`${tabs.find((tab) => tab.dataset.tab === name).textContent} opened. Use the section buttons or scroll to read.`);
}

function readProfile() {
  readingMode = true;
  openChapter('profile');
}

function move(direction) {
  if (view === 'reader') {
    if (direction === 'up' || direction === 'down') {
      content.scrollBy({ top: direction === 'up' ? -90 : 90, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    } else {
      const index = tabs.findIndex((tab) => tab.dataset.tab === chapter);
      const offset = direction === 'left' ? -1 : 1;
      openChapter(tabs[(index + offset + tabs.length) % tabs.length].dataset.tab);
    }
    return;
  }
  const items = view === 'boot' ? choices : chapters;
  const offset = direction === 'up' || direction === 'left' ? -1 : 1;
  selection = (selection + offset + items.length) % items.length;
  renderSelection();
  // Move focus with the selection so Enter always activates the highlighted item.
  items[selection].focus({ preventScroll: true });
  if (view === 'menu') items[selection].scrollIntoView({ block: 'nearest', behavior: 'instant' });
  announce(`${items[selection].textContent.trim().replace(/\s+/g, ' ')} selected.`);
}

function confirm() {
  if (view === 'boot') {
    if (selection === 0) showMenu();
    else readProfile();
  } else if (view === 'menu') {
    openChapter(chapters[selection].dataset.chapter);
  } else {
    showMenu();
  }
}

function back() {
  if (view === 'reader' && !readingMode) showMenu();
  else if (view === 'boot') {
    selection = 1;
    renderSelection();
    choices[1].focus({ preventScroll: true });
    announce('No selected. Press A or Enter to read the profile directly.');
  } else showBoot();
}

function control(action) {
  if (['up', 'down', 'left', 'right'].includes(action)) move(action);
  else if (action === 'confirm') confirm();
  else if (action === 'back') back();
  else if (action === 'select') move(view === 'reader' ? 'right' : 'down');
  else if (action === 'start') {
    if (view === 'boot') confirm();
    else showMenu();
  }
}

choices.forEach((choice, index) => {
  choice.addEventListener('focus', () => { if (view === 'boot') { selection = index; renderSelection(); } });
  choice.addEventListener('click', () => { selection = index; confirm(); });
});
chapters.forEach((item, index) => {
  item.addEventListener('focus', () => { if (view === 'menu') { selection = index; renderSelection(); } });
  item.addEventListener('click', () => { selection = index; openChapter(item.dataset.chapter); });
});
tabs.forEach((tab) => tab.addEventListener('click', () => openChapter(tab.dataset.tab)));
document.querySelectorAll('[data-control]').forEach((button) => button.addEventListener('click', () => control(button.dataset.control)));
document.querySelector('[data-read-profile]').addEventListener('click', readProfile);

const keyControls = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', a: 'confirm', A: 'confirm', b: 'back', B: 'back', Escape: 'back', Enter: 'confirm' };
document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  const action = keyControls[event.key];
  if (!action) return;
  const target = event.target;
  // Preserve native keyboard activation of buttons/links and page navigation outside the console.
  if (event.key === 'Enter' && target.closest('button, a')) return;
  if (target !== document.body && !consoleElement.contains(target)) return;
  if (event.repeat && !['up', 'down', 'left', 'right'].includes(action)) return;
  event.preventDefault();
  const button = document.querySelector(`[data-control="${action}"]`);
  button?.classList.add('is-pressed');
  window.setTimeout(() => button?.classList.remove('is-pressed'), 140);
  control(action);
});
