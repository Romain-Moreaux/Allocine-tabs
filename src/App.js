import React from "react";
import logo from "./logo.svg";
import loading from "./loading.svg";
import axios from "axios";

const ENDPOINT = "https://api-allocine.herokuapp.com/api/movies/";
const PARAMS = ["popular", "upcoming", "top_rated"];

class App extends React.Component {
  state = {
    page: 0,
    totalPage: null,
    selectedTab: null,
    movies: null,
    loading: false
  };

  getMovies() {
    let url = ENDPOINT;
    if (this.state.selectedTab) url += this.state.selectedTab;
    if (this.state.page) url += `?p=${this.state.page}`;
    this.setState({ loading: true });
    window.setTimeout(async () => {
      try {
        const response = await axios.get(url);

        this.setState({
          movies: response.data.results,
          loading: false,
          page: response.data.page,
          totalPage: response.data.total_pages
        });
      } catch (error) {
        console.log(error.message);
      }
    }, 500);
  }

  renderMovies() {
    if (this.state.movies !== null) {
      return this.state.movies.map((movie, index) => {
        return (
          <div key={index} className="movie">
            <img
              className="poster"
              src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2/${
                movie.poster_path
              }`}
              alt=""
            />
            <div className="meta">
              <h4 className="int-title">{movie.title}</h4>
              <p className="release-date">{movie.release_date}</p>
              <p className="overview">{movie.overview}</p>
            </div>
          </div>
        );
      });
    }
  }

  renderPagination() {
    let firstPage = this.state.page - 1;
    let lastPage = firstPage + 3;
    if (this.state.totalPage !== null && lastPage > this.state.totalPage) {
      const diff = lastPage - this.state.totalPage;
      firstPage -= diff;
      lastPage -= diff;
    }
    if (firstPage < 1) {
      const diff = 1 - firstPage;
      lastPage = lastPage + diff;
      firstPage = 1;
    }

    const options = ["first"];
    for (let index = 0; index < 4; index++) {
      options.push(firstPage + index);
    }
    options.push("last");

    return options.map((option, index) => {
      return (
        <button
          className="link"
          onClick={() => {
            const target =
              option === "first"
                ? 1
                : option === "last"
                ? this.state.totalPage
                : option;
            this.setState({ page: target }, () => {
              this.getMovies();
            });
          }}
        >
          {option}
        </button>
      );
    });
  }

  componentDidMount() {
    this.setState({ selectedTab: "popular" }, () => {
      this.getMovies();
    });
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <section className="posts">
          <h1>Cinéma</h1>
          <div className="buttons">
            {PARAMS.map((el, index) => {
              return (
                <button
                  className={
                    "button " +
                    (this.state.selectedTab === el ? "selectedTab" : "")
                  }
                  onClick={() => {
                    this.setState({ selectedTab: el, page: 1 }, () => {
                      this.getMovies();
                    });
                  }}
                >
                  <span>#</span>
                  {el} Movies
                </button>
              );
            })}
          </div>
          <div className="posts-list">
            <h2>mes films</h2>
            <div className="listing">
              {this.state.loading ? (
                <div className="loader">
                  <img src={loading} alt="" />
                </div>
              ) : (
                this.renderMovies()
              )}
            </div>
            {!this.state.loading && (
              <div className="pagination">
                {this.state.selectedTab && this.renderPagination()}
              </div>
            )}
          </div>
        </section>
        <footer className="footer">
          <h3>Allociné</h3>
        </footer>
      </div>
    );
  }
}

export default App;
