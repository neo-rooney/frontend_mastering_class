// main.js - 메인 애플리케이션 로직
// 모든 다른 JS 파일들에 의존함 (순서가 매우 중요!)

// 전역 변수들
let todoList;
let isInitialized = false;

// 애플리케이션 초기화
function initApp() {
  if (isInitialized) return;

  try {
    console.log("🚀 Todo 앱 초기화 시작...");

    // Todo 리스트 초기화
    todoList = new TodoList("todoList");

    // 이벤트 바인딩
    bindEvents();

    // 초기 통계 표시
    updateStatsDisplay();

    // 성능 측정을 위한 마커
    console.log("✅ Todo 앱 초기화 완료");
    console.log("📊 번들러 없이 개발한 버전");
    console.log("📁 로드된 파일들:");
    console.log("  - CSS: 4개 파일");
    console.log("  - JS: 5개 파일");
    console.log("  - 총 9개의 개별 파일");

    isInitialized = true;
  } catch (error) {
    console.error("❌ 앱 초기화 실패:", error);
    alert("앱 초기화에 실패했습니다: " + error.message);
  }
}

// 이벤트 바인딩
function bindEvents() {
  const todoInput = $("#todoInput");
  const addTodoBtn = $("#addTodoBtn");

  // Todo 추가 이벤트
  addEvent(addTodoBtn, "click", handleAddTodo);
  addEvent(todoInput, "keypress", (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  });

  // 입력 필드 포커스 이벤트
  addEvent(todoInput, "focus", () => {
    todoInput.style.borderColor = "#007bff";
  });

  addEvent(todoInput, "blur", () => {
    todoInput.style.borderColor = "#e0e0e0";
  });

  // 키보드 단축키
  addEvent(document, "keydown", handleKeyboardShortcuts);

  // 페이지 언로드 시 저장 확인
  addEvent(window, "beforeunload", () => {
    // LocalStorage는 자동으로 저장되므로 별도 처리 불필요
  });
}

// Todo 추가 처리
function handleAddTodo() {
  const todoInput = $("#todoInput");
  const text = todoInput.value.trim();

  if (!text) {
    showNotification("할 일을 입력해주세요.", "warning");
    todoInput.focus();
    return;
  }

  // 로딩 상태 표시
  const addBtn = $("#addTodoBtn");
  const btnText = addBtn.querySelector(".btn-text");
  const originalText = btnText.textContent;

  try {
    // 버튼 상태 변경
    btnText.textContent = "추가 중...";
    addBtn.disabled = true;
    addBtn.classList.add("loading");

    // Todo 추가
    todoList.addTodo(text);

    // 입력 필드 초기화
    todoInput.value = "";
    todoInput.focus();

    // 통계 업데이트
    updateStatsDisplay();

    // 성공 알림
    showNotification("할 일이 추가되었습니다!", "success");
  } catch (error) {
    console.error("Todo 추가 실패:", error);
    showNotification("할 일 추가에 실패했습니다: " + error.message, "error");
  } finally {
    // 로딩 상태 해제
    btnText.textContent = originalText;
    addBtn.disabled = false;
    addBtn.classList.remove("loading");
  }
}

// 키보드 단축키 처리
function handleKeyboardShortcuts(e) {
  // Ctrl/Cmd + Enter: Todo 추가
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    handleAddTodo();
  }

  // Ctrl/Cmd + D: 완료된 todos 삭제
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    handleDeleteCompleted();
  }

  // Ctrl/Cmd + K: 입력 필드 포커스
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    $("#todoInput").focus();
  }

  // Escape: 입력 필드 초기화
  if (e.key === "Escape") {
    const todoInput = $("#todoInput");
    if (document.activeElement === todoInput) {
      todoInput.value = "";
      todoInput.blur();
    }
  }
}

// 완료된 todos 삭제 처리
function handleDeleteCompleted() {
  try {
    const deletedCount = todoList.deleteCompletedTodos();
    if (deletedCount > 0) {
      updateStatsDisplay();
      showNotification(
        `${deletedCount}개의 완료된 할 일이 삭제되었습니다.`,
        "success"
      );
    }
  } catch (error) {
    console.error("완료된 todos 삭제 실패:", error);
    showNotification("삭제에 실패했습니다: " + error.message, "error");
  }
}

// 통계 표시 업데이트
function updateStatsDisplay() {
  if (todoList) {
    todoList.updateStats();
  }
}

// 알림 표시
function showNotification(message, type = "info") {
  // 기존 알림 제거
  const existingNotification = $(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // 새 알림 생성
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            ${type === "success" ? "background: #28a745;" : ""}
            ${type === "error" ? "background: #dc3545;" : ""}
            ${type === "warning" ? "background: #ffc107; color: #212529;" : ""}
            ${type === "info" ? "background: #17a2b8;" : ""}
        ">
            ${message}
        </div>
    `;

  document.body.appendChild(notification);

  // 3초 후 자동 제거
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// 성능 측정 함수
function measurePerformance() {
  const startTime = performance.now();

  // 페이지 로드 시간 측정
  window.addEventListener("load", () => {
    const loadTime = performance.now() - startTime;
    console.log(`📈 페이지 로드 시간: ${loadTime.toFixed(2)}ms`);

    // 네트워크 요청 수 계산
    const resourceCount = performance.getEntriesByType("resource").length;
    console.log(`🌐 네트워크 요청 수: ${resourceCount}개`);

    // 번들러 없이 개발할 때의 문제점들
    console.log("⚠️ 번들러 없이 개발할 때의 문제점들:");
    console.log("  - 파일이 너무 많음 (9개 파일)");
    console.log("  - 각 파일마다 별도 HTTP 요청");
    console.log("  - 로딩 순서 의존성 문제");
    console.log("  - 최신 문법 호환성 문제 가능성");
  });
}

// DOM이 준비되면 초기화
if (document.readyState === "loading") {
  addEvent(document, "DOMContentLoaded", () => {
    initApp();
    measurePerformance();
  });
} else {
  // DOM이 이미 로드된 경우
  initApp();
  measurePerformance();
}

// 전역 함수로 노출 (다른 모듈에서 사용)
window.updateStatsDisplay = updateStatsDisplay;
window.showNotification = showNotification;
