document.addEventListener("DOMContentLoaded", (event) => {
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) {
        // 使用 CSS 或 GSAP 進行簡單淡出
        gsap.to(loadingEl, { duration: 0.3, opacity: 0, onComplete: () => loadingEl.style.display = 'none' });
    }
});

//===============
// 場地響應式大小 (需配合css)
//===============
// 更新 CSS 變量
function updateVwVariable() {
    document.documentElement.style.setProperty('--vw', window.innerWidth / 100);
    document.documentElement.style.setProperty('--vh', window.innerHeight / 100);
}

// 初始化和監聽視窗大小變化
window.addEventListener('resize', updateVwVariable);
updateVwVariable();

// 星星特效初始化
function initStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;

    const starCount = 30; // 不用太多，約 30 顆

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // 隨機位置
        const x = Math.random() * 100; // vw
        const y = Math.random() * 100; // vh (% of container)

        // 隨機大小 (增加尺寸以顯示星芒形狀)
        const size = Math.random() * 12 + 4; // 4px - 12px

        // 隨機動畫延遲與持續時間
        const duration = Math.random() * 3 + 2; // 2s - 5s
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.5; // 0.5 - 1.0 peak opacity

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        star.style.setProperty('--opacity', opacity);

        starsContainer.appendChild(star);
    }
}

// 啟動星星
initStars();

// 音效
// ==========================================
var soundClick = new Howl({
    src: ['assets/audio/button_click.mp3'],
    volume: .1
});
var soundSlot = new Howl({
    src: ['assets/audio/rolling.mp3'],
    loop: true,
    volume: .5
});
var soundSlotEnd = new Howl({
    src: ['assets/audio/cash.mp3'],
    volume: .5
});

var soundWin1 = new Howl({
    src: ['assets/audio/win1.mp3'],
    volume: 1
});

var soundWin2 = new Howl({
    src: ['assets/audio/win2.mp3'],
    volume: .6
});



// =========================
// 歷史紀錄功能
// =========================
const historyKey = 'luckyDrawHistory';
const btnHistory = document.getElementById('btnHistory');
const historyModal = document.getElementById('historyModal');
const btnCloseHistory = document.getElementById('btnCloseHistory');
const historyList = document.getElementById('historyList');
const btnClearHistory = document.getElementById('btnClearHistory');

function loadHistoryData() {
    const data = localStorage.getItem(historyKey);
    return data ? JSON.parse(data) : [];
}

function saveHistory(num) {
    const history = loadHistoryData();
    // 將新結果加入到歷史紀錄的開頭
    history.unshift({
        num: num,
        timestamp: new Date().toISOString() // 儲存 ISO 格式，讀取時再格式化（如果需要）
    });
    localStorage.setItem(historyKey, JSON.stringify(history));
}

//================================
// 全部號碼總組數
const totalSlotLength = 115;
// 排除號碼
const exNum = [1, 2, 4, 10, 13, 14, 24, 34, 40, 44];
// 生成總抽獎數組
const fullArray = Array.from({ length: totalSlotLength }, (_, index) => index + 1);
// 過濾exNum的數字
let slotData = [];

function initSlotData() {
    const history = loadHistoryData();
    const historyNums = history.map(item => item.num);
    slotData = fullArray.filter(num => !exNum.includes(num) && !historyNums.includes(num));
    console.log('抽獎資料初始化完成。剩餘：', slotData.length);
}

// 初始載入
initSlotData();

// ====================
// 單人老虎機
// ====================
// DOM 元素
const slotResultEl = document.getElementById('slotResult');
const slotSingleList = document.getElementById('slot_single');
const btnSingleGo = document.getElementById('btnSingleGo');
const endTextEl = document.getElementById('endText');
const replayEl = document.getElementById('replay');
const ctrlsEl = document.querySelector('.ctrls');

// 我們需要實作捲動效果。
// 策略：
// 1. 在 'slotSingleList' 中填入長長的項目列表。
// 2. 最後一個項目（或特定項目）將是贏家。
// 3. 動畫化列表的 'scrollTop' 或 translateY。

const ITEM_HEIGHT = 150; // 預估值，請根據 CSS 調整！！
// 假設 .item 高度。需要檢查 CSS 或計算樣式。
// 理想情況下如果可能的話讀取計算後的樣式，但現在先假設一個固定高度或進行測量。

function getSampleItemHeight() {
    // 輔助函式：如果列表已填充，則測量項目高度
    const item = slotSingleList.querySelector('.item');
    if (item) return item.offsetHeight;
    return 100; // fallback
}

