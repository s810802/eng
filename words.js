const WORD_DATABASE = {
    2: [
        "go", "to", "do", "in", "on", "at", "it", "is", "he", "me",
        "my", "we", "up", "so", "no", "an", "by", "if", "or", "am",
        "us", "be", "as", "hi", "ox", "ax", "oh", "ok"
    ],
    3: [
        "cat", "dog", "run", "fly", "sky", "sun", "car", "bus", "boy", "red",
        "fox", "box", "cup", "bad", "map", "big", "hot", "key", "ice", "egg",
        "sea", "pie", "tea", "jam", "day", "way", "joy", "win", "out", "new",
        "old", "dry", "wet", "cry", "try", "use", "get", "fit", "hat", "pen",
        "air", "art", "owl", "bat", "bee", "cow", "pig", "raw", "row", "end"
    ],
    4: [
        "blue", "tree", "fire", "wind", "star", "moon", "fish", "bird", "ship", "book",
        "door", "game", "play", "jump", "walk", "swim", "sing", "song", "word", "type",
        "hero", "dark", "neon", "glow", "cool", "warm", "cold", "fast", "slow", "hard",
        "easy", "road", "wave", "lake", "sand", "rock", "gold", "iron", "time", "life",
        "code", "data", "byte", "loop", "grid", "wire", "link", "disk", "hack", "dust"
    ],
    5: [
        "space", "laser", "shoot", "alien", "cyber", "storm", "cloud", "world", "earth", "water",
        "green", "black", "white", "light", "speed", "power", "pixel", "sound", "music", "score",
        "level", "enemy", "crash", "shift", "enter", "input", "point", "clock", "heart", "brain",
        "dream", "night", "flame", "stone", "metal", "robot", "orbit", "comet", "solar", "pulse",
        "sonar", "radar", "shack", "synth", "drive", "flash", "glitch", "ghost", "alpha", "omega"
    ],
    6: [
        "galaxy", "rocket", "shield", "matrix", "photon", "typing", "system", "vector", "bullet", "target",
        "attack", "damage", "meteor", "nebula", "portal", "cursor", "screen", "future", "planet", "energy",
        "plasma", "crypto", "engine", "hazard", "beacon", "sensor", "flight", "runner", "shadow", "spirit",
        "cosmic", "module", "device", "memory", "signal", "binary", "source", "arcade", "impact", "quasar"
    ],
    7: [
        "universe", "cyberpunk", "defender", "invaders", "missiles", "blaster", "tactical", "terminal",
        "software", "hardware", "spectrum", "asteroid", "gravity", "vortex", "station", "control",
        "command", "scanner", "physics", "victory", "quantum", "phoenix", "voltage", "network", "console",
        "program", "monitor", "decoder", "defense", "horizon", "gravity", "nebulae", "warpzone"
    ],
    8: [
        "computer", "keyboard", "antigravity", "interstellar", "constellation", "supernova", "hologram",
        "generator", "nanotech", "algorithm", "developer", "championship", "controller", "projectile",
        "atmosphere", "cybernetics", "spacecraft", "artificial", "simulation", "distortion", "mainframe",
        "cybernetic", "wavelength", "encryption", "javascript", "nanotechnology", "multiverse"
    ]
};

