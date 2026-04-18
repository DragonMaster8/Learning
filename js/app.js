/* ============================================================
   C# Learning Hub – Shared JavaScript
   ============================================================ */

// ── Mobile Navigation ──
function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    if (nav) nav.classList.toggle('open');
}
function closeMobileNav() {
    const nav = document.getElementById('mobileNav');
    if (nav) nav.classList.remove('open');
}

// ── Sidebar Toggle (Notes page) ──
function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('open');
}

// ── Back to Top ──
window.addEventListener('scroll', function () {
    var btn = document.getElementById('backTop');
    if (btn) btn.classList.toggle('visible', window.scrollY > 500);
});

// ── Sidebar Scrollspy (Notes page) ──
(function initScrollspy() {
    var secs = document.querySelectorAll('section[id], .hero[id], h3[id]');
    var links = document.querySelectorAll('.sidebar a');
    if (!secs.length || !links.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                links.forEach(function (l) { l.classList.remove('active'); });
                var a = document.querySelector('.sidebar a[href="#' + e.target.id + '"]');
                if (a) a.classList.add('active');
            }
        });
    }, { rootMargin: '-80px 0px -60% 0px' });

    secs.forEach(function (s) { observer.observe(s); });

    document.querySelectorAll('.sidebar a').forEach(function (a) {
        a.addEventListener('click', function () {
            var sb = document.getElementById('sidebar');
            if (sb) sb.classList.remove('open');
        });
    });
})();

// ── Close mobile nav on link click ──
document.querySelectorAll('#mobileNav a').forEach(function (a) {
    a.addEventListener('click', closeMobileNav);
});

// ── Close mobile nav when clicking overlay ──
var overlay = document.getElementById('mobileNav');
if (overlay) {
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeMobileNav();
    });
}

/* ============================================================
   QUIZ ENGINE
   ============================================================ */