// GSAP 老虎機實作
function runSlotAnimation() {
    // 1. 選出贏家
    if (slotData.length === 0) {
        alert("已抽出所有號碼了哦！");
        btnSingleGo.classList.remove('disabled');
        btnSingleGo.style.display = '';
        return;
    }

    const randomIndex = Math.floor(Math.random() * slotData.length);
    const winnerNum = slotData[randomIndex];

    // 2. 建立動畫列表
    // 我們需要足夠的項目來捲動幾秒鐘。
    // 讓我們從可用集合中建立一個隨機號碼列表，並以贏家結束。
    const scrollItemsCount = 30; // 要捲動的項目數量
    let itemsHtml = '';

    // 將當前顯示的結果作為第一個項目，確保如果我們正在顯示某些內容時能無縫開始
    // (可選，簡化為僅隨機流)

    for (let i = 0; i < scrollItemsCount; i++) {
        // 隨機「填充」號碼
        const r = slotData[Math.floor(Math.random() * slotData.length)];
        itemsHtml += `<li class="item">${r}</li>`;
    }
    // 在最後加入贏家
    itemsHtml += `<li class="item" id="winner-item">${winnerNum}</li>`;
    // 在後面添加一些贏家或通用項目的複本，以避免稍微過衝時出現空白（安全措施）
    // 實際上，GSAP scrollTo 可以針對特定元素。

    slotSingleList.innerHTML = itemsHtml;

    // 顯示列表容器
    slotSingleList.style.display = 'block';

    // 既然項目已在 DOM 中，測量高度
    const itemHeight = slotSingleList.querySelector('.item').offsetHeight;
    // 重置位置
    gsap.set(slotSingleList, { y: 0 });

    // 3. 開始狀態
    const emptyMsg = document.querySelector('.single .empty');
    if (emptyMsg) emptyMsg.style.display = 'none';

    if (ctrlsEl) ctrlsEl.style.display = 'none';
    soundSlot.play();

    // 4. 動畫
    // 計算目標 Y 值。我們想要向上捲動，所以列表向下移動？
    // 通常老虎機將條帶向下移動（項目向下），或向上（項目向上）。
    // 原始的 jSlots 是「向上」旋轉（號碼向上移動）。
    // 所以我們將 Y 平移為負值。
    const totalHeight = (scrollItemsCount + 1) * itemHeight;
    // 目標是顯示贏家。贏家位於索引 'scrollItemsCount'。
    // 贏家位置 = scrollItemsCount * itemHeight。
    // 我們希望贏家置中或置頂。根據 jSlots 通常的情況，目前假設頂部對齊。
    // 如果包裹容器的高度為 1 個項目，我們捲動到 -WinnerPosition。

    gsap.to(slotSingleList, {
        y: - (scrollItemsCount * itemHeight),
        duration: 3, // Duration of spin
        ease: "back.out(0.5)", // Ease out with a little overshoot for "lock" effect
        onComplete: () => {
            // 動畫結束
            onSpinEnd(winnerNum, randomIndex);
        }
    });
}

function onSpinEnd(winnerNum, removeIndex) {
    if (ctrlsEl) ctrlsEl.style.display = '';

    soundSlot.stop();
    soundSlotEnd.play();

    setTimeout(function () {
        soundWin1.play();
    }, 300);

    setTimeout(function () {
        soundWin2.play();
        soundWin2.fade(0, .6, 0);
    }, 600);

    // 更新結果顯示
    slotResultEl.innerHTML = winnerNum;
    slotSingleList.style.display = 'none';

    // 儲存至歷史紀錄
    saveHistory(winnerNum);

    // 觸發特效
    endTextEl.classList.add('animate__animated', 'animate__pulse', 'animate__repeat-3');
    // fireworksGo();

    // 顯示重播
    replayEl.classList.add('is-show');

    // 設定重播點擊 (一次性)
    const onReplayClick = function () {
        soundWin2.fade(.6, 0, 1000);
        soundClick.play();

        replayEl.classList.remove('is-show');
        endTextEl.classList.remove('animate__animated', 'animate__pulse', 'animate__repeat-3');

        // 動畫：當前號碼向上移出，??? 向上移入。
        // 1. 取得當前內容
        const currentContent = slotResultEl.innerHTML;

        // 2. 設定重置動畫列表
        slotSingleList.innerHTML = `
            <li class="item">${currentContent}</li>
            <li class="item">???</li>
        `;
        slotSingleList.style.display = 'block';
        gsap.set(slotSingleList, { y: 0 });

        // 3. 測量高度 (現在可見)
        const itemHeight = slotSingleList.querySelector('.item') ? slotSingleList.querySelector('.item').offsetHeight : 298;

        // 4. 隱藏結果 (避免重複顯示)
        slotResultEl.innerHTML = '';

        // 5. 動畫
        gsap.to(slotSingleList, {
            y: -itemHeight,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                // 還原狀態
                slotResultEl.innerHTML = '<div class="empty">???</div>';
                slotSingleList.style.display = 'none';

                setTimeout(() => {
                    // fw.stop();
                    btnSingleGo.style.display = '';
                    btnSingleGo.classList.remove('disabled');
                    gsap.fromTo(btnSingleGo,
                        { scale: 0 },
                        { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
                    );
                }, 10);
            }
        });

        // 移除監聽器以防止在邏輯循環時多重綁定（雖然這裡我們只增加了一個）
        replayEl.removeEventListener('click', onReplayClick);
    };
    replayEl.addEventListener('click', onReplayClick);

    // 從資料中移除贏家
    slotData.splice(removeIndex, 1);
}


