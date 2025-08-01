let allRepos = [];

async function getUser() {
  const username = document.getElementById("username").value;
  const profileDiv = document.getElementById("profile");
  const reposDiv = document.getElementById("repos");
  const repoSearch = document.getElementById("repo-search");
  const loader = document.getElementById("loader");

  profileDiv.innerHTML = "";
  reposDiv.innerHTML = "";
  repoSearch.classList.add("hidden");

  if (!username) {
    alert("Please enter a username!");
    return;
  }

  loader.classList.remove("hidden");

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const user = await userRes.json();

    if (user.message === "Not Found") {
      loader.classList.add("hidden");
      profileDiv.innerHTML = "<p>User not found.</p>";
      return;
    }

    profileDiv.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" />
      <h2>${user.name || user.login}</h2>
      <p>${user.bio || ""}</p>
      <p>👥 ${user.followers} followers | ${user.following} following</p>
      <a href="${user.html_url}" target="_blank">View GitHub Profile</a>
    `;

    const repoRes = await fetch(user.repos_url + '?per_page=100');
    allRepos = await repoRes.json();

    displayRepos(allRepos);
    repoSearch.classList.remove("hidden");

  } catch (error) {
    profileDiv.innerHTML = "<p>Error loading data. Try again.</p>";
  }

  loader.classList.add("hidden");
}

function displayRepos(repos) {
  const reposDiv = document.getElementById("repos");
  reposDiv.innerHTML = "<ul>" +
    repos.map(repo => `
      <li>
        <strong>${repo.name}</strong> ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} <br />
        <a href="${repo.html_url}" target="_blank">View Repository</a>
      </li>
    `).join("") +
    "</ul>";
}

function filterRepos() {
  const input = document.getElementById("repo-search").value.toLowerCase();
  const filtered = allRepos.filter(repo => repo.name.toLowerCase().includes(input));
  displayRepos(filtered);
}