var questions = [
    {q:"Who developed the C# programming language?",o:["Sun Microsystems","Apple","Microsoft","Google"],a:2,t:"Introduction",ex:"C# was developed by Microsoft, led by Anders Hejlsberg."},
    {q:"What is the latest version of C# mentioned in the notes?",o:["C# 10.0","C# 11.0","C# 12.0","C# 13.0"],a:2,t:"Introduction",ex:"C# 12.0 was released in November 2023 and is the latest version."},
    {q:"In which year was the first version of C# released?",o:["1998","2000","2002","2005"],a:2,t:"History",ex:"The first version of C# was released in 2002 alongside Visual Studio .NET."},
    {q:"Who is the creator of C#?",o:["James Gosling","Bjarne Stroustrup","Anders Hejlsberg","Dennis Ritchie"],a:2,t:"History",ex:"Anders Hejlsberg led the team at Microsoft that designed C#."},
    {q:"What does CLR stand for in .NET?",o:["Common Language Runtime","Core Language Runtime","Common Library Runtime","Central Language Resource"],a:0,t:".NET Framework",ex:"CLR stands for Common Language Runtime \u2014 the engine that executes .NET programs."},
    {q:"Which .NET component automatically frees unused memory?",o:["JIT Compiler","CLR","Garbage Collector","FCL"],a:2,t:".NET Framework",ex:"The Garbage Collector automatically detects and frees memory from objects no longer in use."},
    {q:"What does JIT stand for?",o:["Just-In-Time","Java Integrated Tool","Joint Intermediate Translator","Just-In-Transit"],a:0,t:".NET Framework",ex:"JIT (Just-In-Time) compiler converts CIL to native machine code at runtime."},
    {q:"What is CIL also known as?",o:["CLR","MSIL","FCL","GC"],a:1,t:".NET Framework",ex:"CIL (Common Intermediate Language) is also known as MSIL (Microsoft Intermediate Language)."},
    {q:"Code that runs inside the CLR is called:",o:["Native Code","Unmanaged Code","Managed Code","Source Code"],a:2,t:".NET Framework",ex:"Managed Code runs within the CLR and benefits from garbage collection and type safety."},
    {q:"How many programming languages does Visual Studio support?",o:["10+","20+","36+","50+"],a:2,t:"Visual Studio",ex:"Visual Studio supports 36+ programming languages."},
    {q:"Which of these is NOT a valid C# identifier?",o:["_myVar","@class","123abc","myVar2"],a:2,t:"Identifiers",ex:"Identifiers cannot start with a digit. '123abc' violates this rule."},
    {q:"How many keywords does C# have?",o:["52","64","78","92"],a:2,t:"Keywords",ex:"C# has a total of 78 reserved keywords."},
    {q:"Which is a valid way to declare a variable in C#?",o:["int 2x = 5;","int x = 5;","variable x = 5;","x := 5;"],a:1,t:"Variables",ex:"The correct syntax is: type name = value; Variable names can\u2019t start with digits."},
    {q:"What are fixed values written directly in code called?",o:["Variables","Constants","Literals","Identifiers"],a:2,t:"Literals",ex:"Literals are fixed values like 42, 'a', \"hello\", true that appear directly in code."},
    {q:"Which suffix is used for a float literal in C#?",o:["d","m","f","L"],a:2,t:"Data Types",ex:"Float literals require the 'f' suffix, e.g., 3.14f."},
    {q:"Which suffix is used for a decimal literal in C#?",o:["d","m","f","L"],a:1,t:"Data Types",ex:"Decimal literals require the 'm' suffix, e.g., 19.99m."},
    {q:"Which data type category stores a memory address instead of the actual value?",o:["Value Types","Reference Types","Pointer Types","Struct Types"],a:1,t:"Data Types",ex:"Reference Types store a memory address (reference) pointing to where the data lives."},
    {q:"<code>string</code> in C# is an alias for which class?",o:["System.Text","System.Char","System.String","System.Object"],a:2,t:"Strings",ex:"Both 'string' and 'String' are aliases for System.String."},
    {q:"What is the size of an int in C#?",o:["2 bytes","4 bytes","8 bytes","16 bytes"],a:1,t:"Data Types",ex:"An int in C# is 4 bytes (32 bits)."},
    {q:"Which operator is the ternary conditional operator?",o:["&&","||","? :","??"],a:2,t:"Operators",ex:"The ternary operator '? :' is shorthand for if-else: condition ? trueVal : falseVal."},
    {q:"What is the default value of the first enum member?",o:["-1","0","1","null"],a:1,t:"Enumerations",ex:"By default, the first enum member is assigned the value 0."},
    {q:"Which enum member has the value 3 in: <code>enum Color { Red, Green, Blue, Yellow }</code>?",o:["Red","Green","Blue","Yellow"],a:3,t:"Enumerations",ex:"Red=0, Green=1, Blue=2, Yellow=3. So Yellow has the value 3."},
    {q:"Which statement is used for multi-way branching in C#?",o:["if-else","switch","for","while"],a:1,t:"Switch",ex:"The switch statement provides efficient multi-way branching based on a value."},
    {q:"In a C# switch statement, what happens if you omit 'break'?",o:["It falls through silently","Compiler error","Nothing happens","Returns null"],a:1,t:"Switch",ex:"In C#, omitting 'break' in a switch case results in a compiler error (unlike C/C++)."},
    {q:"Which loop always executes its body at least once?",o:["for","while","do-while","foreach"],a:2,t:"Loops",ex:"The do-while loop checks the condition after the body, so it runs at least once."},
    {q:"The foreach loop is used to iterate over:",o:["A fixed count","A boolean condition","Elements in a collection","Pointer addresses"],a:2,t:"Loops",ex:"foreach iterates over each element in a collection or array."},
    {q:"In a for loop, how many times does the initialization part execute?",o:["Every iteration","Twice","Once","Never"],a:2,t:"Loops",ex:"The initialization part runs exactly once when the loop starts."},
    {q:"What does the 'break' statement do inside a loop?",o:["Skips current iteration","Terminates the loop","Restarts the loop","Pauses the loop"],a:1,t:"Jump Statements",ex:"'break' immediately exits the loop it's inside."},
    {q:"What does the 'continue' statement do?",o:["Exits the loop","Skips to the next iteration","Restarts from beginning","Terminates the program"],a:1,t:"Jump Statements",ex:"'continue' skips the remaining code in the current iteration and moves to the next."},
    {q:"What is the index of the first element in a C# array?",o:["0","1","-1","Depends on declaration"],a:0,t:"Arrays",ex:"C# arrays are zero-indexed \u2014 the first element is at index 0."},
    {q:"Are C# strings mutable or immutable?",o:["Mutable","Immutable","Depends on the string","Neither"],a:1,t:"Strings",ex:"Strings in C# are immutable. Any modification creates a new string object."},
    {q:"Which access modifier makes a member visible only within the same class?",o:["public","internal","protected","private"],a:3,t:"Access Modifiers",ex:"'private' restricts access to only the containing class."},
    {q:"Which access modifier allows access from anywhere in the program?",o:["private","protected","internal","public"],a:3,t:"Access Modifiers",ex:"'public' members can be accessed from anywhere."},
    {q:"A class is best described as:",o:["An instance of an object","A blueprint for objects","A type of variable","A method"],a:1,t:"OOP",ex:"A class is a blueprint (template) from which objects are created."},
    {q:"What keyword is used to create a new object in C#?",o:["create","make","new","init"],a:2,t:"OOP",ex:"The 'new' keyword allocates memory and creates a new instance of a class."},
    {q:"A constructor in C# has the same name as the:",o:["Namespace","Method","Variable","Class"],a:3,t:"Constructors",ex:"A constructor must have the same name as the class it belongs to."},
    {q:"What symbol is used to define a destructor?",o:["#","!","~","@"],a:2,t:"Destructors",ex:"Destructors use a tilde (~) before the class name: ~ClassName()."},
    {q:"Which symbol denotes inheritance in C#?",o:["->","::","=>",":"],a:3,t:"Inheritance",ex:"In C#, a colon (:) is used: class Child : Parent { }"},
    {q:"Encapsulation is primarily achieved through:",o:["Inheritance","Interfaces","Access modifiers & properties","Polymorphism"],a:2,t:"Encapsulation",ex:"Encapsulation uses private fields + public properties (get/set) for controlled access."},
    {q:"What type of polymorphism does method overloading represent?",o:["Run-time","Compile-time","Both","Neither"],a:1,t:"Polymorphism",ex:"Method overloading is resolved at compile time (static polymorphism)."},
    {q:"What type of polymorphism does method overriding represent?",o:["Compile-time","Run-time","Both","Neither"],a:1,t:"Polymorphism",ex:"Method overriding is resolved at runtime (dynamic polymorphism)."},
    {q:"Which keyword marks a base class method as overridable?",o:["abstract","override","new","virtual"],a:3,t:"Methods",ex:"'virtual' in the base class allows derived classes to override."},
    {q:"Method hiding in C# uses which keyword?",o:["override","virtual","new","base"],a:2,t:"Methods",ex:"The 'new' keyword hides the base class method (method shadowing)."},
    {q:"An ArrayList in C# is:",o:["Fixed-size array","Dynamic array","Linked list","Binary tree"],a:1,t:"Collections",ex:"ArrayList is a dynamic array whose size adjusts automatically."},
    {q:"Which collection follows LIFO order?",o:["Queue","ArrayList","Stack","Hashtable"],a:2,t:"Collections",ex:"Stack follows LIFO \u2014 last in, first out."},
    {q:"Which collection follows FIFO order?",o:["Stack","Queue","ArrayList","Hashtable"],a:1,t:"Collections",ex:"Queue follows FIFO \u2014 first in, first out."},
    {q:"In a Hashtable, can the key be null?",o:["Yes","No","Only if value is not null","Only for string keys"],a:1,t:"Collections",ex:"Keys cannot be null in a Hashtable, but values can be."},
    {q:"C# Properties use which accessors?",o:["read and write","input and output","get and set","open and close"],a:2,t:"Properties",ex:"Properties use 'get' (read) and 'set' (write) accessors."},
    {q:"An indexer in C# uses which keyword?",o:["index","this","self","item"],a:1,t:"Indexers",ex:"Indexers use the 'this' keyword: public string this[int i] { get; set; }"},
    {q:"An interface in C# can contain:",o:["Fields","Constructors","Method declarations","Private members"],a:2,t:"Interfaces",ex:"Interfaces contain method declarations but not fields, constructors, or private members."},
    {q:"The Thread class belongs to which namespace?",o:["System.Collections","System.Threading","System.IO","System.Net"],a:1,t:"Multithreading",ex:"The Thread class is in System.Threading."},
    {q:"In exception handling, which block always executes?",o:["try","catch","finally","throw"],a:2,t:"Exceptions",ex:"The 'finally' block runs regardless of whether an exception occurred."},
    {q:"Which exception is thrown for an invalid array index?",o:["NullReferenceException","DivideByZeroException","IndexOutOfRangeException","OverflowException"],a:2,t:"Exceptions",ex:"IndexOutOfRangeException is thrown for accessing a non-existent array index."}
];

