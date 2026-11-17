import {
  CheatsheetItem,
  CodingChallenge,
  LessonModule,
  PythonPreset,
} from '../types/python';

export const PLAYGROUND_PRESETS: PythonPreset[] = [
  {
    id: 'hello-fstring',
    title: '基本輸出與變數運算',
    category: '基礎語法',
    description: '使用 f-string 格式化輸出，並觀察右側的變數狀態檢視器。',
    code: `# 定義課程與學員基本資料
course_name = "Python 互動設計"
students = 42
completion_rate = 0.875

# 使用 f-string 進行高精度排版輸出
print(f"課程名稱：{course_name}")
print(f"修課人數：{students} 人")
print(f"平均完成率：{completion_rate:.1%}")

# 計算總完成人數
completed_count = round(students * completion_rate)
print(f"已完成人數：約 {completed_count} 人")`,
  },
  {
    id: 'fibonacci',
    title: '費氏數列生成器',
    category: '迴圈與函式',
    description: '透過函式與雙變數同步賦值，高效產生前 N 項費氏數列。',
    code: `def generate_fibonacci(n: int) -> list[int]:
    """產生前 n 項費氏數列"""
    sequence = []
    a, b = 0, 1
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

n_terms = 12
fib_numbers = generate_fibonacci(n_terms)
golden_ratio = fib_numbers[-1] / fib_numbers[-2]

print(f"前 {n_terms} 項費氏數列：{fib_numbers}")
print(f"相鄰兩項比值逼近黃金比例：{golden_ratio:.6f}")`,
  },
  {
    id: 'data-statistics',
    title: '成績統計與標準差分析',
    category: '資料分析',
    description: '結合內建 statistics 模組與推導式，快速分析測驗分數分佈。',
    code: `import statistics

scores = [78, 85, 92, 66, 88, 95, 73, 81, 90, 84]

mean_val = statistics.mean(scores)
median_val = statistics.median(scores)
stdev_val = statistics.stdev(scores)
above_avg = [s for s in scores if s >= mean_val]

print(f"樣本數：{len(scores)} 筆")
print(f"平均分數：{mean_val:.2f}")
print(f"中位數：{median_val:.1f}")
print(f"樣本標準差：{stdev_val:.2f}")
print(f"高於平均的成績：{sorted(above_avg, reverse=True)}")`,
  },
  {
    id: 'oop-bank',
    title: '物件導向：帳戶類別設計',
    category: '物件導向',
    description: '示範 class 建構子、方法封裝與格式化的字串表示法。',
    code: `class DigitalAccount:
    def __init__(self, owner: str, balance: int = 0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount: int) -> None:
        if amount <= 0:
            raise ValueError("存款金額必須大於零")
        self.balance += amount
        self.history.append(f"+{amount}")

    def withdraw(self, amount: int) -> bool:
        if amount > self.balance:
            print(f"[餘額不足] 無法提領 {amount} 元")
            return False
        self.balance -= amount
        self.history.append(f"-{amount}")
        return True

    def summary(self) -> str:
        return f"{self.owner} 帳戶餘額：{self.balance:,} 元"

account = DigitalAccount("林思妤", 5000)
account.deposit(2400)
account.withdraw(1250)
account.withdraw(9000)

print(account.summary())
print("交易紀錄：", " -> ".join(account.history))`,
  },
  {
    id: 'prime-sieve',
    title: '埃拉托斯特尼質數篩選法',
    category: '演算法',
    description: '在 O(n log log n) 時間內找出指定上限內的所有質數。',
    code: `def sieve_primes(limit: int) -> list[int]:
    if limit < 2:
        return []
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False

    p = 2
    while p * p <= limit:
        if is_prime[p]:
            for multiple in range(p * p, limit + 1, p):
                is_prime[multiple] = False
        p += 1

    return [num for num, prime in enumerate(is_prime) if prime]

upper_bound = 60
primes = sieve_primes(upper_bound)
print(f"小於等於 {upper_bound} 的質數共有 {len(primes)} 個：")
print(primes)`,
  },
  {
    id: 'stdin-greeting',
    title: '讀取標準輸入 (stdin)',
    category: '互動輸入',
    description: '示範透過右側「標準輸入」分頁提供 input() 測試資料。',
    stdin: '陳冠宇\n2026',
    code: `# 可在右側切換至「標準輸入 stdin」分頁修改測試輸入
user_name = input("請輸入姓名：")
target_year = int(input("請輸入目標年份："))

print(f"你好，{user_name}！")
print(f"歡迎在 {target_year} 年持續精進 Python 程式設計。")`,
  },
];

