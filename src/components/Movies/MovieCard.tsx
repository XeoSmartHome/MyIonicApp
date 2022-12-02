import React, {FC} from 'react';
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/react';
import "./MovieCard.css";
import {Movie} from "../../types/movie";

interface MovieCardProps {
    movie: Movie
}

const MovieCard: FC<MovieCardProps> = ({movie}) => {
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>{movie.title}</IonCardTitle>
                <IonCardSubtitle>Today</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                {movie.description}
            </IonCardContent>
        </IonCard>
    );
}
export default MovieCard;