// GO 按鈕的事件監聽器
btnSingleGo.addEventListener('click', function (e) {
    e.preventDefault();
    this.classList.add('disabled');
    this.style.display = 'none';
    // fw.stop();
    soundClick.play();

    runSlotAnimation();
});


// =======================
// 自動測試按鈕
// =======================
const btnAutoTest = document.getElementById('btnAutoTest');
if (btnAutoTest) {
    btnAutoTest.addEventListener('click', (e) => {
        e.preventDefault();

        if (slotData.length === 0) {
            alert('已無剩餘號碼！');
            return;
        }

        if (confirm(`確定要自動抽出剩餘的 ${slotData.length} 組號碼嗎？`)) {
            // 持續抽獎直到清空
            while (slotData.length > 0) {
                const randomIndex = Math.floor(Math.random() * slotData.length);
                const winnerNum = slotData[randomIndex];

                // 直接存入歷史紀錄
                saveHistory(winnerNum);

                // 從池中移除（如同正常抽獎）
                slotData.splice(randomIndex, 1);
            }

            // 更新 UI/通知
            renderHistory();
            alert('測試抽獎完成！已抽出所有號碼。');

            // 應確認是否需要更新任何顯示或僅留空
            // 也許顯示最後抽出的號碼？或者僅重置？
            // 目前，我們只要確保「GO」按鈕在下次點擊時知道已空。
        }
    });
}


// =======================
// 控制按鈕
// =======================
const btnFullScreen = document.getElementById('btnFullScreen');
if (btnFullScreen) {
    btnFullScreen.addEventListener('click', function (e) {
        e.preventDefault();
        //soundClick.play();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            this.classList.add('--shrink');
            this.classList.remove('--expand');
        } else {
            this.classList.add('--expand');
            this.classList.remove('--shrink');
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
}


// =========================
// 歷史紀錄功能
// =========================
// 已移至頂部：historyKey, loadHistoryData, saveHistory

function clearHistory() {
    if (confirm('確定要清除所有紀錄嗎？')) {
        localStorage.removeItem(historyKey);
        renderHistory();
        initSlotData(); // 重置抽獎池
    }
}

function deleteHistoryItem(index) {
    const history = loadHistoryData();
    const item = history[index];
    if (confirm(`確定要刪除 ${item.num} 號的紀錄嗎？`)) {
        history.splice(index, 1);
        localStorage.setItem(historyKey, JSON.stringify(history));
        renderHistory();
        initSlotData(); // 更新抽獎池以包含刪除的項目
    }
}

function renderHistory() {
    const history = loadHistoryData();
    historyList.innerHTML = '';

    // 更新標題計數
    const titleEl = document.getElementById('historyTitle');
    if (titleEl) {
        // 根據使用者圖片假設最大值為 100，或者僅顯示計數。
        // 使用者圖片：(44 / 100)。100 可能是參與者總數或僅是一個限制。
        // 我將暫時顯示 (計數)，或 (計數 / 總數)，如果有總數的話。
        // 總插槽數 = 程式碼中的 totalSlotLength (fullArray)。
        const total = fullArray.length - exNum.length;
        titleEl.innerText = `抽獎紀錄 ( ${history.length} / ${total} )`;
    }

    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty-history">目前沒有抽獎紀錄</li>';
        return;
    }

    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.num}`;
        li.title = "點擊以刪除此紀錄";
        if (index === 0) {
            li.classList.add('latest');
        }
        li.addEventListener('click', () => deleteHistoryItem(index));
        historyList.appendChild(li);
    });
}

if (btnHistory) {
    btnHistory.addEventListener('click', (e) => {
        e.preventDefault();
        renderHistory();
        historyModal.classList.add('is-open');
    });
}

if (btnCloseHistory) {
    btnCloseHistory.addEventListener('click', () => {
        historyModal.classList.remove('is-open');
    });
}

if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
        clearHistory();
    });
}

// 點擊外部時關閉模態框
window.addEventListener('click', (e) => {
    if (e.target == historyModal) {
        historyModal.classList.remove('is-open');
    }
});