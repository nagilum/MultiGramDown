"use strict";

/**
 * Analyze the HTML and get all 'src' values.
 * @param {String} html 
 */
var analyzeHtml = (html) => {
    let urls = [];

    while(true) {
        let sp = html.indexOf('\"src\":\"');

        if (sp === -1) {
            break;
        }

        html = html.substr(sp + 7);

        let np = html.indexOf('\"');

        if (np === -1) {
            break;
        }

        let url = html.substr(0, np);

        if (!urls.includes(url)) {
            urls.push(url);
        }        
    }

    let div = document.querySelector('div#images');

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for (let i = 0; i < urls.length; i++) {
        urls[i] = urls[i].split('\\u0026').join('&');
    }

    urls.forEach((url) => {
        let a = document.createElement('a'),
            s = document.createElement('span');
        
        let img = new Image();

        img.onload = () => {
            s.innerText = img.width.toString() + 'x' + img.height.toString();
        };

        img.src = url;

        a.setAttribute('href', url);
        a.style.backgroundImage = 'url("' + url + '")';

        a.appendChild(s);
        div.appendChild(a);
    });

    console.log(urls);
}

/**
 * Download HTML from the given URL.
 * @param {String} url 
 */
var downloadHtml = (url) => {
    return fetch(url)
        .then((res) => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            return res.text();
        })
        .then((html) => {
            // Analyze the HTML and get all 'src' values.
            analyzeHtml(html);
        })
        .catch((err) => {
            console.error(err);
            alert('Unable to fetch HTML from Instagram');            
        });
};

/**
 * Download images from Instagram post.
 */
var downloadImages = () => {
    document
        .querySelector('div#form')
        .classList.add('loaded');

    let url = document.querySelector('input#url').value;

    // Download HTML from the given URL.
    downloadHtml(url);
};

/**
 * Init stuff..
 */
(() => {
    document
        .querySelector('button#load')
        .addEventListener('click', downloadImages);
})();