export const LESSON_MODULES: LessonModule[] = [
  {
    id: 'module-basics',
    indexLabel: '單元 01',
    title: '變數、型別與字串格式化',
    level: '初階入門',
    description: '掌握 Python 動態型別系統、數值運算精度，以及現代化的 f-string 文字排版語法。',
    lessons: [
      {
        id: 'lesson-1-1',
        title: '動態型別與核心資料型別',
        durationMinutes: 8,
        summary:
          'Python 的變數不需要事先宣告型別，值本身帶有型別資訊（int、float、str、bool）。使用 type() 可以隨時檢查物件型別。',
        conceptPoints: [
          '整數 (int) 支援任意精度大數運算，不會發生傳統溢位問題。',
          '單斜線 / 永遠回傳浮點數 (float)，雙斜線 // 執行無條件捨去整除。',
          '布林值 True 與 False 首字母必須大寫，且可直接參與數值加總（True 等同 1）。',
        ],
        syntaxNote: 'name = "Python"  |  version = 3.12  |  is_active = True',
        code: `language = "Python"
major_version = 3
pi_approx = 3.14159
is_interpreted = True

print("型別檢查：")
print(type(language), type(major_version), type(pi_approx), type(is_interpreted))

# 整除與餘數運算
total_minutes = 135
hours = total_minutes // 60
minutes = total_minutes % 60
print(f"{total_minutes} 分鐘等於 {hours} 小時 {minutes} 分鐘")`,
      },
      {
        id: 'lesson-1-2',
        title: 'f-string 字串插值與常用方法',
        durationMinutes: 10,
        summary:
          '字串在 Python 中是不可變 (immutable) 的序列。透過 f-string 能在大括號內直接嵌入運算式與數字對齊格式。',
        conceptPoints: [
          'f"{value:,.2f}" 可同時加上千分位逗號與小數點後兩位。',
          '.strip() 去除頭尾空白，.split() 依分隔符號拆解為串列。',
          '支援切片語法 text[start:end:step]，例如 text[::-1] 可快速反轉字串。',
        ],
        syntaxNote: 'f"{ratio:.1%}"  |  raw.strip().lower().split(",")',
        code: `raw_csv = "  Taipei, 24.5, Sunny  "
parts = [item.strip() for item in raw_csv.split(",")]

city, temp_str, weather = parts
temperature = float(temp_str)

print(f"城市：{city:<10} | 氣溫：{temperature:.1f}°C | 天氣：{weather}")
print(f"反轉城市名稱：{city[::-1]}")`,
      },
    ],
  },
  {
    id: 'module-control',
    indexLabel: '單元 02',
    title: '條件判斷與迴圈控制',
    level: '初階入門',
    description: '理解縮排語法區塊、邏輯運算短路求值，以及 for / while 迴圈與 enumerate 的優雅寫法。',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'if / elif / else 與鏈式比較',
        durationMinutes: 9,
        summary:
          'Python 強制使用 4 個空白縮排定義程式區塊，並允許像數學不等式一樣撰寫 60 <= score < 80 的鏈式比較。',
        conceptPoints: [
          '條件判斷順序應由嚴格到寬鬆，避免邏輯覆蓋錯誤。',
          '三元運算式 value = "及格" if score >= 60 else "待加強" 適合簡短賦值。',
          '空串列 []、空字串 ""、數字 0 與 None 在布林判斷中皆視為 False。',
        ],
        syntaxNote: 'if 80 <= score <= 100: ... elif score >= 60: ...',
        code: `def evaluate_grade(score: int) -> str:
    if not (0 <= score <= 100):
        return "無效分數"
    if score >= 90:
        return "優等 (A)"
    elif score >= 75:
        return "良好 (B)"
    elif score >= 60:
        return "及格 (C)"
    else:
        return "需補強 (D)"

for s in [95, 82, 60, 45]:
    print(f"分數 {s:>3} -> {evaluate_grade(s)}")`,
      },
      {
        id: 'lesson-2-2',
        title: 'for 迴圈、enumerate 與 zip 配對',
        durationMinutes: 12,
        summary:
          'Python 的 for 迴圈直接走訪序列元素。若同時需要索引編號或平行走訪多個序列，應優先使用 enumerate() 與 zip()。',
        conceptPoints: [
          'enumerate(items, start=1) 可同時取得 1 起始編號與元素值。',
          'zip(list_a, list_b) 將兩個序列成對組合，以較短者為準。',
          'break 立即跳出迴圈，continue 則跳過本次剩餘程式碼進入下一輪。',
        ],
        syntaxNote: 'for idx, (name, score) in enumerate(zip(names, scores), 1):',
        code: `tasks = ["資料清洗", "模型訓練", "交叉驗證", "產生報告"]
durations = [15, 45, 20, 10]

total_time = 0
for index, (task, mins) in enumerate(zip(tasks, durations), start=1):
    total_time += mins
    print(f"步驟 {index:02d}｜{task}（預計 {mins} 分鐘）")

print(f"總計預估工時：{total_time} 分鐘")`,
      },
    ],
  },
  {
    id: 'module-collections',
    indexLabel: '單元 03',
    title: '串列、字典與推導式',
    level: '核心進階',
    description: '善用 list、dict、set 選擇正確的資料結構，並以推導式 (Comprehension) 精簡資料轉換邏輯。',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'List Comprehension 串列推導式',
        durationMinutes: 11,
        summary:
          '串列推導式將「產生序列＋條件過濾」濃縮為高可讀性的單行運算式，執行效能通常優於手動 append()。',
        conceptPoints: [
          '基本語法：[轉換運算 for 項目 in 可疊代物件 if 過濾條件]。',
          '避免撰寫超過兩層的巢狀推導式，以維持團隊程式可讀性。',
          '將方括號改為大括號 {k: v ...} 即可建立字典推導式或集合推導式。',
        ],
        syntaxNote: 'evens_sq = [x ** 2 for x in range(10) if x % 2 == 0]',
        code: `prices = [120, 350, 80, 540, 210, 95]

# 篩選 200 元以上商品並計算九折優惠價
discounted = [round(p * 0.9) for p in prices if p >= 200]

# 建立商品價格標籤字典
labels = {f"Item-{i}": p for i, p in enumerate(prices, start=1)}

print("九折精選價：", discounted)
print("價格對照字典：", labels)`,
      },
      {
        id: 'lesson-3-2',
        title: '字典 (dict) 查找與安全存取',
        durationMinutes: 10,
        summary:
          '字典採用雜湊表實作，鍵值查找平均時間複雜度為 O(1)。使用 .get() 可避免鍵值不存在時觸發 KeyError。',
        conceptPoints: [
          'inventory.get("apple", 0) 在找不到鍵值時回傳預設值 0。',
          '自 Python 3.7 起，字典保證保留鍵值的插入順序。',
          '使用 .items() 同時取得鍵 (key) 與值 (value) 進行走訪。',
        ],
        syntaxNote: 'counts[word] = counts.get(word, 0) + 1',
        code: `logs = ["GET", "POST", "GET", "DELETE", "GET", "POST"]
method_counts = {}

for method in logs:
    method_counts[method] = method_counts.get(method, 0) + 1

for method, count in method_counts.items():
    print(f"{method:<8} 出現 {count} 次")

print("PUT 次數：", method_counts.get("PUT", 0))`,
      },
    ],
  },
  {
    id: 'module-functions',
    indexLabel: '單元 04',
    title: '函式設計與高階抽象',
    level: '核心進階',
    description: '設計具備型別註記、預設參數與不定長引數的模組化函式，理解 lambda 與高階排序。',
    lessons: [
      {
        id: 'lesson-4-1',
        title: '參數設計、型別註記與文件字串',
        durationMinutes: 12,
        summary:
          '良好的函式應具備明確的輸入/輸出型別提示與單一職責。切勿使用可變物件（如 []）作為函式預設參數。',
        conceptPoints: [
          '預設參數應採用不可變值（如 None、0、字串），可變預設值改於函式內部初始化。',
          '*args 收集多餘的位置引數為 tuple；**kwargs 收集關鍵字引數為 dict。',
          'sorted(items, key=lambda x: x["score"], reverse=True) 可彈性指定排序鍵值。',
        ],
        syntaxNote: 'def format_record(name: str, tags: list[str] | None = None):',
        code: `students = [
    {"name": "張家豪", "score": 88, "age": 21},
    {"name": "陳怡君", "score": 95, "age": 20},
    {"name": "林俊傑", "score": 88, "age": 19},
]

# 先依分數降冪，同分再依年齡升冪排序
ranked = sorted(students, key=lambda s: (-s["score"], s["age"]))

for rank, person in enumerate(ranked, start=1):
    print(f"第 {rank} 名：{person['name']}（{person['score']} 分 / {person['age']} 歲）")`,
      },
    ],
  },
  {
    id: 'module-oop-errors',
    indexLabel: '單元 05',
    title: '例外處理與物件導向設計',
    level: '工程實務',
    description: '運用 try / except / finally 建立強健的錯誤防線，並透過 dataclass 打造乾淨的資料模型。',
    lessons: [
      {
        id: 'lesson-5-1',
        title: '精準例外捕捉與 dataclass 模型',
        durationMinutes: 14,
        summary:
          '捕捉特定例外類型（如 ValueError、ZeroDivisionError）而非空白的 except，並利用 @dataclass 自動產生 __init__ 與 __repr__。',
        conceptPoints: [
          'try 區塊只放置可能發生錯誤的最精簡程式碼；else 僅在無例外時執行。',
          'finally 無論是否出錯皆會執行，適合釋放檔案或連線資源。',
          '@dataclass 裝飾器大幅減少重複的樣板初始化程式碼。',
        ],
        syntaxNote: 'try: ... except ValueError as err: ... finally: ...',
        code: `from dataclasses import dataclass

@dataclass
class OrderItem:
    sku: str
    unit_price: float
    quantity: int

    def subtotal(self) -> float:
        if self.quantity < 0:
            raise ValueError("數量不可為負數")
        return self.unit_price * self.quantity

orders = [
    OrderItem("PY-101", 490.0, 2),
    OrderItem("PY-204", 1200.0, -1),
]

for item in orders:
    try:
        total = item.subtotal()
        print(f"{item.sku} 小計：{total:,.0f} 元")
    except ValueError as exc:
        print(f"{item.sku} 資料異常：{exc}")`,
      },
    ],
  },
];

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'challenge-two-sum',
    title: '兩數之和 (Two Sum)',
    difficulty: '基礎入門',
    estimatedMinutes: 8,
    prompt:
      '給定一個整數串列 nums 與一個目標整數 target，請找出串列中和等於 target 的兩個不同元素，並回傳它們的索引值串列 [i, j]（依升冪排列）。假設每組測試資料只存在唯一解。',
    functionSignature: 'def two_sum(nums: list[int], target: int) -> list[int]:',
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # 在此撰寫你的解法（提示：可用字典記錄看過的數字與索引）
    pass`,
    hint: '建立一個字典 seen 記錄 {數值: 索引}。走訪 nums 時計算差值 target - num，若差值已存在於 seen 中，立即回傳 [seen[差值], 目前索引]。',
    solutionCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    testCases: [
      {
        id: 'ts-1',
        description: 'two_sum([2, 7, 11, 15], 9) 應回傳 [0, 1]',
        assertionCode: 'assert two_sum([2, 7, 11, 15], 9) == [0, 1]',
      },
      {
        id: 'ts-2',
        description: 'two_sum([3, 2, 4], 6) 應回傳 [1, 2]',
        assertionCode: 'assert two_sum([3, 2, 4], 6) == [1, 2]',
      },
      {
        id: 'ts-3',
        description: 'two_sum([3, 3], 6) 應回傳 [0, 1]',
        assertionCode: 'assert two_sum([3, 3], 6) == [0, 1]',
      },
    ],
  },
  {
    id: 'challenge-vowels',
    title: '統計英文字串母音數',
    difficulty: '基礎入門',
    estimatedMinutes: 5,
    prompt:
      '撰寫函式 count_vowels(text)，統計傳入字串中包含多少個英文字母母音（a, e, i, o, u），需同時包含大寫與小寫。',
    functionSignature: 'def count_vowels(text: str) -> int:',
    starterCode: `def count_vowels(text: str) -> int:
    # 請計算 text 中的母音總數（不分大小寫）
    pass`,
    hint: '可先使用 text.lower() 轉為小寫，再透過 sum(1 for ch in text.lower() if ch in "aeiou") 計算總數。',
    solutionCode: `def count_vowels(text: str) -> int:
    vowels = set("aeiouAEIOU")
    return sum(1 for ch in text if ch in vowels)`,
    testCases: [
      {
        id: 'vw-1',
        description: 'count_vowels("Python Programming") 應回傳 4',
        assertionCode: 'assert count_vowels("Python Programming") == 4',
      },
      {
        id: 'vw-2',
        description: 'count_vowels("AEIOUaeiou") 應回傳 10',
        assertionCode: 'assert count_vowels("AEIOUaeiou") == 10',
      },
      {
        id: 'vw-3',
        description: 'count_vowels("rhythms") 應回傳 0',
        assertionCode: 'assert count_vowels("rhythms") == 0',
      },
    ],
  },
  {
    id: 'challenge-dedup',
    title: '串列去重並維持原本順序',
    difficulty: '資料處理',
    estimatedMinutes: 7,
    prompt:
      '實作函式 unique_in_order(items)，移除串列中重複出現的元素，但必須嚴格保留每個元素第一次出現時的順序。',
    functionSignature: 'def unique_in_order(items: list) -> list:',
    starterCode: `def unique_in_order(items: list) -> list:
    # 請勿使用單純的 list(set(items))，因為 set 不保證順序一致
    pass`,
    hint: '搭配一個 seen 集合與一個 result 串列：只有當元素不在 seen 中時，才同時加入 result 與 seen。',
    solutionCode: `def unique_in_order(items: list) -> list:
    seen = set()
    result = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result`,
    testCases: [
      {
        id: 'dd-1',
        description: 'unique_in_order([3, 1, 3, 2, 1, 5]) 應回傳 [3, 1, 2, 5]',
        assertionCode: 'assert unique_in_order([3, 1, 3, 2, 1, 5]) == [3, 1, 2, 5]',
      },
      {
        id: 'dd-2',
        description: 'unique_in_order(["a", "b", "a", "c"]) 應回傳 ["a", "b", "c"]',
        assertionCode: 'assert unique_in_order(["a", "b", "a", "c"]) == ["a", "b", "c"]',
      },
      {
        id: 'dd-3',
        description: 'unique_in_order([]) 應回傳 []',
        assertionCode: 'assert unique_in_order([]) == []',
      },
    ],
  },
  {
    id: 'challenge-word-freq',
    title: '文字詞頻分析器',
    difficulty: '資料處理',
    estimatedMinutes: 10,
    prompt:
      '撰寫函式 word_frequency(sentence)，將英文句子依空白拆分為單字，統一轉為小寫並去除逗號與句號後，回傳每個單字出現次數的字典。',
    functionSignature: 'def word_frequency(sentence: str) -> dict[str, int]:',
    starterCode: `def word_frequency(sentence: str) -> dict[str, int]:
    # 提示：先轉小寫、取代 "," 與 "." 為空白或去除標點，再進行計數
    pass`,
    hint: '可使用 word.strip(".,").lower() 清理每個以 split() 拆出的單字，並跳過空字串後累計至字典。',
    solutionCode: `def word_frequency(sentence: str) -> dict[str, int]:
    counts = {}
    for raw in sentence.split():
        cleaned = raw.strip(".,").lower()
        if cleaned:
            counts[cleaned] = counts.get(cleaned, 0) + 1
    return counts`,
    testCases: [
      {
        id: 'wf-1',
        description: '正確統計重複單字與大小寫合併',
        assertionCode:
          'assert word_frequency("Code clean, code fast.") == {"code": 2, "clean": 1, "fast": 1}',
      },
      {
        id: 'wf-2',
        description: '空字串應回傳空字典 {}',
        assertionCode: 'assert word_frequency("") == {}',
      },
      {
        id: 'wf-3',
        description: '單一單字句點處理',
        assertionCode: 'assert word_frequency("Python.") == {"python": 1}',
      },
    ],
  },
  {
    id: 'challenge-fib-nth',
    title: '計算第 N 項費氏數列',
    difficulty: '邏輯演算法',
    estimatedMinutes: 8,
    prompt:
      '實作函式 fib(n)，回傳費氏數列的第 n 項（定義 fib(0) = 0, fib(1) = 1, fib(2) = 1, fib(3) = 2 ...）。請使用疊代法以確保 n=35 時仍能瞬間完成。',
    functionSignature: 'def fib(n: int) -> int:',
    starterCode: `def fib(n: int) -> int:
    # 請使用迴圈疊代計算，避免樸素遞迴造成的指數級運算時間
    pass`,
    hint: '處理 n <= 1 的邊界後，使用 a, b = 0, 1 迴圈更新 n - 1 次，最後回傳 b。',
    solutionCode: `def fib(n: int) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 1
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
    testCases: [
      {
        id: 'fb-1',
        description: 'fib(0) == 0 且 fib(1) == 1',
        assertionCode: 'assert fib(0) == 0 and fib(1) == 1',
      },
      {
        id: 'fb-2',
        description: 'fib(10) 應回傳 55',
        assertionCode: 'assert fib(10) == 55',
      },
      {
        id: 'fb-3',
        description: 'fib(30) 應回傳 832040',
        assertionCode: 'assert fib(30) == 832040',
      },
    ],
  },
  {
    id: 'challenge-safe-divide',
    title: '強健型安全除法函式',
    difficulty: '邏輯演算法',
    estimatedMinutes: 6,
    prompt:
      '實作函式 safe_divide(a, b)，執行 a / b 並四捨五入至小數點後兩位。若分母 b 為 0 或傳入非數值字串無法轉為浮點數時，請安全回傳 None 而不是拋出例外。',
    functionSignature: 'def safe_divide(a, b):',
    starterCode: `def safe_divide(a, b):
    # 使用 try / except 捕捉 ZeroDivisionError 與 ValueError / TypeError
    pass`,
    hint: '在 try 區塊中先 float(a) 與 float(b)，計算 round(num / den, 2)；於 except (ZeroDivisionError, ValueError, TypeError) 中回傳 None。',
    solutionCode: `def safe_divide(a, b):
    try:
        num = float(a)
        den = float(b)
        return round(num / den, 2)
    except (ZeroDivisionError, ValueError, TypeError):
        return None`,
    testCases: [
      {
        id: 'sd-1',
        description: 'safe_divide(10, 3) 應回傳 3.33',
        assertionCode: 'assert safe_divide(10, 3) == 3.33',
      },
      {
        id: 'sd-2',
        description: '除以零 safe_divide(10, 0) 應回傳 None',
        assertionCode: 'assert safe_divide(10, 0) is None',
      },
      {
        id: 'sd-3',
        description: '支援數字字串並擋下無效字串',
        assertionCode: 'assert safe_divide("9", "2") == 4.5 and safe_divide("abc", 2) is None',
      },
    ],
  },
];

