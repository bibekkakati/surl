const DARK_MODE_CLASS_NAME = "dark";
const LIGHT_MODE_CLASS_NAME = "light";

const themeBtn = document.getElementById("theme-btn");
const parent = document.getElementById("parent");

const logoDiv = document.getElementById("logo-div");

const inputDiv = document.getElementById("input-div");

const resultLink = document.getElementById("result-link");
const resultDiv = document.getElementById("result-div");
const copyTooltip = document.getElementById("copy-tooltip");

const urlInput = document.getElementById("url-input");
const getSurlBtn = document.getElementById("surl-btn");

const errorBlock = document.getElementById("error-block");

const BASE_URL = window.location.origin;

let currThemeClassName =
	window.localStorage.getItem("THEME") || LIGHT_MODE_CLASS_NAME;
parent.className = currThemeClassName;
if (currThemeClassName === LIGHT_MODE_CLASS_NAME) {
	themeBtn.innerText = "Light Mode";
} else {
	themeBtn.innerText = "Dark Mode";
}

logoDiv ? (logoDiv.onclick = navigateToHome) : nill();
themeBtn ? (themeBtn.onclick = changeTheme) : nill();
resultDiv ? (resultDiv.onclick = copyToClipboard) : nill();
getSurlBtn ? (getSurlBtn.onclick = getSurl) : nill();

function nill() {}

function navigateToHome() {
	window.location.href = "/";
}

function changeTheme() {
	if (currThemeClassName === DARK_MODE_CLASS_NAME) {
		currThemeClassName = LIGHT_MODE_CLASS_NAME;
		parent.className = currThemeClassName;
		themeBtn.innerText = "Light Mode";
	} else {
		currThemeClassName = DARK_MODE_CLASS_NAME;
		parent.className = currThemeClassName;
		themeBtn.innerText = "Dark Mode";
	}
	window.localStorage.setItem("THEME", currThemeClassName);
}

async function copyToClipboard() {
	try {
		await navigator.clipboard.writeText(resultLink.innerText);
		const tooltipText = copyTooltip.innerText;
		copyTooltip.innerText = "Copied";
		setTimeout(() => {
			copyTooltip.innerText = tooltipText;
		}, 3000);
	} catch (error) {
		showError("Oops! Something went wrong");
	}
	return;
}

function getSurl() {
	hideResultDiv();
	hideError();
	let url = urlInput.value;
	if (!url) {
		return showError("URL is required");
	}
	let isValid = isValidURL(url);
	if (!isValid) {
		return showError("URL is not valid");
	}
	if (url[url.length - 1] === "/") {
		url = url.slice(0, url.length - 1);
	}
	fetch(BASE_URL + "/api/url/short?url=" + url)
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				hideInputDiv();
				showSurl(data.url);
			} else {
				showError(data.error);
			}
		})
		.catch((e) => {
			showError("Oops! Something went wrong");
		});
}

function isValidURL(url = "") {
	if (url.length > 2048) {
		return false;
	}
	const regex =
		/^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

	return regex.test(url);
}

function showSurl(url) {
	resultLink.innerText = url;
	resultDiv.style.display = "flex";
}

function hideResultDiv() {
	resultDiv.style.display = "none";
	resultLink.innerText = "";
}

function hideInputDiv() {
	inputDiv.style.display = "none";
	urlInput.value = "";
}

function showError(msg = "") {
	errorBlock.style.display = "block";
	errorBlock.innerText = msg;
	setTimeout(() => {
		errorBlock.style.display = "none";
	}, 5000);
}

function hideError() {
	errorBlock.style.display = "none";
	errorBlock.innerText = "";
}
