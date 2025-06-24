// todoService.js - Todo 데이터 관리 서비스
// utils.js에 의존함 (순서가 중요!)

class TodoService {
  constructor() {
    this.storageKey = "todos";
    this.todos = this.loadTodos();
  }

  // LocalStorage에서 todos 로드
  loadTodos() {
    const savedTodos = storage.get(this.storageKey);
    return savedTodos || [];
  }

  // LocalStorage에 todos 저장
  saveTodos() {
    return storage.set(this.storageKey, this.todos);
  }

  // 모든 todos 가져오기
  getAllTodos() {
    return [...this.todos];
  }

  // 필터링된 todos 가져오기
  getTodosByFilter(filter) {
    switch (filter) {
      case "completed":
        return this.todos.filter((todo) => todo.completed);
      case "pending":
        return this.todos.filter((todo) => !todo.completed);
      default:
        return [...this.todos];
    }
  }

  // 새로운 todo 추가
  addTodo(text) {
    if (!text || text.trim() === "") {
      throw new Error("Todo 텍스트를 입력해주세요.");
    }

    const newTodo = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.todos.push(newTodo);
    this.saveTodos();

    return newTodo;
  }

  // todo 업데이트
  updateTodo(id, updates) {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("Todo를 찾을 수 없습니다.");
    }

    this.todos[todoIndex] = {
      ...this.todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveTodos();
    return this.todos[todoIndex];
  }

  // todo 완료/미완료 토글
  toggleTodo(id) {
    const todo = this.todos.find((todo) => todo.id === id);

    if (!todo) {
      throw new Error("Todo를 찾을 수 없습니다.");
    }

    return this.updateTodo(id, { completed: !todo.completed });
  }

  // todo 삭제
  deleteTodo(id) {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("Todo를 찾을 수 없습니다.");
    }

    const deletedTodo = this.todos.splice(todoIndex, 1)[0];
    this.saveTodos();

    return deletedTodo;
  }

  // 모든 완료된 todos 삭제
  deleteCompletedTodos() {
    const completedTodos = this.todos.filter((todo) => todo.completed);
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.saveTodos();

    return completedTodos;
  }

  // 통계 정보 가져오기
  getStats() {
    const total = this.todos.length;
    const completed = this.todos.filter((todo) => todo.completed).length;
    const pending = total - completed;

    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  // 검색 기능
  searchTodos(query) {
    if (!query || query.trim() === "") {
      return [...this.todos];
    }

    const searchTerm = query.toLowerCase().trim();
    return this.todos.filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm)
    );
  }

  // 데이터 내보내기
  exportTodos() {
    return JSON.stringify(this.todos, null, 2);
  }

  // 데이터 가져오기
  importTodos(jsonData) {
    try {
      const importedTodos = JSON.parse(jsonData);

      if (!Array.isArray(importedTodos)) {
        throw new Error("잘못된 데이터 형식입니다.");
      }

      // 데이터 검증
      const validTodos = importedTodos.filter(
        (todo) =>
          todo &&
          typeof todo === "object" &&
          todo.id &&
          todo.text &&
          typeof todo.completed === "boolean"
      );

      this.todos = validTodos;
      this.saveTodos();

      return validTodos.length;
    } catch (error) {
      throw new Error("데이터 가져오기에 실패했습니다: " + error.message);
    }
  }

  // 데이터 초기화
  clearAllTodos() {
    const deletedCount = this.todos.length;
    this.todos = [];
    this.saveTodos();
    return deletedCount;
  }
}

// 전역 인스턴스 생성
const todoService = new TodoService();
