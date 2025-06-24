// todoList.js - Todo 리스트 관리
// utils.js, todoService.js, todoItem.js에 의존함

class TodoList {
  constructor(containerId) {
    this.container = $(`#${containerId}`);
    this.currentFilter = "all";
    this.todoItems = new Map(); // id -> TodoItem 인스턴스
    this.init();
  }

  // 초기화
  init() {
    if (!this.container) {
      console.error("Todo 리스트 컨테이너를 찾을 수 없습니다.");
      return;
    }

    this.loadTodos();
    this.bindFilterEvents();
  }

  // 필터 이벤트 바인딩
  bindFilterEvents() {
    const filterButtons = $$(".filter-btn");

    filterButtons.forEach((btn) => {
      addEvent(btn, "click", (e) => {
        const filter = e.target.dataset.filter;
        this.setFilter(filter);
      });
    });
  }

  // 필터 설정
  setFilter(filter) {
    this.currentFilter = filter;

    // 필터 버튼 활성화 상태 업데이트
    $$(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.filter === filter) {
        btn.classList.add("active");
      }
    });

    this.render();
  }

  // 모든 todos 로드
  loadTodos() {
    const todos = todoService.getAllTodos();
    this.renderTodos(todos);
  }

  // todos 렌더링
  renderTodos(todos) {
    // 기존 아이템들 제거
    this.todoItems.clear();
    this.container.innerHTML = "";

    if (todos.length === 0) {
      this.showEmptyState();
      return;
    }

    // 새로운 아이템들 추가
    todos.forEach((todo) => {
      const todoItem = new TodoItem(todo);
      this.todoItems.set(todo.id, todoItem);
      this.container.appendChild(todoItem.getElement());
    });
  }

  // 빈 상태 표시
  showEmptyState() {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-state";
    emptyMessage.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6c757d;">
                <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
                <h3>할 일이 없습니다</h3>
                <p>새로운 할 일을 추가해보세요!</p>
            </div>
        `;
    this.container.appendChild(emptyMessage);
  }

  // 현재 필터에 따라 리스트 렌더링
  render() {
    const todos = todoService.getTodosByFilter(this.currentFilter);
    this.renderTodos(todos);
  }

  // 새로운 todo 추가
  addTodo(text) {
    try {
      const newTodo = todoService.addTodo(text);
      const todoItem = new TodoItem(newTodo);
      this.todoItems.set(newTodo.id, todoItem);

      // 현재 필터가 'all'이거나 'pending'인 경우에만 표시
      if (this.currentFilter === "all" || this.currentFilter === "pending") {
        this.container.appendChild(todoItem.getElement());
      }

      // 빈 상태 메시지 제거
      const emptyState = this.container.querySelector(".empty-state");
      if (emptyState) {
        emptyState.remove();
      }

      return newTodo;
    } catch (error) {
      console.error("Todo 추가 실패:", error);
      throw error;
    }
  }

  // todo 삭제 (리스트에서 제거)
  removeTodo(id) {
    const todoItem = this.todoItems.get(id);
    if (todoItem) {
      todoItem.getElement().remove();
      this.todoItems.delete(id);
    }
  }

  // todo 업데이트
  updateTodo(id, updates) {
    try {
      const updatedTodo = todoService.updateTodo(id, updates);
      const todoItem = this.todoItems.get(id);

      if (todoItem) {
        todoItem.todo = updatedTodo;
        todoItem.updateUI();

        // 필터에 따라 표시/숨김 처리
        this.handleFilterVisibility(updatedTodo);
      }

      return updatedTodo;
    } catch (error) {
      console.error("Todo 업데이트 실패:", error);
      throw error;
    }
  }

  // 필터에 따른 표시/숨김 처리
  handleFilterVisibility(todo) {
    const todoItem = this.todoItems.get(todo.id);
    if (!todoItem) return;

    const element = todoItem.getElement();
    let shouldShow = false;

    switch (this.currentFilter) {
      case "all":
        shouldShow = true;
        break;
      case "completed":
        shouldShow = todo.completed;
        break;
      case "pending":
        shouldShow = !todo.completed;
        break;
    }

    if (shouldShow && !element.parentNode) {
      // 표시되어야 하는데 숨겨져 있으면 추가
      this.container.appendChild(element);
    } else if (!shouldShow && element.parentNode) {
      // 숨겨져야 하는데 표시되어 있으면 제거
      element.remove();
    }
  }

  // 검색 기능
  search(query) {
    const searchResults = todoService.searchTodos(query);
    this.renderTodos(searchResults);
  }

  // 모든 완료된 todos 삭제
  deleteCompletedTodos() {
    if (confirm("완료된 모든 할 일을 삭제하시겠습니까?")) {
      try {
        const deletedTodos = todoService.deleteCompletedTodos();

        // 삭제된 todos를 리스트에서 제거
        deletedTodos.forEach((todo) => {
          this.removeTodo(todo.id);
        });

        // 현재 필터가 'completed'인 경우 빈 상태 표시
        if (this.currentFilter === "completed") {
          this.showEmptyState();
        }

        return deletedTodos;
      } catch (error) {
        console.error("완료된 todos 삭제 실패:", error);
        throw error;
      }
    }
    return [];
  }

  // 모든 todos 삭제
  clearAllTodos() {
    if (
      confirm("모든 할 일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      try {
        const deletedCount = todoService.clearAllTodos();
        this.todoItems.clear();
        this.container.innerHTML = "";
        this.showEmptyState();
        return deletedCount;
      } catch (error) {
        console.error("모든 todos 삭제 실패:", error);
        throw error;
      }
    }
    return 0;
  }

  // 통계 업데이트
  updateStats() {
    const stats = todoService.getStats();

    const totalElement = $("#totalCount");
    const completedElement = $("#completedCount");
    const pendingElement = $("#pendingCount");

    if (totalElement) totalElement.textContent = `전체: ${stats.total}개`;
    if (completedElement)
      completedElement.textContent = `완료: ${stats.completed}개`;
    if (pendingElement) pendingElement.textContent = `대기: ${stats.pending}개`;
  }

  // 현재 필터 반환
  getCurrentFilter() {
    return this.currentFilter;
  }

  // 모든 todo 아이템 반환
  getAllTodoItems() {
    return Array.from(this.todoItems.values());
  }
}
