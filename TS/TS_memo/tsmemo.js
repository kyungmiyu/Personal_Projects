var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Web LocalStorage에서 가져온 데이터 JSON 파싱하고 배열로 저장하기
var LocalStorageHandler = /** @class */ (function () {
    function LocalStorageHandler(localStorageKey) {
        this.localStorageKey = localStorageKey;
    }
    // 로컬 스토리지에 메모 데이터 저장
    LocalStorageHandler.prototype.saveToLocalStorage = function (items) {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(items));
            return true;
        }
        catch (error) {
            console.log("saveToLocalStorage error...", error);
            return false;
        }
    };
    // 로컬 스토리지에서 메모 데이터 가져오기
    LocalStorageHandler.prototype.getFromLocalStorage = function () {
        var storedData = localStorage.getItem(this.localStorageKey);
        if (storedData) {
            try {
                return JSON.parse(storedData);
            }
            catch (error) {
                console.log("getFromLocalStorage error...");
            }
        }
        return [];
    };
    return LocalStorageHandler;
}()); // end of class
var memoForm = document.getElementById("memo-form");
var memoInput = document.getElementById("memo-input");
var memoListElement = document.getElementById("memo-list");
updateMemoList();
// 사용자가 입력한 메모 추가
function addMemoList(index, subject, content) {
    var memoStorage = new LocalStorageHandler("memoList");
    var newMemo = { index: Date.now(), subject: subject, content: content }; // 새로운 메모 생성
    memoStorage.saveToLocalStorage(__spreadArray(__spreadArray([], memoStorage.getFromLocalStorage(), true), [newMemo], false));
    updateMemoList();
}
// 메모 추가 이벤트 리스너
memoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var memoContent = memoInput.value.trim();
    if (memoContent) {
        addMemoList(new Date().getTime(), "제목", memoContent);
        updateMemoList();
        // 입력 필드 초기화
        memoInput.value = "";
    }
    else {
        alert("메모를 입력하세요");
    }
});
// 메모리스트 업데이트
function updateMemoList() {
    var memoStorage = new LocalStorageHandler("memoList");
    var memoList = memoStorage.getFromLocalStorage();
    memoListElement.innerHTML = "";
    renderMemo(memoList);
    memoStorage.saveToLocalStorage(memoList);
}
// 페이지에 메모를 랜더링
function renderMemo(memos) {
    memoListElement.innerHTML = ""; // 메모 리스트 비움
    if (memos.length === 0) {
        memoListElement.innerHTML = "<li>No memos found.</li>";
        return;
    }
    memos.forEach(function (memo) {
        var memoItem = document.createElement("li");
        memoItem.classList.add("memo-item");
        memoItem.dataset.id = memo.index.toString(); // 데이터셋의 id 속성을 문자열로 설정
        var memoContent = document.createElement("div");
        memoContent.classList.add("memo-content");
        memoContent.textContent = memo.content;
        var memoActions = document.createElement("div");
        memoActions.classList.add("memo-actions");
        var deleteButton = document.createElement("span");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "삭제";
        deleteButton.onclick = function () { return deleteMemo(memo.index); }; // 클릭 시 삭제 이벤트 호출
        var modifyButton = document.createElement("span");
        modifyButton.classList.add("modify-button");
        modifyButton.textContent = "수정";
        memoActions.appendChild(modifyButton);
        memoActions.appendChild(deleteButton);
        memoItem.appendChild(memoContent);
        memoItem.appendChild(memoActions);
        memoListElement.appendChild(memoItem);
    });
}
// 메모 삭제
function deleteMemo(index) {
    var memoStorage = new LocalStorageHandler("memoList");
    var memoList = memoStorage.getFromLocalStorage();
    memoList = memoList.filter(function (memo) { return memo.index !== index; });
    // 로컬 스토리지에 메모 삭제 후 업데이트
    memoStorage.saveToLocalStorage(memoList);
    updateMemoList();
}
// 메모 삭제 이벤트 리스너
memoListElement.addEventListener("click", function (e) {
    var _a, _b;
    if (e.target.classList.contains("delete-button")) {
        var memoId = parseInt(((_b = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.id) || "");
        if (!isNaN(memoId)) {
            deleteMemo(memoId);
        }
    }
});
// 메모 수정
function modifyMemo(index, newContent) {
    var memoStorage = new LocalStorageHandler("memoList");
    var memoList = memoStorage.getFromLocalStorage();
    var modifiedmemoIndex = memoList.findIndex(function (memo) { return memo.index === index; });
    if (modifiedmemoIndex !== -1) {
        // 로컬 스토리지에 메모 수정 후 업데이트
        memoList[modifiedmemoIndex].content = newContent;
        memoStorage.saveToLocalStorage(memoList);
        updateMemoList();
    }
}
// 메모 수정 이벤트 리스너
memoListElement.addEventListener("click", function (e) {
    var _a, _b;
    if (e.target.classList.contains("modify-button")) {
        var memoId = parseInt(((_b = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.id) || "");
        if (!isNaN(memoId)) {
            // 수정할 내용을 사용자로부터 입력받아서 수정
            var newContent = prompt("메모를 수정하세요", "");
            if (newContent !== null) {
                modifyMemo(memoId, newContent);
            }
        }
    }
});
