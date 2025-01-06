const API_KEY = "b2f655a2b2174b0e94e4c039c23df2c8";
const API_URL = "https://newsapi.org/v2/everything?q=";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

let currentSelectedNav = null;

async function fetchNews(query) {
  try {
    const response = await fetch(
      `${CORS_PROXY}${API_URL}${query}&apiKey=${API_KEY}`
    );
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    const data = await response.json();
    if (data.articles.length === 0) {
      alert("No news articles found for the selected category.");
      return;
    }
    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    alert("Unable to fetch news at the moment. Please try again later.");
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cardscontainer");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsDesc = cardClone.querySelector("#news-desc");
    const newsSource = cardClone.querySelector("#news-source");

    newsImg.src = article.urlToImage || "https://via.placeholder.com/400x200";
    newsTitle.textContent = article.title || "No title available";
    newsDesc.textContent = article.description || "No description available.";
    newsSource.textContent = `${article.source.name} · ${new Date(
      article.publishedAt
    ).toLocaleDateString()}`;

    cardClone.querySelector(".card").addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    cardsContainer.appendChild(cardClone);
  });
}

function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  currentSelectedNav?.classList.remove("active");
  currentSelectedNav = navItem;
  currentSelectedNav.classList.add("active");
}

document.getElementById("search-button").addEventListener("click", () => {
  const query = document.getElementById("search-text").value.trim();
  if (!query) {
    alert("Please enter a search term.");
    return;
  }
  fetchNews(query);
  currentSelectedNav?.classList.remove("active");
  currentSelectedNav = null;
});

window.addEventListener("load", () => fetchNews("Technology"));



