import { DashboardMovie, Movie } from '../models/movie'

export const getDashboardMovies = (n) => {
    let sampleMovie = new DashboardMovie(
        "Chem gio (2D Thuyet minh)",
        "Tau hai",
        "Riot",
        "Nigamon Nguyen Van Cu",
        "16:45"
    )
    return new Array(n).fill(sampleMovie)
}

export const getMovies = (n, options) => {
    let movies = [];
    while (movies.length < n) {
        let start = new Date(`2019/0${Math.floor(Math.random() * 9) + 1}/0${Math.floor(Math.random() * 9) + 1}`);
        start.setHours(0, 0, 0, 0);
        let end = new Date(`2019/0${Math.floor(Math.random() * 9) + 1}/0${Math.floor(Math.random() * 9) + 1}`);
        end.setHours(23, 59, 59, 9999);
        if (start > end)
            continue;
        movies.push(new Movie(
            movies.length + 1,
            `Chem gio ${movies.length + 1}`,
            'Riot',
            'Riven',
            Math.floor(Math.random() * 5) + 1,
            180,
            start,
            end,
            'Gioi thieu phim',
            'https://www.fosi.org/media/images/22601782810_cbe3ede5f5_o.focus-none.original.jpg'
        ));
    }
    return movies
}