import {IonButton, IonInput, IonItem, IonLabel, IonList, IonTextarea} from "@ionic/react";
import React, {useCallback, useState} from "react";
import {createMovieAction} from "../store/reducers/movies/actions";
import {useAppDispatch} from "../store";

const MovieDetailsPage = () => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState<string | undefined | number | null>("");
    const [description, setDescription] = useState<string | undefined | number | null>("");
    const [actors, setActors] = useState<string | undefined | number | null>("");
    const [tags, setTags] = useState<string | undefined | number | null>("");

    const addMovie = useCallback(() => {

    }, [dispatch, title, description, actors, tags]);

    return (
        <IonList>
            <IonItem>
                <IonLabel>Title</IonLabel>
                <IonInput placeholder={"Title"} onIonInput={e => setTitle(e.target.value)}/>
            </IonItem>
            <IonItem>
                <IonLabel>Description</IonLabel>
                <IonTextarea placeholder={"Description"} onIonChange={e => setDescription(e.target.value)}/>
            </IonItem>
            <IonItem>
                <IonLabel>Actors</IonLabel>
                <IonInput placeholder={"Actors"} onIonChange={e => setActors(e.target.value)}/>
            </IonItem>
            <IonItem>
                <IonLabel>Tags</IonLabel>
                <IonInput placeholder={"tags"} onIonChange={e => setTags(e.target.value)}/>
            </IonItem>
            <IonButton onClick={addMovie}>
                Add movie
            </IonButton>
        </IonList>
    )
}

export default MovieDetailsPage;
