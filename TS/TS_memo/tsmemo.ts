// 메모리스트 데이터의 타입 정의
interface MemoData {
    index: number;
    subject: string;
    content: string;
}

// Web LocalStorage에서 가져온 데이터 JSON 파싱하고 배열로 저장하기
class LocalStorageHandler {
    
    constructor(private localStorageKey: string) {}

    // 로컬 스토리지에 메모 데이터 저장
    saveToLocalStorage(items: MemoData[]): boolean {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(items));
            return true;
        } catch (error) {
            console.log("saveToLocalStorage error...", error);
            return false;
        }
    }
    
    // 로컬 스토리지에서 메모 데이터 가져오기
    getFromLocalStorage(): MemoData[] {
        const storedData = localStorage.getItem(this.localStorageKey);
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch(error) {
                console.log("getFromLocalStorage error...");
            }
        }
        return [];
    }

} // end of class


const memoForm = document.getElementById("memo-form") as HTMLFormElement;
const memoInput = document.getElementById("memo-input") as HTMLFormElement;
const memoListElement = document.getElementById("memo-list") as HTMLFormElement;

updateMemoList();


// 사용자가 입력한 메모 추가
function addMemoList(index: number, subject: string, content: string): void {
    const memoStorage = new LocalStorageHandler("memoList");
    const newMemo: MemoData = { index: Date.now(), subject, content } // 새로운 메모 생성
    
    memoStorage.saveToLocalStorage([...memoStorage.getFromLocalStorage(), newMemo]);
    updateMemoList();
}

// 메모 추가 이벤트 리스너
memoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const memoContent = memoInput.value.trim();
    if (memoContent) {
        addMemoList(new Date().getTime(), "제목", memoContent);
        updateMemoList();
        // 입력 필드 초기화
        memoInput.value = ""; 
    } else {
        alert("메모를 입력하세요");
    }
});

// 메모리스트 업데이트
function updateMemoList(): void {
    const memoStorage = new LocalStorageHandler("memoList");
    const memoList: MemoData[] = memoStorage.getFromLocalStorage();

    memoListElement.innerHTML = "";
    renderMemo(memoList);

    memoStorage.saveToLocalStorage(memoList);
}

// 페이지에 메모를 랜더링
function renderMemo(memos: MemoData[]): void {
    memoListElement.innerHTML = ""; // 메모 리스트 비움

    if (memos.length === 0) {
        memoListElement.innerHTML = "<li>No memos found.</li>";
        return;
    }
    
    memos.forEach((memo) => {
        const memoItem = document.createElement("li");
        memoItem.classList.add("memo-item");
        memoItem.dataset.id = memo.index.toString(); // 데이터셋의 id 속성을 문자열로 설정

        const memoContent = document.createElement("div");
        memoContent.classList.add("memo-content");
        memoContent.textContent = memo.content;

        const memoActions = document.createElement("div");
        memoActions.classList.add("memo-actions");

        const deleteButton = document.createElement("span");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "삭제";
        deleteButton.onclick = () => deleteMemo(memo.index); // 클릭 시 삭제 이벤트 호출

        const modifyButton = document.createElement("span");
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
function deleteMemo(index: number): void {
    const memoStorage = new LocalStorageHandler("memoList");
    let memoList: MemoData[] = memoStorage.getFromLocalStorage();
    memoList = memoList.filter((memo) => memo.index !== index);
    
    // 로컬 스토리지에 메모 삭제 후 업데이트
    memoStorage.saveToLocalStorage(memoList);
    updateMemoList();
}

// 메모 삭제 이벤트 리스너
memoListElement.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).classList.contains("delete-button")) {
        const memoId = parseInt((e.target as HTMLElement).parentElement?.parentElement?.dataset.id || "");
        if(!isNaN(memoId)) {
            deleteMemo(memoId);
        }
    }  
});

// 메모 수정
function modifyMemo(index: number, newContent: string): void {
    const memoStorage = new LocalStorageHandler("memoList");
    let memoList: MemoData[] = memoStorage.getFromLocalStorage();
    const modifiedmemoIndex = memoList.findIndex((memo) => memo.index === index);

    if (modifiedmemoIndex !== -1) {
        // 로컬 스토리지에 메모 수정 후 업데이트
        memoList[modifiedmemoIndex].content = newContent;
        memoStorage.saveToLocalStorage(memoList);
        updateMemoList();
    }
}

// 메모 수정 이벤트 리스너
memoListElement.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).classList.contains("modify-button")){
        const memoId = parseInt((e.target as HTMLElement).parentElement?.parentElement?.dataset.id || "");
        if (!isNaN(memoId)) {
            // 수정할 내용을 사용자로부터 입력받아서 수정
            const newContent = prompt("메모를 수정하세요", "");
            if (newContent !== null) {
                modifyMemo(memoId, newContent);
            }
        }
    }
});
