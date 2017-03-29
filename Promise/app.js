var randomButtonPromiseElement = document.getElementById('randomizePromise');
var randomUserElement = document.getElementById('user');
var errorElement = document.getElementById('error');


randomButtonPromiseElement.onclick = function() {
    var method = 'GET';
    var url = 'https://api.github.com/users';

    makeRequestPromise(method,url)
        .catch(err => {
            throw err
        })
        .then(data => {
            return JSON.parse(data);
        })
        .catch(err => {
            throw err;
        })
        .then(users => {
            return users[Math.floor(Math.random() * users.length)];
        })
        .then(user => Promise.all([user,loadUserImage(user)]))
        .then(data => {
            hideError();
            drawUser(data[0]);
        })
        .catch(err => {
            showError(err);
        });

};

function makeRequestPromise(method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method,url,true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                reject(new Error('O_o'));
            }

            resolve(xhr.responseText);
        };

        xhr.send();
    });
}

function loadUserImage(user) {
    return new Promise(function(resolve, reject){
        let img = new Image();

        img.onload = function() {
            resolve(true);
        };

        img.onerror = function() {
            reject(new Error('Ошибка загрузки изображения'));
        };

        img.src = user.avatar_url;
    });
}

function showError(err) {
    errorElement.textContent = err;
    errorElement.classList.remove('hidden');
    randomUserElement.classList.add('hidden');
}

function hideError() {
    errorElement.classList.add('hidden');
    randomUserElement.classList.remove('hidden');
}

function drawUser(data) {
    var img = randomUserElement.querySelector('img');
    var link = randomUserElement.querySelector('a');
    img.src = data.avatar_url;
    img.alt = data.login;
    link.href = data.html_url;
    link.textContent = data.login;
}
