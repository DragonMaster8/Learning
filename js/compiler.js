/* ============================================================
   Online Compiler - Judge0 CE Integration
   Free code execution API, no API key required
   Supports Python, Java, C#, JavaScript, C++, Go, Rust, etc.
   ============================================================ */

var JUDGE0_URL = 'https://ce.judge0.com/submissions?base64_encoded=false&wait=true';

var LANGUAGES = [
    { id: 'python',     name: 'Python 3.13',    judge0Id: 109 },
    { id: 'java',       name: 'Java 17',        judge0Id: 91  },
    { id: 'csharp',     name: 'C# (Mono)',      judge0Id: 51  },
    { id: 'javascript', name: 'JavaScript',      judge0Id: 102 },
    { id: 'cpp',        name: 'C++ (GCC 14)',   judge0Id: 105 },
    { id: 'c',          name: 'C (GCC 14)',     judge0Id: 103 },
    { id: 'go',         name: 'Go 1.23',        judge0Id: 107 },
    { id: 'rust',       name: 'Rust 1.85',      judge0Id: 108 },
    { id: 'typescript', name: 'TypeScript 5.6',  judge0Id: 101 },
    { id: 'ruby',       name: 'Ruby 2.7',       judge0Id: 72  },
    { id: 'php',        name: 'PHP 8.3',        judge0Id: 98  },
    { id: 'swift',      name: 'Swift 5.2',      judge0Id: 83  },
    { id: 'kotlin',     name: 'Kotlin 2.1',     judge0Id: 111 },
    { id: 'scala',      name: 'Scala 3.4',      judge0Id: 112 },
    { id: 'bash',       name: 'Bash 5.0',       judge0Id: 46  },
    { id: 'r',          name: 'R 4.4',          judge0Id: 99  }
];

var TEMPLATES = {
    python:     'print("Hello, World!")\n',
    java:       'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
    csharp:     'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}\n',
    javascript: 'console.log("Hello, World!");\n',
    cpp:        '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n',
    c:          '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
    go:         'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n',
    rust:       'fn main() {\n    println!("Hello, World!");\n}\n',
    typescript: 'const greeting: string = "Hello, World!";\nconsole.log(greeting);\n',
    ruby:       'puts "Hello, World!"\n',
    php:        '<?php\necho "Hello, World!\\n";\n',
    swift:      'print("Hello, World!")\n',
    kotlin:     'fun main() {\n    println("Hello, World!")\n}\n',
    scala:      'object Main extends App {\n    println("Hello, World!")\n}\n',
    bash:       'echo "Hello, World!"\n',
    r:          'cat("Hello, World!\\n")\n'
};

function initCompiler() {
    var select = document.getElementById('langSelect');
    if (!select) return;

    LANGUAGES.forEach(function (lang) {
        var opt = document.createElement('option');
        opt.value = lang.id;
        opt.textContent = lang.name;
        select.appendChild(opt);
    });

    select.addEventListener('change', function () {
        var editor = document.getElementById('codeEditor');
        if (editor && TEMPLATES[select.value]) {
            editor.value = TEMPLATES[select.value];
        }
        updateLangInfo();
    });

    var editor = document.getElementById('codeEditor');
    if (editor) {
        editor.value = TEMPLATES[select.value] || '';
        editor.addEventListener('keydown', handleTab);
    }
    updateLangInfo();
}

function handleTab(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
    }
}

function updateLangInfo() {
    var select = document.getElementById('langSelect');
    var info = document.getElementById('langInfo');
    if (!select || !info) return;
    var lang = LANGUAGES.find(function (l) { return l.id === select.value; });
    info.textContent = lang ? lang.name : '';
}

async function runCode() {
    var select = document.getElementById('langSelect');
    var editor = document.getElementById('codeEditor');
    var output = document.getElementById('compilerOutput');
    var runBtn = document.getElementById('runBtn');
    var status = document.getElementById('runStatus');
    if (!select || !editor || !output) return;

    var langId = select.value;
    var lang = LANGUAGES.find(function (l) { return l.id === langId; });
    if (!lang) return;

    output.textContent = '';
    output.className = 'compiler-output';
    if (runBtn) runBtn.disabled = true;
    if (status) status.innerHTML = '<span class="spinner"></span> Running...';

    var startTime = Date.now();

    try {
        var res = await fetch(JUDGE0_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                source_code: editor.value,
                language_id: lang.judge0Id
            })
        });

        if (!res.ok) throw new Error('API returned ' + res.status);

        var data = await res.json();
        var elapsed = Date.now() - startTime;

        var stdout = (data.stdout || '').trim();
        var stderr = (data.stderr || '').trim();
        var compileOut = (data.compile_output || '').trim();
        var statusDesc = data.status ? data.status.description : '';
        var statusId = data.status ? data.status.id : 0;

        // Status IDs: 3 = Accepted, 5 = Time Limit, 6 = Compilation Error, 11 = Runtime Error
        if (statusId === 6) {
            output.textContent = compileOut || stderr || 'Compilation error.';
            output.className = 'compiler-output has-error';
            if (status) status.textContent = 'Compilation Error (' + elapsed + 'ms)';
        } else if (statusId === 5) {
            output.textContent = 'Time Limit Exceeded' + (stdout ? '\n\nPartial output:\n' + stdout : '');
            output.className = 'compiler-output has-error';
            if (status) status.textContent = 'Time Limit Exceeded (' + elapsed + 'ms)';
        } else if (statusId >= 7 && statusId <= 12) {
            output.textContent = stderr || compileOut || statusDesc;
            output.className = 'compiler-output has-error';
            if (status) status.textContent = statusDesc + ' (' + elapsed + 'ms)';
        } else if (statusId === 3) {
            if (stdout) {
                output.textContent = stdout + (stderr ? '\n\n[stderr]\n' + stderr : '');
                output.className = 'compiler-output has-output';
            } else {
                output.textContent = '(no output)';
                output.className = 'compiler-output';
            }
            var timeInfo = data.time ? ' | ' + data.time + 's' : '';
            var memInfo = data.memory ? ' | ' + (data.memory / 1024).toFixed(1) + ' MB' : '';
            if (status) status.textContent = 'Completed in ' + elapsed + 'ms' + timeInfo + memInfo;
        } else {
            output.textContent = stdout || stderr || compileOut || statusDesc || 'Unexpected status.';
            output.className = stdout ? 'compiler-output has-output' : 'compiler-output has-error';
            if (status) status.textContent = (statusDesc || 'Done') + ' (' + elapsed + 'ms)';
        }
    } catch (e) {
        output.textContent = 'Error: ' + e.message + '\n\nMake sure you have an internet connection.';
        output.className = 'compiler-output has-error';
        if (status) status.textContent = 'Request failed';
    }

    if (runBtn) runBtn.disabled = false;
}

function clearEditor() {
    var editor = document.getElementById('codeEditor');
    var output = document.getElementById('compilerOutput');
    var status = document.getElementById('runStatus');
    if (editor) editor.value = '';
    if (output) { output.textContent = ''; output.className = 'compiler-output'; }
    if (status) status.textContent = '';
    if (editor) editor.focus();
}

document.addEventListener('DOMContentLoaded', initCompiler);
