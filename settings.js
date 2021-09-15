let selectedLanguage = document.getElementById("language");
let confirmLanguageChange = document.getElementById("confirm-language-change")

selectedLanguage.addEventListener("change", function(){
	localStorage.setItem("selectedLanguage", selectedLanguage.value);
	selectedLanguage.value = localStorage.getItem("selectedLanguage");
	confirmLanguageChange.innerHTML = `Your date changed to: <b>${selectedLanguage.value}</b>`;
	
})