let socket = io();
let lastCursorPosition;
const onlineCounter = document.querySelector(".online__table");
const langPanel = document.querySelector("#inputLang")
langPanel.addEventListener("change", event => socket.emit("change lang", changeMode(+event.target.value)))
let mode = "javascript"
const editor = CodeMirror.fromTextArea(document.querySelector("#code"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    scrollbarStyle: "overlay",
    extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Tab": function(cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
        }
    },
    hintOptions: {
        hint: CodeMirror.hint.anyword
    },
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: true,
    mode
})
editor.on("change", (instance, changes) => {
    lastCursorPosition = changes.to;

        if (changes.origin !== "setValue") {
        socket.emit("chat message", instance.getValue())
    }
})
socket.on("change online", val => {
    onlineCounter.innerText = "Online: " +  val
    onlineCounter.classList.add("blink-1")
    setTimeout(() => onlineCounter.classList.remove("blink-1"), 1000)
})
socket.on("change lang", lang => {
    changeMode(lang)
    langPanel.value = lang;
})
editor.setOption("theme", "highcontrast-dark")
const x = document.querySelector(".code")
const ro = new ResizeObserver(entries => {
    editor.setSize(x.offsetWidth, x.offsetHeight)
})
ro.observe(document.querySelector(".code-container"))
const changeMode = (lang = 1) => {
    switch (lang) {
        case 1:
            editor.setOption("mode", "javascript")
            return lang;
        case 2:
            editor.setOption("mode", "python")
            return lang;
        case 3:
            editor.setOption("mode", "go");
            return lang;
        case 4:
            editor.setOption("mode", "cmake");
            return lang;
        case 5:
            editor.setOption("mode", "lua");
            return lang;
        case 6:
            editor.setOption("mode", "php");
            return lang;
        case 7:
            editor.setOption("mode", "vue");
            return lang;
        default: return  "javascript"
    }
}
socket.on("chat message", msg => {
    editor.setValue(msg)
    editor.setCursor(lastCursorPosition)
})
