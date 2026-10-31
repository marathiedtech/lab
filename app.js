const STORE_KEY="dzyncode_workspace_v2";
const starterFiles={
 "index.html":`<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My First Website</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="card">
    <h1>Hello, Students! 👋</h1>
    <p>Welcome to my first website.</p>
    <button onclick="sayHello()">Click Me</button>
    <p id="message"></p>
  </main>
  <script src="script.js"><\/script>
</body>
</html>`,
 "style.css":`body {
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
 "script.js":`function sayHello() {
  document.getElementById("message").textContent =
    "Great job! You ran your first JavaScript. 🎉";
}`
};
let workspace=loadWorkspace(), activePath="index.html", editor;
function loadWorkspace(){
 try{const saved=JSON.parse(localStorage.getItem(STORE_KEY));if(saved&&saved.files)return saved;}catch(e){}
 return {name:"My First Project",files:{...starterFiles},folders:[]};
}
function persist(){localStorage.setItem(STORE_KEY,JSON.stringify(workspace));document.getElementById("saveStatus").textContent="Saved locally";}
function modeFor(path){const ext=path.split(".").pop().toLowerCase();return ext==="html"?"htmlmixed":ext==="css"?"css":["js","mjs"].includes(ext)?"javascript":ext==="json"?"javascript":ext==="xml"?"xml":ext==="md"?"markdown":"text/plain";}
function iconFor(path){const ext=path.split(".").pop().toLowerCase();return ({html:"🌐",css:"🎨",js:"📜",json:"🔧",md:"📝",txt:"📄"})[ext]||"📄";}
function ensureFolder(path){if(!workspace.folders.includes(path))workspace.folders.push(path);}
function renderTree(){
 const tree=document.getElementById("fileTree");tree.innerHTML="";
 const paths=[...workspace.folders.map(p=>({path:p,type:"folder"})),...Object.keys(workspace.files).map(p=>({path:p,type:"file"}))].sort((a,b)=>a.path.localeCompare(b.path));
 if(!paths.length){tree.innerHTML='<div class="tree-item">No files yet. Use + File.</div>';return;}
 paths.forEach(item=>{
   const depth=item.path.split("/").length-1;
   const row=document.createElement("div");row.className="tree-item"+(item.type==="file"&&item.path===activePath?" active":"");
   row.style.paddingLeft=(7+depth*13)+"px";
   row.innerHTML=`<span>${item.type==="folder"?"📁":iconFor(item.path)}</span><span class="tree-name"></span>`;
   row.querySelector(".tree-name").textContent=item.path.split("/").pop()+(item.type==="folder"?"/":"");
   if(item.type==="file")row.addEventListener("click",()=>openFile(item.path));
   else row.addEventListener("click",()=>{const child=Object.keys(workspace.files).find(p=>p.startsWith(item.path+"/"));if(child)openFile(child);});
   tree.appendChild(row);
 });
}
function openFile(path){
 if(editor){workspace.files[activePath]=editor.getValue();persist();}
 activePath=path;editor.setOption("mode",modeFor(path));editor.setValue(workspace.files[path]??"");
 document.getElementById("activeFileName").textContent=path;
 document.getElementById("fileIcon").textContent=iconFor(path);
 document.getElementById("lineInfo").textContent=path.split(".").pop().toUpperCase()+" · Edit your code";
 renderTree();
}
function askName(message,placeholder){const value=prompt(message,placeholder);if(value===null)return null;const clean=value.trim().replace(/^\/+|\/+$/g,"");if(!clean||clean.includes("..")||clean.includes("\\\\")){alert("Please enter a valid name.");return null;}return clean;}
function newFolder(){
 const name=askName("Folder name (you can use folders like images or pages):","components");if(!name)return;
 const path=activePath.includes("/")?activePath.substring(0,activePath.lastIndexOf("/")+1)+name:name;
 if(workspace.folders.includes(path)){alert("This folder already exists.");return;}
 ensureFolder(path);persist();renderTree();
}
function newFile(){
 const name=askName("File name with extension (example: about.html or css/style.css):","about.html");if(!name)return;
 const path=activePath.includes("/")&&!name.includes("/")?activePath.substring(0,activePath.lastIndexOf("/")+1)+name:name;
 if(workspace.files[path]!==undefined){alert("This file already exists.");return;}
 const parts=path.split("/");if(parts.length>1){let acc="";parts.slice(0,-1).forEach(part=>{acc=acc?acc+"/"+part:part;ensureFolder(acc);});}
 workspace.files[path]=path.endsWith(".html")?`<!doctype html>\n<html>\n<head><meta name="viewport" content="width=device-width, initial-scale=1"><title>New Page</title></head>\n<body>\n  <h1>New Page</h1>\n</body>\n</html>`:"";
 persist();renderTree();openFile(path);
}
function buildPreview(){
 const files={...workspace.files};let html=files["index.html"]||Object.entries(files).find(([p])=>p.endsWith(".html"))?.[1];
 if(!html){alert("Create an index.html file to preview your project.");return;}
 const css=files["style.css"]||"",js=files["script.js"]||"";
 html=html.replace(/<link[^>]+href=["'](?:\.\/)?style\.css["'][^>]*>/i,`<style>${css}</style>`);
 html=html.replace(/<script[^>]+src=["'](?:\.\/)?script\.js["'][^>]*><\/script>/i,`<script>${js.replace(/<\/script/gi,"<\\/script")}<\/script>`);
 if(!/<style[\s>]/i.test(html)&&css)html=html.replace("</head>",`<style>${css}</style></head>`);
 document.getElementById("preview").srcdoc=html;
 document.getElementById("previewStatus").textContent="Preview updated";
}
async function downloadProject(){
 if(!window.JSZip){alert("ZIP library did not load. Check your internet connection.");return;}
 const zip=new JSZip();Object.entries(workspace.files).forEach(([path,content])=>zip.file(path,content));
 workspace.folders.forEach(path=>zip.folder(path));
 const blob=await zip.generateAsync({type:"blob"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=(workspace.name||"dzyncode-project").replace(/[^a-z0-9-_]/gi,"-")+".zip";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function newProject(){
 const name=askName("New project name:","My Website Project");if(!name)return;
 if(!confirm("Create a new project? Your current project remains saved in this browser only if you download it first."))return;
 workspace={name,files:{"index.html":`<!doctype html>\n<html>\n<head><meta name="viewport" content="width=device-width, initial-scale=1"><title>${name}</title><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>${name}</h1>\n  <script src="script.js"><\/script>\n</body>\n</html>`,"style.css":"body { font-family: Arial, sans-serif; padding: 24px; }","script.js":"// Write JavaScript here"},folders:[]};
 activePath="index.html";document.getElementById("projectName").textContent=name;persist();renderTree();openFile(activePath);buildPreview();
}
editor=CodeMirror.fromTextArea(document.getElementById("code"),{theme:"dracula",lineNumbers:true,mode:"htmlmixed",indentUnit:2,tabSize:2,lineWrapping:true,viewportMargin:Infinity});
editor.setValue(workspace.files[activePath]||"");
function getHintFunction(){
 const m=editor.getOption("mode");
 if(m==="htmlmixed")return CodeMirror.hint.html;
 if(m==="css")return CodeMirror.hint.css;
 if(m==="javascript")return CodeMirror.hint.javascript;
 return CodeMirror.hint.anyword;
}
function showEditorHints(){
 if(!editor.hasFocus())return;
 const hint=getHintFunction();
 CodeMirror.showHint(editor,hint,{completeSingle:false});
}
editor.setOption("extraKeys",{
 "Ctrl-Space":showEditorHints,
 "Cmd-Space":showEditorHints
});
// Offer suggestions as the learner types; keep the popup dismissible and non-blocking.
editor.on("inputRead",(cm,change)=>{
 if(change.text && change.text.some(t=>/[\w<.#-]/.test(t))){
   const cur=cm.getCursor(), token=cm.getTokenAt(cur);
   if(token.string.length>=2) showEditorHints();
 }
});
editor.on("change",()=>{workspace.files[activePath]=editor.getValue();persist();});
document.getElementById("projectName").textContent=workspace.name;
document.getElementById("newFolderBtn").addEventListener("click",newFolder);
document.getElementById("newFileBtn").addEventListener("click",newFile);
document.getElementById("newProjectBtn").addEventListener("click",newProject);
document.getElementById("runBtn").addEventListener("click",buildPreview);
document.getElementById("refreshBtn").addEventListener("click",buildPreview);
document.getElementById("downloadBtn").addEventListener("click",downloadProject);
renderTree();buildPreview();
