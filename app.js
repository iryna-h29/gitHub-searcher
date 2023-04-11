'use strict';

// Workshop: GitHub search (Github API)

// Github
// UI

const GITHUB_API = 'https://api.github.com/';
const searchUser = document.querySelector('.searchUser');

// https://api.github.com/users/username
// https://api.github.com/users/username?client_id=d9308aacf8b204d361fd&client_secret=84969aeef73956f4ec9e8716d1840532802bb81b

class Github {
    constructor() {
        this.clientId = '015eccf96082aa05d7b1';
        this.clientSecret = 'ddc8e21f0390d773376317af4366bc8d83e1519d';
    }

    // https://api.github.com/
    async getUser(userName) {
        const response = await fetch(`${GITHUB_API}users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
        const user = await response.json();
        return user;
    }
    
}

class UI {
    constructor() {
        this.profile = document.querySelector('.profile');
    }

    showProfile(user) {
        this.profile.innerHTML = `
        <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
      <div class="repos"></div>
        `;
    }

    showAlert(message, className) {
        this.clearAlert();

        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = message;

        const search = document.querySelector('.search');
        search.before(div);

        setTimeout(() => {
            this.clearAlert()
        }, 3000)
    }

    clearAlert() {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }

    clearProfile() {
        this.profile.innerHTML = '';
    }

    showLastRepos(repos) {
        let repoUI = `<div class="row">`;
        repos.forEach(function(repo) {
            repoUI = repoUI + 
            `
            <div class="card border-info mb-3" style="max-width: 20rem; margin: 3em">
            <div class="card-header">${repo.created_at}</div>
            <div class="card-body">
                <h4 class="card-title">${repo.name}</h4>
                <p class="card-text">${repo.description}</p>
                <p class="card-text"><span class="badge bg-info">${repo.language}</span></p>
            </div>
            </div>
            `;
        })
        repoUI = repoUI + `</div>`;
        document.querySelector(".repos").innerHTML = repoUI;
    }
}

const github = new Github();
const ui = new UI();


const debounce = (fn, ms) => {
    let timeout;
    return function () {
      const fnCall = () => { fn.apply(this, arguments) }
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms)
    };
}
  
async function onChange(event) {

    const userText = event.target.value;

    const response = await github.getUser(userText);

    if (userText.trim() !== '') { 
        if (response.message === 'Not Found') {
            ui.showAlert('User not found', 'alert alert-danger');
        } else { 
            ui.showProfile(response);
            if (response.public_repos > 0) {
                const reposResponse = await fetch(`${response.repos_url}?sort=created`);
                const repos = await reposResponse.json();
                let lastRepos = repos.slice(0, 5);
                console.log(lastRepos);
                ui.showLastRepos(lastRepos);
            }
        }
    } else { 
        ui.clearProfile(); 
    }

}
  
  onChange = debounce(onChange, 500);
  
  searchUser.addEventListener('keyup', onChange);