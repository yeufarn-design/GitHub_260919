const STORAGE_KEY = 'todo-list-items';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const emptyState = document.querySelector('#empty-state');
const remainingCount = document.querySelector('#remaining-count');
const themeToggle = document.querySelector('#theme-toggle');
const themeToggleIcon = document.querySelector('#theme-toggle-icon');
const themeToggleLabel = document.querySelector('#theme-toggle-label');
const filterButtons = document.querySelectorAll('.filter-button');

const THEME_STORAGE_KEY = 'todo-list-theme';
let currentFilter = 'all';

// 依照使用者的選擇設定主題,沒有選擇時交由 CSS 跟隨系統設定。
function applyTheme(theme) {
  if (theme) {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }

  const isDark = theme === 'dark'
    || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  themeToggleIcon.textContent = isDark ? '☀️' : '🌙';
  themeToggleLabel.textContent = isDark ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null);

// 尚未手動選擇主題時,系統設定變更也要同步更新按鈕狀態。
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!localStorage.getItem(THEME_STORAGE_KEY)) applyTheme(null);
});

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark'
    || (!document.documentElement.dataset.theme
      && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const nextTheme = isDark ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
});

// 從 localStorage 讀取資料,格式不正確時回傳空陣列。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(savedTodos)) return [];

    return savedTodos.filter((todo) => (
      todo && typeof todo.id === 'string' && typeof todo.text === 'string'
    )).map((todo) => ({
      id: todo.id,
      text: todo.text,
      completed: Boolean(todo.completed),
    }));
  } catch (error) {
    return [];
  }
}

let todos = loadTodos();

// 將目前的待辦清單保存到瀏覽器。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 使用時間與隨機字串組成每筆待辦的識別碼。
function createTodoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 根據資料重新繪製清單、空狀態與未完成數量。
function renderTodos() {
  list.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item is-completed' : 'todo-item';
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.className = 'todo-checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `完成「${todo.text}」`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  const unfinishedCount = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${unfinishedCount} 項`;
  if (visibleTodos.length === 0) {
    const emptyMessages = {
      all: '還沒有任何待辦事項,新增一個吧!',
      active: '太棒了,目前沒有未完成事項!',
      completed: '目前還沒有已完成事項。',
    };
    emptyState.textContent = emptyMessages[currentFilter];
  }
  emptyState.hidden = visibleTodos.length > 0;
}

// 切換篩選條件並更新目前選中的按鈕樣式。
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((currentButton) => {
      const isActive = currentButton === button;
      currentButton.classList.toggle('is-active', isActive);
      currentButton.setAttribute('aria-pressed', String(isActive));
    });
    renderTodos();
  });
});

// 表單送出時新增待辦,空白內容不會建立資料。
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  todos.push({
    id: createTodoId(),
    text,
    completed: false,
  });
  saveTodos();
  renderTodos();
  input.value = '';
  input.focus();
});

// 使用事件委派處理刪除,避免逐筆綁定事件。
list.addEventListener('click', (event) => {
  const item = event.target.closest('.todo-item');
  if (!item) return;

  const todo = todos.find((currentTodo) => currentTodo.id === item.dataset.id);
  if (!todo) return;

  if (event.target.matches('.delete-button')) {
    todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
  } else {
    return;
  }

  saveTodos();
  renderTodos();
});

// 使用 change 事件更新勾選狀態,滑鼠與鍵盤操作都能正常觸發。
list.addEventListener('change', (event) => {
  if (!event.target.matches('.todo-checkbox')) return;

  const item = event.target.closest('.todo-item');
  const todo = todos.find((currentTodo) => currentTodo.id === item.dataset.id);
  if (!todo) return;

  todo.completed = event.target.checked;
  saveTodos();
  renderTodos();
});

renderTodos();