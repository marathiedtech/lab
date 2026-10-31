const STORE_KEY="dzyncode_workspace_v4";
const initialFiles={
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
 "style.css":`body { font-family: Arial, sans-serif; background:#eef2ff; padding:30px; }
.card { max-width:420px; margin:40px auto; padding:28px; text-align:center; background:white; border-radius:16px; }
h1 { color:#3858c8; }
button { background:#3858c8; color:white; border:0; padding:12px 20px; border-radius:8px; }`,
 "script.js":`function sayHello() {
  document.getElementById("message").textContent = "Great job! 🎉";
}`
};
let state=loadState(), activeFile="index.html", editor=null, deviceDir=null;
function loadState(){try{const x=JSON.parse(localStorage.getItem(STORE_KEY));if(x&&x.files)return x;}catch(e){}return {projectName:"My Coding Project",files:{...initialFiles}};}
function persist(){localStorage.setItem(STORE_KEY,JSON.stringify(state));const s=document.getElementById("saveStatus");if(s)s.textContent="Saved in browser";}
function safeName(name){return /^[a-zA-Z0-9._ -]+$/.test(name)&&name.trim()!==""&&!name.includes("..")&&!name.startsWith(".");}
function extMode(name){const e=name.split(".").pop().toLowerCase();return e==="html"?"htmlmixed":e==="css"?"css":e==="js"||e==="json"?"javascript":e==="xml"?"xml":"text/plain";}
function fileIcon(name){const e=name.split(".").pop().toLowerCase();return ({html:"🌐",css:"🎨",js:"📜",json:"🔧",md:"📝"})[e]||"📄";}
function flushEditor(){if(editor&&activeFile)state.files[activeFile]=editor.getValue();persist();}
function renderFiles(){
 const tree=document.getElementById("fileTree");tree.innerHTML="";
 Object.keys(state.files).sort((a,b)=>a.localeCompare(b)).forEach(name=>{
  const row=document.createElement("div");row.className="tree-item"+(name===activeFile?" active":"");
  const icon=document.createElement("span");icon.textContent=fileIcon(name);
  const label=document.createElement("span");label.className="tree-name";label.textContent=name;
  const menu=document.createElement("button");menu.className="more-btn";menu.textContent="⋯";menu.title="File actions";
  menu.addEventListener("click",e=>{e.stopPropagation();showFileActions(name);});
  row.append(icon,label,menu);row.addEventListener("click",()=>openFile(name));tree.appendChild(row);
 });
 document.getElementById("projectName").textContent=state.projectName;
}
function openFile(name){flushEditor();activeFile=name;editor.setOption("mode",extMode(name));editor.setValue(state.files[name]??"");document.getElementById("activeFileName").textContent=name;document.getElementById("fileIcon").textContent=fileIcon(name);document.getElementById("lineInfo").textContent=name.split(".").pop().toUpperCase()+" · Edit your code";renderFiles();}
function showFileActions(name){
 const choice=prompt("File: "+name+"\\nType R to rename or D to delete:","R");if(!choice)return;
 if(choice.toLowerCase()==="r"){
  const next=prompt("Enter new filename (include extension):",name);if(!next||next===name)return;
  if(!safeName(next)||state.files[next]!==undefined){alert("Invalid name or a file with that name already exists.");return;}
  flushEditor();state.files[next]=state.files[name];delete state.files[name];if(activeFile===name)activeFile=next;persist();renderFiles();openFile(activeFile);
 }else if(choice.toLowerCase()==="d"){
  if(!confirm("Delete "+name+"? This cannot be undone."))return;
  flushEditor();delete state.files[name];const names=Object.keys(state.files);if(!names.length){state.files["index.html"]="<!doctype html>\\n<h1>New project</h1>";}
  activeFile=names.includes(activeFile)?activeFile:Object.keys(state.files)[0];persist();renderFiles();openFile(activeFile);
 }
}
function newFile(){
 const name=prompt("New file name (example: about.html, style.css, app.js):","newfile.html");if(!name)return;
 if(!safeName(name)||state.files[name]!==undefined){alert("Please use a valid filename. Folders are not needed here; all project files stay together.");return;}
 const ext=name.split(".").pop().toLowerCase();
 state.files[name]=ext==="html"?"<!doctype html>\\n<html>\\n<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>New Page</title></head>\\n<body>\\n  <h1>New Page</h1>\\n</body>\\n</html>":"";
 persist();renderFiles();openFile(name);
}
function hintFn(){const m=editor.getOption("mode");if(m==="htmlmixed"&&CodeMirror.hint.html)return CodeMirror.hint.html;if(m==="css"&&CodeMirror.hint.css)return CodeMirror.hint.css;if(m==="javascript"&&CodeMirror.hint.javascript)return CodeMirror.hint.javascript;return CodeMirror.hint.anyword;}
function showHints(){if(editor.hasFocus()&&CodeMirror.showHint)CodeMirror.showHint(editor,hintFn(),{completeSingle:false});}
function runPreview(){
 flushEditor();let html=state.files["index.html"]||Object.entries(state.files).find(([n])=>n.endsWith(".html"))?.[1];
 if(!html){alert("Create an HTML file to preview.");return;}
 const css=state.files["style.css"]||"",js=state.files["script.js"]||"";
 html=html.replace(/<link[^>]+href=["'](?:\.\/)?style\.css["'][^>]*>/i,`<style>${css}</style>`);
 html=html.replace(/<script[^>]+src=["'](?:\.\/)?script\.js["'][^>]*><\/script>/i,`<script>${js.replace(/<\/script/gi,"<\\/script")}<\\/script>`);
 if(css&&!/<style[\s>]/i.test(html))html=html.replace("</head>",`<style>${css}</style></head>`);
 document.getElementById("preview").srcdoc=html;document.getElementById("previewStatus").textContent="Preview updated";
}
async function exportZip(){
 flushEditor();if(!window.JSZip){alert("ZIP tool did not load. Check your internet connection.");return;}
 const zip=new JSZip();Object.entries(state.files).forEach(([name,content])=>zip.file(name,content));
 const blob=await zip.generateAsync({type:"blob"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=(state.projectName||"student-project").replace(/[^a-z0-9-_]/gi,"_")+".zip";a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
async function chooseDeviceFolder(){
 if(!window.showDirectoryPicker){alert("This browser does not support direct folder access. Use Export ZIP instead. On supported desktop Chrome/Edge, choose or create a folder when the folder picker opens.");return;}
 try{deviceDir=await window.showDirectoryPicker({mode:"readwrite"});document.getElementById("folderStatus").textContent="Device folder connected: "+deviceDir.name;await saveToDeviceFolder();}catch(e){if(e.name!=="AbortError")alert("Could not access folder: "+e.message);}
}
async function saveToDeviceFolder(){
 flushEditor();if(!deviceDir){alert("First choose a device folder.");return;}
 try{
  for(const [name,content] of Object.entries(state.files)){
   const handle=await deviceDir.getFileHandle(name,{create:true});const writable=await handle.createWritable();await writable.write(content);await writable.close();
  }
  document.getElementById("folderStatus").textContent="Saved to device folder: "+deviceDir.name;
  document.getElementById("saveStatus").textContent="Saved to device folder";
 }catch(e){alert("Folder save failed: "+e.message+"\\nUse Export ZIP to share your project.");}
}
editor=CodeMirror.fromTextArea(document.getElementById("code"),{theme:"dracula",lineNumbers:true,mode:"htmlmixed",indentUnit:2,tabSize:2,lineWrapping:true,viewportMargin:Infinity,extraKeys:{"Ctrl-Space":showHints,"Cmd-Space":showHints}});
editor.setValue(state.files[activeFile]||"");
editor.on("change",()=>{state.files[activeFile]=editor.getValue();persist();});
document.getElementById("newFileBtn").addEventListener("click",newFile);
document.getElementById("runBtn").addEventListener("click",runPreview);
document.getElementById("refreshBtn").addEventListener("click",runPreview);
document.getElementById("zipBtn").addEventListener("click",exportZip);
document.getElementById("openFolderBtn").addEventListener("click",chooseDeviceFolder);
document.getElementById("syncBtn").addEventListener("click",saveToDeviceFolder);
renderFiles();runPreview();
