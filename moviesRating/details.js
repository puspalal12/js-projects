const API_KEY = "d538e39e";
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const fetchDetails = async () => {
    const res = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`);
    const m = await res.json();

    document.getElementById('movie-details').innerHTML = `
        <img src="${m.Poster}" alt="${m.Title}">
        <div>
            <h1 style="margin-top:0;">${m.Title} (${m.Year})</h1>
            <p style="color: #ffb400; font-size: 1.2rem; font-weight: bold;">⭐ ${m.imdbRating}</p>
            <p><strong>Genre:</strong> ${m.Genre}</p>
            <p><strong>Cast:</strong> ${m.Actors}</p>
            <p><strong>Director:</strong> ${m.Director}</p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
            <h3>Plot</h3>
            <p style="line-height: 1.6; color: #ccc;">${m.Plot}</p>
        </div>
    `;
};

if(id) fetchDetails();