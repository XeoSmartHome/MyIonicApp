import React, {FC, useCallback} from 'react';
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/react';
import "./MovieCard.css";
import {Movie} from "../../api/generated";
import {useHistory} from "react-router-dom";

interface MovieCardProps {
    movie: Movie
}

const MovieCard: FC<MovieCardProps> = ({movie}) => {
    const history = useHistory();

    const goToMovieDetails = useCallback(() => {
        history.push(`/movies/${movie.id}`);
    }, [history, movie.id]);

    return (
        <IonCard onClick={goToMovieDetails}>
            <IonCardHeader>
                <IonCardTitle>{movie.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {movie.description}
            </IonCardContent>
        </IonCard>
    );
}
export default MovieCard;
