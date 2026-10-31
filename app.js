const starter = {
 html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My First Website</title>
</head>
<body>
  <main class="card">
    <h1>Hello, Students! 👋</h1>
    <p>Welcome to my first website.</p>
    <button onclick="sayHello()">Click Me</button>
    <p id="message"></p>
  </main>
</body>
</html>`,
 css: `body {
  font-family: Arial, sans-serif;
  background: #eef2ff;
  padding: 30px;
}
.card {
  max-width: 420px;
  margin: 40px auto;
  padding: 28px;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px #26345a22;
}
h1 { color: #3858c8; }
button {
  background: #3858c8;
  color: white;
  border: 0;
  padding: 12px 20px;
  border-radius: 8px;
}`,
 js: `function sayHello() {
  document.getElementById("message").textContent =
    "Great job! You ran your first JavaScript. 🎉";
}`
};
const keys = {html:"dzyncode_html",css:"dzyncode_css",js:"dzyncode_js"};
let current = "html";
let editor;
const codeEl = document.getElementById("code");
function getCode(file){return localStorage.getItem(keys[file]) ?? starter[file]}
function setCode(file,value){localStorage.setItem(keys[file],value)}
function modeFor(file){return file==="html"?"htmlmixed":file==="css"?"css":"javascript"}
function switchFile(file){
  if(editor) setCode(current,editor.getValue());
  current=file;
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.file===file));
  editor.setOption("mode",modeFor(file)); editor.setValue(getCode(file));
  document.getElementById("lineInfo").textContent=file.toUpperCase()+" · Edit your code";
}
function runCode(){
  const html=getCode("html"), css=getCode("css"), js=getCode("js");
  const doc=`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}<script>${js.replace(/<\/script/gi,"<\\/script")}<\/script></body></html>`;
  document.getElementById("preview").srcdoc=doc;
  document.getElementById("previewStatus").textContent="Preview updated";
}
function saveCurrent(){
  setCode(current,editor.getValue());
  document.getElementById("saveStatus").textContent="Saved locally";
}
editor=CodeMirror.fromTextArea(codeEl,{theme:"dracula",lineNumbers:true,mode:"htmlmixed",indentUnit:2,tabSize:2,lineWrapping:true,viewportMargin:Infinity});
editor.setValue(getCode("html"));
editor.on("change",()=>{document.getElementById("saveStatus").textContent="Saving…";saveCurrent();});
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>switchFile(t.dataset.file)));
document.getElementById("runBtn").addEventListener("click",runCode);
document.getElementById("refreshBtn").addEventListener("click",runCode);
document.getElementById("resetBtn").addEventListener("click",()=>{if(confirm("Reset all files to the starter example?")){Object.keys(keys).forEach(f=>localStorage.removeItem(keys[f]));switchFile(current);runCode();}});
document.getElementById("downloadBtn").addEventListener("click",()=>{
  const files={"index.html":getCode("html"),"style.css":getCode("css"),"script.js":getCode("js")};
  Object.entries(files).forEach(([name,content])=>{const a=document.createElement("a");const url=URL.createObjectURL(new Blob([content],{type:"text/plain"}));a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);});
});
runCode();
