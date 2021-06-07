const DARK_MODE_CLASS_NAME = "dark";
const LIGHT_MODE_CLASS_NAME = "light";

function main() {
	const themeBtn = document.getElementById("theme-btn");
	const parent = document.getElementById("parent");

	const inputDiv = document.getElementById("input-div");

	const resultLink = document.getElementById("result-link");
	const resultDiv = document.getElementById("result-div");
	const copyTooltip = document.getElementById("copy-tooltip");

	const urlInput = document.getElementById("url-input");
	const getSurlBtn = document.getElementById("surl-btn");

	const errorBlock = document.getElementById("error-block");

	const BASE_URL = window.location.origin;

	let currThemeClassName = parent.className;
	if (currThemeClassName === LIGHT_MODE_CLASS_NAME) {
		themeBtn.innerText = "Light Mode";
	} else {
		themeBtn.innerText = "Dark Mode";
	}

	themeBtn.onclick = changeTheme;
	resultDiv.onclick = copyToClipboard;
	getSurlBtn.onclick = getSurl;

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
	}

	function copyToClipboard() {
		let selection = window.getSelection();
		let range = document.createRange();
		range.selectNodeContents(resultLink);
		selection.removeAllRanges();
		selection.addRange(range);
		document.execCommand("Copy");
		selection.removeAllRanges();

		const tooltipText = copyTooltip.innerText;
		copyTooltip.innerText = "Copied";
		setTimeout(() => {
			copyTooltip.innerText = tooltipText;
		}, 3000);
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
		fetch(BASE_URL + "/surl?url=" + url)
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					hideInputDiv();
					showSurl(BASE_URL + "/" + data.url);
				} else {
					showError(data.error);
				}
			})
			.catch((e) => {
				console.log(e);
				showError("Oops! Something went wrong");
			});
	}

	function isValidURL(url = "") {
		var expression =
			/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);
		return url.match(regex);
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
}
