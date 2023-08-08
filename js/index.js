//Toggle genre menu
const navGenre = document.querySelector(".nav__genre");
navGenre.addEventListener("click", () => {
  const navToggle = document.querySelector(".nav__genre-container");
  navToggle.classList.toggle("nav__genre-container-toggle");
});


const navEnter = document.querySelector(".nav__search input");
//Get enter input for search
navEnter.addEventListener("keypress", (event) => {
  if (event.keyCode === 13 || event.which === 13) {
    findShows();
    console.log("pressed");
  }
});

//store all shows
let allShows = [];

//render shows
const renderShows = (shows) => {
  const showContainer = document.getElementById("shows__container");
  const showContainerInfo = document.getElementById(
    "shows__container-information"
  );
  showContainerInfo.innerHTML = "";
  showContainer.innerHTML = "";

  shows.forEach((show) => {
    const { name, genres, image, rating } = show;
    const showCreate = document.createElement("div");
    showCreate.classList.add("shows__card");

    if (rating.average === null) {
      rating.average = "?";
    }
    showCreate.innerHTML = `
      <img alt="Poster for ${name}" class="shows__img" src=${image.medium}>
      <div>
        <h3>${name}</h2>
        <span>${genres}</span>
        <span>Rating <ion-icon role="img" name="star"></ion-icon> ${rating.average}</span>
      </div>
    `;
    showContainer.appendChild(showCreate);
    //We add click events to all shows
    showCreate.addEventListener("click", () => displayShowInfo(show));
  });


};


//Fetch move pages endpoint
const fetchShows = async () => {
  try {
    let page = 1;
    const maxPages = 50;
//While loop to call multiple pages 
    while (page <= maxPages) {
      const response = await axios.get(
        `https://api.tvmaze.com/shows?page=${page}`
      );

      if (response.data.length === 0) {
        break;
      }

      const shows = response.data;
      allShows.push(...shows);
      page++;
    }
    renderShows(allShows);
  } catch (error) {
    console.error("Error", error);
  }
};


//Get click event, extract text content and use as filter
const genreClick = (event) => {
  const selectedGenre = event.target.textContent;
  const filteredShows = allShows.filter((show) =>
    show.genres.includes(selectedGenre)
  );
  renderShows(filteredShows);
  
};

//We add a click event to genre ul 
const allGenres = document.querySelectorAll(".nav__genre-ul li");
allGenres.forEach((genre) => {
  genre.addEventListener("click", genreClick);
});

//Find shows using search endpoint, we get value and create apiUrl
const findShows = async () => {
  const searchInput = document.getElementById("searchInput").value;
  const apiUrl = `http://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchInput)}`;
  try {
    const response = await axios.get(apiUrl);
    const responseResult = response.data.map((result) => result.show);
    renderShows(responseResult);
  } catch (error) {
    console.error(error);
  }
};


//display show information
const displayShowInfo = (show) => {
  console.log("clicked");

  const showContainer = document.getElementById("shows__container");
  const showContainerInfo = document.getElementById(
    "shows__container-information"
  );
  let {
    name,
    genres,
    image,
    rating,
    language,
    premiered,
    ended,
    officialSite,
    network,
    summary,
  } = show;
  const showCreate = document.createElement("div");
  showCreate.classList.add("shows__information");

  showContainer.innerHTML = "";
  showContainerInfo.innerHTML = "";

  if (rating.average === null) {
    rating.average = "?";
  } else if (ended === null) {
    ended = "?";
  }

  showCreate.innerHTML = `
  <div class="shows__container-overlay">
    <img class="shows__img-background" src="${image.original}">
    <div class="shows__container-info">
      <img alt="Poster for ${name}" class="shows__img "src="${image.medium}">
      <div>
        <h3>${name}</h3>
        <span>${genres}</span>
        <span>Language: ${language} </span>
        <span>${premiered} / ${ended}</span>
        <span>Rating <ion-icon role="img" name="star"></ion-icon> ${rating.average}</span>
      </div>
    </div>
  </div>
 
 <div class="shows__container-description">
  <p>${summary}</p>
 </div>
`;
  showContainerInfo.appendChild(showCreate);
};

fetchShows();
