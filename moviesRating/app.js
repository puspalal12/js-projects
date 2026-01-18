const API_KEY = "d538e39e";
const searchBtn = document.getElementById('search-btn');
const movieInput = document.getElementById('movie-input');
const searchContainer = document.getElementById('search-container');
const searchGrid = document.getElementById('search-grid');
const trendingGrid = document.getElementById('trending-grid');


const getCardHTML = (m) => `
    <div class="movie-card" onclick="location.href='movie.html?id=${m.imdbID}'">
        <img src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${m.Title}">
        <div class="info">
            <h3>${m.Title}</h3>
            <p style="color: #888;">${m.Year}</p>
        </div>
    </div>
`;


const fetchTrending = async () => {
    const res = await fetch(`https://www.omdbapi.com/?s=2025&apikey=${API_KEY}`);
    const data = await res.json();
    if (data.Search) {
        trendingGrid.innerHTML = data.Search.map(m => getCardHTML(m)).join('');
    }
};


searchBtn.addEventListener('click', async () => {
    const query = movieInput.value.trim();
    if (!query) return;

    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === "True") {
        searchContainer.style.display = "block";
        searchGrid.innerHTML = data.Search.map(m => getCardHTML(m)).join('');
        searchContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("No movies found!");
    }
});


fetchTrending();