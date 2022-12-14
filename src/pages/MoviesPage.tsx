import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import './Tab1.css';
import MoviesList from "../components/Movies/MoviesList";
import {useSelector} from "react-redux";
import {selectMovies} from "../store/reducers/movies/selectors";
import React, {useEffect} from "react";
import {useAppDispatch} from "../store";

const MoviesPage: React.FC = () => {
    const movies = useSelector(selectMovies);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // dispatch(getMoviesAction())
    }, []);


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Movies</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Movies</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonButton href={"/movie-editor"}>
                    Add movie
                </IonButton>
                <MoviesList movies={[]}/>
            </IonContent>
        </IonPage>
    );
};

export default MoviesPage;
