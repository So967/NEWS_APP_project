const CORS_PROXY = "https://api.allorigins.win/get?url=";
const API_KEY = "b2f655a2b2174b0e94e4c039c23df2c8";
const url = "https://newsapi.org/v2/everything?q=";

async function fetchNews(query) {
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(
    url + query + "&apiKey=" + API_KEY
  )}`;

  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();
    const articles = JSON.parse(data.contents).articles;
    bindData(articles);
  } catch (error) {
    console.error("Failed to fetch news:", error);
    alert("Could not fetch news. Please try again later.");
  }
}

window.addEventListener("load", () => fetchNews("Technology"));

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
  newsDesc.innerHTML = `${article.description.slice(0, 150)}...`;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cardscontainer");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
