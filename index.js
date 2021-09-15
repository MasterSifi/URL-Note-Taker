let myNotes = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
let getDate = "";
const switchBtn = document.getElementById("switch-btn");
const csvDownload = document.getElementById("csv-download");

if (localStorage.getItem("myNoteString")) {
	let myNoteStringLocal = localStorage.getItem("myNoteString");
	myNotes = JSON.parse(myNoteStringLocal);
	renderList();
}

function pushSaveData(){
		if (inputEl.value != ""){
			let date = new Date();
			if(localStorage.getItem("selectedLanguage")){
				getDate = date.toLocaleString(localStorage.getItem("selectedLanguage"));
			} else {
				getDate = date.toLocaleString();
			}
			
			if (switchBtn.hasAttribute("checked")){
			
				chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
					let urlExtract = tabs[0].url;
					// urlExtract used here inside the callback because it's asynchronous.
					let subMyNotes = [];
					subMyNotes.push(getDate);
					subMyNotes.push(`<a target="_blank" href="${urlExtract}"><img title="Click to open link" src="link.png"></a>`);
					subMyNotes.push(inputEl.value);
					myNotes.push(subMyNotes);
					inputEl.value = "";
					renderList();
					let myNoteString = JSON.stringify(myNotes);
					localStorage.setItem("myNoteString", myNoteString);
				});
				
			} else {
				let subMyNotes = [];
				subMyNotes.push(getDate);
				subMyNotes.push(`<img title="No link available" src="no-link.png">`);
				subMyNotes.push(inputEl.value);
				myNotes.push(subMyNotes);
				inputEl.value = "";
				renderList();
				let myNoteString = JSON.stringify(myNotes);
				localStorage.setItem("myNoteString", myNoteString);
			}
		}
	}
	
function renderList(){
		ulEl.innerHTML = "";
		for (i=0; i<myNotes.length; i++){
			for (j=0; j<myNotes[i].length; j++){
				ulEl.innerHTML += 	`<li>${myNotes[i][j]}</li>`;
			}
		}
	}

function deletAll(){
		ulEl.innerHTML = "";
		localStorage.clear();
		pushSaveData();
		myNotes = [];
		document.getElementById("delete-info").innerText = "";
	}

inputBtn.addEventListener("click", pushSaveData);
deleteBtn.addEventListener("dblclick", deletAll);

if(localStorage.getItem("saveURL")){
		let saveURLvalue = localStorage.getItem("saveURL");
		if (saveURLvalue == "no"){
			switchBtn.removeAttribute("checked");
		} else {
			switchBtn.setAttribute("checked","");
		}
	}

switchBtn.addEventListener("change", function(){
	
		if (switchBtn.hasAttribute("checked")){
			switchBtn.removeAttribute("checked");
			localStorage.setItem("saveURL", "no");
		} else {
			switchBtn.setAttribute("checked","");
			localStorage.setItem("saveURL", "yes");
		}
	})

function downloadNotes(){	

	let mytable = `<table>
	<tr>
		<th>Date & Time</th>
		<th>Link</th>
		<th>Note</th>
	</tr>`;
	
	myNotes.forEach(function(row){
		if (row[1].includes("https://") || row[1].includes("http://")){
				let longURL = row[1];
				let splitURL = longURL.split('"');
				var finalURL = "";
				splitURL.forEach(function(row){
					if (row.includes("https://") || row.includes("http://")) {
						finalURL = row;
					}
				});
				mytable += `<tr><td>${row[0]}</td>
							<td>${finalURL}</td>
							<td><p>${row[2]}</p></td></tr>`;
			} else {
				mytable += `<tr><td>${row[0]}</td>
							<td></td>
							<td><p>${row[2]}</p></td></tr>`;
			}
	});
		
	mytable += "</table>";	
		
	let style = "<style>";
	style = style + "table {width: 100%;font: 14px Arial;}";
	style = style + "table, th, td {vertical-align: text-top; border: solid 1px #DDD; border-collapse: collapse;";
	style = style + "padding: 2px 3px;text-align: left;}";
	style = style + "tr>:nth-child(1), tr>:nth-child(2) {max-width:100px !important;overflow-wrap: break-word; word-wrap: break-word;}";
	style = style + "tr>:nth-child(3) {min-width:100px !important;overflow-wrap: break-word; word-wrap: break-word;}";
	style = style + "</style>";

	// CREATE A WINDOW OBJECT.
	let win = window.open('', '', 'height=700,width=700');
	win.document.write('<html><head>');
	win.document.write('<title>Notes</title>');
	win.document.write(style);
	win.document.write('</head>');
	win.document.write('<body>');
	win.document.write(mytable);
	win.document.write('</body></html>');
	win.document.close();
	win.print();
}

csvDownload.addEventListener("click", downloadNotes);