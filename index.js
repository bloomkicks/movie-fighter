const movieTemplate = (movieDetail) => {
  if (movieDetail.BoxOffice)
    boxOffice =
      parseInt(
        movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
      ) || 0;
  if (movieDetail.Metascore)
    metascore =
      parseInt(movieDetail.Metascore.replace(/,/g, "")) || 0;
  if (movieDetail.imdbRating)
    imdbRating = parseFloat(movieDetail.imdbRating) || 0;
  if (movieDetail.imdbVotes)
    imdbVotes =
      parseInt(movieDetail.imdbVotes.replace(/,/g, "")) || 0;
  if (movieDetail.Awards)
    awards =
      movieDetail.Awards.split(" ").reduce((prev, word) => {
        if (isNaN(parseInt(word))) return prev;
        return prev + parseInt(word);
      }, 0) || 0;
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${boxOffice} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

const autocompleteCfg = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `<img src="${imgSrc}" />
     ${movie.Title} (${movie.Year})`;
  },
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie);
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "d9835cc5",
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryEl, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "d9835cc5",
      i: movie.imdbID,
    },
  });

  summaryEl.innerHTML = movieTemplate(response.data);

  if (side === "left") leftMovie = response.data;
  else rightMovie = response.data;

  if (leftMovie && rightMovie) {
    compareMovies();
  }
};

function compareMovies() {
  const leftSummary = document.querySelectorAll(
    "#left-summary article.notification"
  );
  const rightSummary = document.querySelectorAll(
    "#right-summary article.notification"
  );

  for (let i = 0; i < leftSummary.length; i++) {
    let left = parseFloat(leftSummary[i].dataset.value);
    let right = parseFloat(rightSummary[i].dataset.value);

    if (left > right) {
      leftSummary[i].classList.add("is-warning");
    } else if (right > left) {
      rightSummary[i].classList.add("is-warning");
    }
  }
}

createAutocomplete({
  root: document.querySelector("#left-autocomplete"),
  ...autocompleteCfg,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(
      movie,
      document.querySelector("#left-summary"),
      "left"
    );
  },
});

createAutocomplete({
  root: document.querySelector("#right-autocomplete"),
  ...autocompleteCfg,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(
      movie,
      document.querySelector("#right-summary"),
      "right"
    );
  },
});
