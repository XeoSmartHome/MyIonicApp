import '../ExploreContainer.css';
import React, {FC} from "react";
import MovieCard from "./MovieCard";
import {Movie} from "../../types/movie";

interface MoviesListProps {
    movies: Movie[]
}

const MoviesList: FC<MoviesListProps> = ({ movies }) => {
    return (
        <div className="container">
            {
                movies.map((movie) => <MovieCard key={movie.id} movie={movie}/>)
            }
        </div>
    );
};

export default MoviesList;