var timerInterval, timeLeft, userAnswers, quizSubmitted;

function startQuiz() {
    var startEl = document.getElementById('quiz-start');
    var activeEl = document.getElementById('quiz-active');
    var resultEl = document.getElementById('quiz-result');
    if (startEl) startEl.style.display = 'none';
    if (activeEl) activeEl.style.display = 'block';
    if (resultEl) resultEl.style.display = 'none';

    var headerEl = document.getElementById('quiz-header');
    var progEl = document.querySelector('.progress-bar-bg');
    if (headerEl) headerEl.style.display = '';
    if (progEl) progEl.style.display = '';

    quizSubmitted = false;
    userAnswers = new Array(questions.length).fill(-1);
    timeLeft = 30 * 60;
    updateTimer();
    timerInterval = setInterval(function () {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) { clearInterval(timerInterval); submitQuiz(); }
    }, 1000);
    renderQuestions();
    updateProgress();
}

function updateTimer() {
    var m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    var s = String(timeLeft % 60).padStart(2, '0');
    var display = document.getElementById('timerDisplay');
    if (display) display.textContent = m + ':' + s;
    var el = document.getElementById('quizTimer');
    if (!el) return;
    el.className = 'quiz-timer';
    if (timeLeft <= 120) el.classList.add('danger');
    else if (timeLeft <= 300) el.classList.add('warning');
}