// Traditional Chinese Translation Database
const WORD_TRANSLATIONS = {
    // 2 letters
    "go": "去", "to": "到", "do": "做", "in": "在...裡面", "on": "在...上面", "at": "在", "it": "它", "is": "是", "he": "他", "me": "我",
    "my": "我的", "we": "我們", "up": "向上", "so": "所以", "no": "不", "an": "一個", "by": "經由", "if": "如果", "or": "或者", "am": "是",
    "us": "我們", "be": "是", "as": "如同", "hi": "嗨", "ox": "公牛", "ax": "斧頭", "oh": "噢", "ok": "好",
    // 3 letters
    "cat": "貓", "dog": "狗", "run": "跑", "fly": "飛", "sky": "天空", "sun": "太陽", "car": "汽車", "bus": "公車", "boy": "男孩", "red": "紅色",
    "fox": "狐狸", "box": "箱子", "cup": "杯子", "bad": "壞的", "map": "地圖", "big": "大的", "hot": "熱的", "key": "鑰匙", "ice": "冰", "egg": "蛋",
    "sea": "海洋", "pie": "派", "tea": "茶", "jam": "果醬", "day": "一天", "way": "方法", "joy": "歡樂", "win": "贏", "out": "外面", "new": "新的",
    "old": "老的", "dry": "乾的", "wet": "濕的", "cry": "哭", "try": "嘗試", "use": "使用", "get": "得到", "fit": "適合", "hat": "帽子", "pen": "鋼筆",
    "air": "空氣", "art": "藝術", "owl": "貓頭鷹", "bat": "蝙蝠", "bee": "蜜蜂", "cow": "母牛", "pig": "豬", "raw": "生的", "row": "排", "end": "結束",
    // 4 letters
    "blue": "藍色", "tree": "樹木", "fire": "火", "wind": "風", "star": "星星", "moon": "月亮", "fish": "魚", "bird": "鳥", "ship": "船", "book": "書",
    "door": "門", "game": "遊戲", "play": "玩", "jump": "跳", "walk": "走路", "swim": "游泳", "sing": "唱歌", "song": "歌曲", "word": "單字", "type": "打字",
    "hero": "英雄", "dark": "黑暗", "neon": "霓虹", "glow": "發光", "cool": "酷的", "warm": "溫暖", "cold": "寒冷", "fast": "快速", "slow": "緩慢", "hard": "困難",
    "easy": "簡單", "road": "道路", "wave": "波浪", "lake": "湖泊", "sand": "沙子", "rock": "岩石", "gold": "黃金", "iron": "鐵", "time": "時間", "life": "生命",
    "code": "程式碼", "data": "資料", "byte": "位元組", "loop": "迴圈", "grid": "網格", "wire": "電線", "link": "連結", "disk": "磁碟", "hack": "駭客", "dust": "灰塵",
    // 5 letters
    "space": "太空", "laser": "雷射", "shoot": "射擊", "alien": "外星人", "cyber": "網路", "storm": "風暴", "cloud": "雲朵", "world": "世界", "earth": "地球", "water": "水",
    "green": "綠色", "black": "黑色", "white": "白色", "light": "光線", "speed": "速度", "power": "能量", "pixel": "畫素", "sound": "聲音", "music": "音樂", "score": "分數",
    "level": "等級", "enemy": "敵人", "crash": "碰撞", "shift": "移動", "enter": "進入", "input": "輸入", "point": "點數", "clock": "時鐘", "heart": "心臟", "brain": "大腦",
    "dream": "夢想", "night": "夜晚", "flame": "火焰", "stone": "石頭", "metal": "金屬", "robot": "機器人", "orbit": "軌道", "comet": "彗星", "solar": "太陽的", "pulse": "脈搏",
    "sonar": "聲納", "radar": "雷達", "shack": "小屋", "synth": "合成器", "drive": "驅動", "flash": "閃光", "glitch": "故障", "ghost": "幽靈", "alpha": "阿爾法", "omega": "奧米加",
    // 6 letters
    "galaxy": "星系", "rocket": "火箭", "shield": "護盾", "matrix": "矩陣", "photon": "光子", "typing": "打字", "system": "系統", "vector": "向量", "bullet": "子彈", "target": "目標",
    "attack": "攻擊", "damage": "傷害", "meteor": "流星", "nebula": "星雲", "portal": "傳送門", "cursor": "游標", "screen": "螢幕", "future": "未來", "planet": "行星", "energy": "能量",
    "plasma": "電漿", "crypto": "加密", "engine": "引擎", "hazard": "危險", "beacon": "信標", "sensor": "感測器", "flight": "飛行", "runner": "跑者", "shadow": "影子", "spirit": "靈魂",
    "cosmic": "宇宙的", "module": "模組", "device": "裝置", "memory": "記憶體", "signal": "訊號", "binary": "二進位", "source": "來源", "arcade": "街機", "impact": "衝擊", "quasar": "類星體",
    // 7 letters
    "universe": "宇宙", "cyberpunk": "賽博龐克", "defender": "防衛者", "invaders": "入侵者", "missiles": "飛彈", "blaster": "爆能槍", "tactical": "戰術的", "terminal": "終端機",
    "software": "軟體", "hardware": "硬體", "spectrum": "光譜", "asteroid": "小行星", "gravity": "重力", "vortex": "漩渦", "station": "太空站", "control": "控制",
    "command": "指令", "scanner": "掃描器", "physics": "物理學", "victory": "勝利", "quantum": "量子", "phoenix": "鳳凰", "voltage": "電壓", "network": "網路", "console": "主控台",
    "program": "程式", "monitor": "監視器", "decoder": "解碼器", "defense": "防禦", "horizon": "地平線", "nebulae": "星雲群", "warpzone": "傳送區",
    // 8 letters
    "computer": "電腦", "keyboard": "鍵盤", "antigravity": "反重力", "interstellar": "星際的", "constellation": "星座", "supernova": "超新星", "hologram": "全息圖",
    "generator": "產生器", "nanotech": "奈米科技", "algorithm": "演算法", "developer": "開發者", "championship": "錦標賽", "controller": "控制器", "projectile": "拋射物",
    "atmosphere": "大氣層", "cybernetics": "控制論", "spacecraft": "太空船", "artificial": "人造的", "simulation": "模擬", "distortion": "扭曲", "mainframe": "主機",
    "cybernetic": "控制論的", "wavelength": "波長", "encryption": "加密", "javascript": "程式語言", "nanotechnology": "奈米科技", "multiverse": "多重宇宙"
};

// Function to get a random word based on level
function getRandomWordForLevel(level) {
    let allowedLengths = [2, 3]; // Default level 1
    
    if (level === 2) {
        allowedLengths = [3, 4];
    } else if (level === 3) {
        allowedLengths = [4, 5];
    } else if (level === 4) {
        allowedLengths = [5, 6];
    } else if (level === 5) {
        allowedLengths = [6, 7];
    } else if (level >= 6) {
        allowedLengths = [7, 8];
    }
    
    // Choose a random length from allowed lengths
    const chosenLength = allowedLengths[Math.floor(Math.random() * allowedLengths.length)];
    const wordList = WORD_DATABASE[chosenLength] || WORD_DATABASE[3];
    
    return wordList[Math.floor(Math.random() * wordList.length)];
}

// Translation lookup helper
function getTranslationForWord(word) {
    return WORD_TRANSLATIONS[word.toLowerCase()] || "";
}
