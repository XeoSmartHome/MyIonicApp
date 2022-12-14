import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast} from '@ionic/react';
import './Tab1.css';
import MoviesList from "../components/Movies/MoviesList";
import {useSelector} from "react-redux";
import {selectMovies} from "../store/reducers/movies/selectors";
import React, {useEffect} from "react";
import {useAppDispatch} from "../store";
import {getMoviesAction} from "../store/reducers/movies/actions";

const MoviesPage: React.FC = () => {
    const movies = useSelector(selectMovies);
    const dispatch = useAppDispatch();
    const [showToast] = useIonToast();

    useEffect(() => {
        dispatch(getMoviesAction({after: ""})).unwrap().then(
            () => {
                showToast({
                    message: "Movies loaded successfully",
                    duration: 2000,
                    color: "success",
                });
            }
        ).catch((error) => {
            showToast({
                message: error,
                duration: 2000,
                color: "danger",
            });
        });
    }, [dispatch, showToast]);


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
                <MoviesList movies={movies || []}/>
            </IonContent>
        </IonPage>
    );
};

export default MoviesPage;
