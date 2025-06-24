// utils.js - 유틸리티 함수들
// 최신 JavaScript 문법 사용 (번들러 없이 개발할 때 문제가 될 수 있음)

// ES6+ 문법들
const formatDate = (date) => {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Arrow function과 template literals
const generateId = () => {
  return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Destructuring과 spread operator
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Optional chaining (최신 문법)
const safeGet = (obj, path) => {
  return path.split(".").reduce((current, key) => {
    return current?.[key];
  }, obj);
};

// Array methods (최신 문법)
const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    return { ...groups, [group]: [...(groups[group] || []), item] };
  }, {});
};

// Async/await (최신 문법)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Local Storage wrapper with error handling
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Storage set error:", error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Storage remove error:", error);
      return false;
    }
  },
};

// DOM 유틸리티
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// 이벤트 리스너 헬퍼
const addEvent = (element, event, handler) => {
  if (element) {
    element.addEventListener(event, handler);
  }
};

// 클래스 토글 헬퍼
const toggleClass = (element, className) => {
  if (element) {
    element.classList.toggle(className);
  }
};