function renderQuestions() {
    var c = document.getElementById('quiz-questions');
    if (!c) return;
    var html = '';
    var letters = ['A','B','C','D'];
    questions.forEach(function (q, i) {
        html += '<div class="q-card" id="qcard-' + i + '">';
        html += '<div class="q-num">Question ' + (i+1) + ' of ' + questions.length + '<span class="q-topic">' + q.t + '</span></div>';
        html += '<div class="q-text">' + q.q + '</div>';
        html += '<div class="q-options">';
        q.o.forEach(function (opt, j) {
            html += '<div class="q-opt" data-q="' + i + '" data-o="' + j + '" onclick="selectAnswer(' + i + ',' + j + ')">';
            html += '<div class="q-opt-letter">' + letters[j] + '</div>';
            html += '<div class="q-opt-text">' + opt + '</div></div>';
        });
        html += '</div>';
        html += '<div class="q-explanation" id="exp-' + i + '">' + q.ex + '</div>';
        html += '</div>';
    });
    c.innerHTML = html;
}

function selectAnswer(qi, oi) {
    if (quizSubmitted) return;
    userAnswers[qi] = oi;
    document.querySelectorAll('.q-opt[data-q="' + qi + '"]').forEach(function (el) { el.classList.remove('selected'); });
    var sel = document.querySelector('.q-opt[data-q="' + qi + '"][data-o="' + oi + '"]');
    if (sel) sel.classList.add('selected');
    updateProgress();
}

