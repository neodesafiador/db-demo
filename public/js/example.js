const whatever = document.getElementById('heading');

let toggle = false;

function updateHeading() {
    if (toggle) {
        whatever.textContent = "Web Languages";
        toggle = false;
    } else {
        whatever.textContent = "Web Dev Languages";
        toggle = true;
    }
}

// setInterval(updateHeading, 500);

const languageList = document.querySelector("#languageList");

const newLanguage = document.createElement('li');
newLanguage.textContent = 'Python';
languageList.appendChild(newLanguage);