export const CHEATSHEET_ITEMS: CheatsheetItem[] = [
  {
    id: 'cs-fstring',
    category: '基礎與型別',
    title: 'f-string 數字與寬度格式化',
    summary: '控制浮點數小數位數、百分比、千分位逗號與欄位對齊。',
    snippet: `price = 12450.678
ratio = 0.842
print(f"金額：{price:,.2f} 元")
print(f"達成率：{ratio:.1%}")
print(f"{'編號':<6} {'進度':>8}")
print(f"{'A-01':<6} {ratio:>8.0%}")`,
  },
  {
    id: 'cs-unpacking',
    category: '基礎與型別',
    title: '序列解包與星號收集',
    summary: '一次賦值多個變數，或使用 *rest 收集剩餘元素。',
    snippet: `record = ["王小明", 92, 88, 95]
name, *scores = record
first, *_, last = scores
print(f"{name} 成績：{scores}（首：{first}，尾：{last}）")`,
  },
  {
    id: 'cs-string-methods',
    category: '字串操作',
    title: '字串清理、拆分與合併',
    summary: '快速正規化文字輸入，並以特定分隔符號重新拼接。',
    snippet: `raw = "  Python | FastAPI | PyTorch  "
tags = [t.strip() for t in raw.split("|")]
print("拆解後：", tags)
print("合併後：", " / ".join(tags))`,
  },
  {
    id: 'cs-slice',
    category: '字串操作',
    title: '切片語法 [start:stop:step]',
    summary: '同時適用於字串與串列的範圍擷取、跳躍取值與反轉。',
    snippet: `text = "ABCDEFGHIJ"
print("前五碼：", text[:5])
print("後三碼：", text[-3:])
print("奇數位：", text[::2])
print("反轉：", text[::-1])`,
  },
  {
    id: 'cs-list-sort',
    category: '串列與字典',
    title: 'sorted() 自訂鍵值排序',
    summary: '不修改原串列回傳新排序結果，搭配 lambda 針對字典欄位排序。',
    snippet: `items = [
    {"name": "鍵盤", "price": 2800},
    {"name": "滑鼠", "price": 1250},
    {"name": "螢幕", "price": 8900},
]
ordered = sorted(items, key=lambda x: x["price"], reverse=True)
for item in ordered:
    print(item["name"], item["price"])`,
  },
  {
    id: 'cs-dict-merge',
    category: '串列與字典',
    title: '字典合併與安全預設值',
    summary: 'Python 3.9+ 支援 | 運算子合併字典，並以 .get() 防止 KeyError。',
    snippet: `defaults = {"theme": "light", "tab_size": 4}
user_cfg = {"tab_size": 2, "auto_save": True}
merged = defaults | user_cfg
print("最終設定：", merged)
print("字體大小：", merged.get("font_size", 14))`,
  },
  {
    id: 'cs-comprehension',
    category: '函式與推導式',
    title: '串列與字典推導式',
    summary: '簡潔地建立轉換後的新串列或鍵值映射字典。',
    snippet: `nums = [1, 2, 3, 4, 5, 6]
squares = [n ** 2 for n in nums if n % 2 == 0]
parity_map = {n: ("偶數" if n % 2 == 0 else "奇數") for n in nums}
print("偶數平方：", squares)
print("奇偶對照：", parity_map)`,
  },
  {
    id: 'cs-enumerate-zip',
    category: '內建工具',
    title: 'enumerate() 與 zip() 平行走訪',
    summary: '同時取得索引位置，或同步走訪多組對應長度的序列。',
    snippet: `cities = ["台北", "台中", "高雄"]
temps = [24, 27, 29]
for idx, (city, temp) in enumerate(zip(cities, temps), start=1):
    print(f"{idx}. {city}：{temp}°C")`,
  },
];