function updateProgress() {
    var answered = userAnswers.filter(function (a) { return a !== -1; }).length;
    var countEl = document.getElementById('answeredCount');
    if (countEl) countEl.textContent = answered;
    var bar = document.getElementById('quizProgress');
    if (bar) bar.style.width = (answered / questions.length * 100) + '%';
}

function submitQuiz() {
    if (quizSubmitted) return;
    var answered = userAnswers.filter(function (a) { return a !== -1; }).length;
    if (answered < questions.length && timeLeft > 0) {
        if (!confirm('You have ' + (questions.length - answered) + ' unanswered questions. Submit anyway?')) return;
    }
    clearInterval(timerInterval);
    quizSubmitted = true;

    var correct = 0, wrong = 0, skipped = 0;
    questions.forEach(function (q, i) {
        var opts = document.querySelectorAll('.q-opt[data-q="' + i + '"]');
        opts.forEach(function (el) { el.style.cursor = 'default'; });
        if (userAnswers[i] === -1) skipped++;
        else if (userAnswers[i] === q.a) correct++;
        else wrong++;
        opts[q.a].classList.add('correct');
        if (userAnswers[i] !== -1 && userAnswers[i] !== q.a) opts[userAnswers[i]].classList.add('wrong');
        var expEl = document.getElementById('exp-' + i);
        if (expEl) expEl.classList.add('show');
    });

    var pct = Math.round((correct / questions.length) * 100);
    var elapsed = 30 * 60 - timeLeft;
    var em = String(Math.floor(elapsed / 60)).padStart(2, '0');
    var es = String(elapsed % 60).padStart(2, '0');

    var grade, msg;
    if (pct >= 90) { grade = 'excellent'; msg = 'Outstanding!'; }
    else if (pct >= 70) { grade = 'good'; msg = 'Great Job!'; }
    else if (pct >= 50) { grade = 'average'; msg = 'Good Effort!'; }
    else { grade = 'poor'; msg = 'Keep Practicing!'; }

    var rHtml = '<div class="quiz-result">' +
        '<div class="score-circle ' + grade + '">' + pct + '%<div class="pct">' + correct + '/' + questions.length + '</div></div>' +
        '<div class="result-msg">' + msg + '</div>' +
        '<div class="result-sub">Scroll down to review your answers and learn from mistakes.</div>' +
        '<div class="result-stats">' +
        '<div class="result-stat c-stat"><div class="val">' + correct + '</div><div class="lbl">Correct</div></div>' +
        '<div class="result-stat w-stat"><div class="val">' + wrong + '</div><div class="lbl">Wrong</div></div>' +
        '<div class="result-stat s-stat"><div class="val">' + skipped + '</div><div class="lbl">Skipped</div></div>' +
        '<div class="result-stat t-stat"><div class="val">' + em + ':' + es + '</div><div class="lbl">Time</div></div>' +
        '</div>' +
        '<a class="btn btn-primary" href="quiz.html" style="margin-right:8px;">Retake Test</a>' +
        '<a class="btn btn-outline" href="notes.html">Review Notes</a></div>';

    var resultEl = document.getElementById('quiz-result');
    if (resultEl) { resultEl.innerHTML = rHtml; resultEl.style.display = 'block'; }
    var headerEl = document.getElementById('quiz-header');
    if (headerEl) headerEl.style.display = 'none';
    var progEl = document.querySelector('.progress-bar-bg');
    if (progEl) progEl.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
