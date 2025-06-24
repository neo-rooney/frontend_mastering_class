// todoItem.js - 개별 Todo 아이템 관리
// utils.js와 todoService.js에 의존함

class TodoItem {
  constructor(todo) {
    this.todo = todo;
    this.element = null;
    this.render();
  }

  // Todo 아이템 DOM 요소 생성
  render() {
    const li = document.createElement("li");
    li.className = `todo-item ${this.todo.completed ? "completed" : ""}`;
    li.dataset.id = this.todo.id;

    li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${
              this.todo.completed ? "checked" : ""
            }>
            <span class="todo-text">${this.escapeHtml(this.todo.text)}</span>
            <div class="todo-actions">
                <span class="todo-delete" title="삭제">🗑️</span>
            </div>
        `;

    this.element = li;
    this.bindEvents();
  }

  // HTML 이스케이프 (XSS 방지)
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // 이벤트 바인딩
  bindEvents() {
    const checkbox = this.element.querySelector(".todo-checkbox");
    const deleteBtn = this.element.querySelector(".todo-delete");

    // 체크박스 이벤트
    addEvent(checkbox, "change", (e) => {
      this.toggleComplete();
    });

    // 삭제 버튼 이벤트
    addEvent(deleteBtn, "click", (e) => {
      e.stopPropagation();
      this.delete();
    });

    // 아이템 클릭 이벤트 (편집 모드)
    addEvent(this.element, "dblclick", (e) => {
      if (e.target !== checkbox && e.target !== deleteBtn) {
        this.startEdit();
      }
    });
  }

  // 완료/미완료 토글
  toggleComplete() {
    try {
      this.todo = todoService.toggleTodo(this.todo.id);
      this.updateUI();
    } catch (error) {
      console.error("Todo 토글 실패:", error);
      alert("Todo 상태 변경에 실패했습니다.");
    }
  }

  // 삭제
  delete() {
    if (confirm("정말로 이 Todo를 삭제하시겠습니까?")) {
      try {
        todoService.deleteTodo(this.todo.id);
        this.element.remove();

        // 통계 업데이트
        this.updateStats();
      } catch (error) {
        console.error("Todo 삭제 실패:", error);
        alert("Todo 삭제에 실패했습니다.");
      }
    }
  }

  // 편집 모드 시작
  startEdit() {
    const textSpan = this.element.querySelector(".todo-text");
    const currentText = textSpan.textContent;

    // 입력 필드로 변경
    const input = document.createElement("input");
    input.type = "text";
    input.className = "todo-edit-input";
    input.value = currentText;

    // 스타일 적용
    input.style.cssText = `
            flex: 1;
            border: 2px solid #007bff;
            border-radius: 4px;
            padding: 8px;
            font-size: 16px;
            background: white;
        `;

    // 기존 텍스트를 입력 필드로 교체
    textSpan.replaceWith(input);
    input.focus();
    input.select();

    // 편집 완료 이벤트
    const finishEdit = () => {
      const newText = input.value.trim();

      if (newText === "") {
        // 빈 텍스트면 삭제
        this.delete();
        return;
      }

      if (newText !== currentText) {
        // 텍스트가 변경되었으면 업데이트
        try {
          this.todo = todoService.updateTodo(this.todo.id, { text: newText });
        } catch (error) {
          console.error("Todo 업데이트 실패:", error);
          alert("Todo 업데이트에 실패했습니다.");
        }
      }

      // 텍스트 스팬으로 복원
      const newTextSpan = document.createElement("span");
      newTextSpan.className = "todo-text";
      newTextSpan.textContent = this.todo.text;
      input.replaceWith(newTextSpan);
    };

    // Enter 키 또는 포커스 아웃으로 편집 완료
    addEvent(input, "keydown", (e) => {
      if (e.key === "Enter") {
        finishEdit();
      } else if (e.key === "Escape") {
        // 취소
        const newTextSpan = document.createElement("span");
        newTextSpan.className = "todo-text";
        newTextSpan.textContent = currentText;
        input.replaceWith(newTextSpan);
      }
    });

    addEvent(input, "blur", finishEdit);
  }

  // UI 업데이트
  updateUI() {
    if (this.todo.completed) {
      this.element.classList.add("completed");
      this.element.querySelector(".todo-checkbox").checked = true;
    } else {
      this.element.classList.remove("completed");
      this.element.querySelector(".todo-checkbox").checked = false;
    }
  }

  // 통계 업데이트 (전역 함수 호출)
  updateStats() {
    if (typeof updateStatsDisplay === "function") {
      updateStatsDisplay();
    }
  }

  // DOM 요소 반환
  getElement() {
    return this.element;
  }

  // Todo 데이터 반환
  getTodo() {
    return this.todo;
  }
}
