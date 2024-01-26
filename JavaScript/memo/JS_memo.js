// 전역변수로 배열을 관리하면 전체 함수들에서 접근하기 편함
let memoList;  // 메모배열
let currMemo; // 현재메모

$(function () {
    // 메모 작성 버튼 클릭시 등록 폼 표시
    $("#registBtn").on("click", function () {
        $("#regist").css("display", "block");
    });

    // 확인 버튼 클릭 시 메모 등록
    $("#confirm").on("click", function () {
        addMemo();
    });

    // 취소 버튼 클릭 시 등록 폼 숨김
    $("#cancel").on("click", function () {
        $("#regist").hide();
    });

    // 검색 버튼 클릭 시 메모 검색
    $("#searchBtn").on("click", function () {
        searchMemo();
    });

    $("#modifyBtn").on("click", function () {
        modifyMemo(currMemo.index);
    });

    // 삭제 버튼 클릭 시 삭제 기능 호출
    $("#deleteBtn").on("click", function () {
        deleteMemo(currMemo.index);
    });

    // 상세 기능 처리를 위한 이벤트핸들러 등록
    // ul에 이벤트핸들러를 등록해도 event.target은 li가 되므로 
    // li마다 이벤트핸들러를 등록하지 않고 ul에서 한꺼번에 이벤트핸들러를 등록 (이를 이벤트위임이라 함)
    $("ul").on("click", function(event) {
        showDetail(event.target.getAttribute("dataIndex"));
    });

    memoList = [];
    currMemo = {};

    displayMemoList(getMemoList());

});

// 1. LocalStorage에서 메모리스트 가져오기
// 검색된리스트가 있으면 검색된리스트를 사용하고 그렇지 않으면 
// localStorage의 전체리스트를 사용
function getMemoList(searchList) {
        if (searchList) {
            memoList = searchList;
        } else {
            memoList = JSON.parse(localStorage.getItem("memoList")) || [];
        }
        return memoList;        
}

// LocalStorage에 메모 리스트 업데이트
function updateMemoList(memoList) {
    localStorage.setItem("memoList", JSON.stringify(memoList));
}

// 메모리스트 화면에 표시
function displayMemoList(memoList) {
    console.log(memoList);
    let $memoList = $("#list ul");
    $memoList.empty();

    memoList?.forEach((memo, index) => {
        $memoList.append($("<li>").text(memo.subject).attr("dataIndex", index));
    });

    // 현재메모 설정
    currMemo = memoList ? memoList[0] : {};

    // 리스트 출력시 첫번째 컨텐츠 보여주기
    // memoList[0]이 있을때만 content에 접근
    $("#detailcont").val(memoList[0]?.content);

}

// 2. 메모 등록하기
function addMemo() {
    let content = $("#content").val();

    // 새로운 메모 객체 생성
    let newMemo = { 
        index: getMemoList().length,
        subject: $("#subject").val(), 
        content: content 
    };

    // 메모 리스트에 새로운 메모 추가
    memoList.push(newMemo);

    // LocalStorage에 업데이트된 메모 리스트 저장
    updateMemoList(memoList);
    
    // 화면 갱신
    displayMemoList(memoList);

    // 등록 폼 초기화 및 숨김
	$("#detailcont").val(content);
    $("#subject").val("");
    $("#content").val("");
    $("#regist").hide();
}


// 3. 메모 삭제하기
// 현재메모를 메모리스트에서 삭제
function deleteMemo(currMemoIndex) {
    memoList.splice(memoList.indexOf(memoList.filter(memo => memo.index === currMemoIndex)[0]), 1);
    updateMemoList(memoList);
    displayMemoList(memoList);
}

// 4. 메모 수정하기
// 현재메모를 삭제하고 수정된메모를 등록하는 것으로 구현
function modifyMemo(currMemoIndex) {
    const memoSubject = memoList.filter(memo => memo.index === currMemoIndex)[0].subject;
    memoList[memoList.length] = {index: currMemoIndex , subject: memoSubject, content: $("#detailcont").val()};    
    deleteMemo(currMemoIndex);
    updateMemoList(memoList);
    displayMemoList(memoList);
}

// 5. 메모 상세 확인하기
// 불필요한 변수를 줄이면 코드양이 줄어들 것임
// textarea의 경우 text메소드가 아니라 val메소드 사용해야함
// 현재메모 설정
function showDetail(index) {
    $("#detailcont").val(memoList[index].content);
    currMemo = memoList.filter(memo => memo.index === memoList[index].index)[0];
    $("#modifyBtn, #deleteBtn").prop("disabled", false);
}

// 6. 메모 검색하기
// filter메서드를 활용하면 좋을 듯
// 검색된리스트를 활용
function searchMemo() {
    let searchText = $("#searchTxt").val().toLowerCase();
    let searchList = memoList.filter(memo => 
        memo.subject.toLowerCase().includes(searchText) || memo.content.toLowerCase().includes(searchText)
    );
    displayMemoList(getMemoList(searchList));
}