import inceptionImage from '../inception1.png';
import matrixImage from '../thematrix1.png';
import interstellarImage from '../interstellar1.png';
import phantomdetectiveImage from '../phantomdetective1.png';

export const mockMovies = [
  {
    movie_id: 1,
    title: "Inception",
    release_date: "2010-07-16",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    poster_path: inceptionImage,
    run_time: 148,
    genre: "Action, Adventure, Sci-Fi",
    production_countries: "United States, United Kingdom",
    vote_count: 29000,
    vote_average: 8.3,
    adult: false,
    flatrate: "Watcha, Netflix, Disney Plus", // 선택 가능한 스트리밍 서비스로 수정
    link: "https://www.themoviedb.org/movie/27205-inception",
    payment: null,
  },
  {
    movie_id: 2,
    title: "The Matrix",
    release_date: "1999-03-31",
    overview: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth—the life he knows is the elaborate deception of an evil cyber-intelligence.",
    poster_path: matrixImage,
    run_time: 136,
    genre: "Action, Sci-Fi",
    production_countries: "United States",
    vote_count: 18000,
    vote_average: 8.7,
    adult: false,
    flatrate: "Watcha, Netflix", // 선택 가능한 스트리밍 서비스로 수정
    link: "https://www.themoviedb.org/movie/603-the-matrix",
    payment: null,
  },
  {
    movie_id: 3,
    title: "Interstellar",
    release_date: "2014-11-07",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: interstellarImage,
    run_time: 169,
    genre: "Adventure, Drama, Sci-Fi",
    production_countries: "United Kingdom, United States, Canada",
    vote_count: 25000,
    vote_average: 8.6,
    adult: false,
    flatrate: "Disney Plus", // 선택 가능한 스트리밍 서비스로 수정
    link: "https://www.themoviedb.org/movie/157336-interstellar",
    payment: null,
  },
  {
    movie_id: 4,
    title: "Phantom Detective",
    release_date: "2016-05-04",
    overview: "Private detective HONG Gil-dong is seeking revenge for his mother who was murdered in front of him when he was a child.",
    poster_path: phantomdetectiveImage,
    run_time: 125,
    genre: "Thriller",
    production_countries: "South Korea",
    vote_count: 1500,
    vote_average: 7.5,
    adult: false,
    flatrate: "Watcha, Disney Plus", // 선택 가능한 스트리밍 서비스로 수정
    link: "https://www.themoviedb.org/movie/398818-phantom-detective",
    payment: null,
  }
];
