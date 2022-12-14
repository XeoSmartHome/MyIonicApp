import {IonButton, IonDatetime, IonList, useIonToast} from "@ionic/react";
import React, {FC, useCallback} from "react";
import {createMovieAction, updateMovieAction} from "../store/reducers/movies/actions";
import {useAppDispatch, useAppSelector} from "../store";
import {Controller, useForm} from "react-hook-form";
import CTextInput from "../components/Common/CTextInput";
import {selectMovieById} from "../store/reducers/movies/selectors";
import {useHistory} from "react-router-dom";

const GENERIC_RULES = {required: {value: true, message: "This field is required"}};

interface MovieDetailsPageProps {
    scope: "CREATE" | "EDIT";
}

const MovieDetailsPage: FC<MovieDetailsPageProps> = ({scope}) => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const movie = useAppSelector(selectMovieById(history.location.pathname.split("/").at(-1) || ""));
    const [showToast] = useIonToast();

    const {control, getValues, handleSubmit} = useForm({
        defaultValues: scope === "CREATE" && !movie ? {
            title: "",
            description: "",
            year: 2022,
            location: "acasa",
            actors: [],
            date: new Date().toLocaleDateString()
        } : movie,
    });

    const addMovie = useCallback(() => {
        dispatch(createMovieAction({
            ...getValues(),
            id: '',
        })).unwrap().then(
            () => {
                showToast({
                    message: "Movie added successfully",
                    duration: 2000,
                    color: "success",
                });
                history.goBack();
            }
        ).catch((error) => {
            showToast({
                message: error,
                duration: 2000,
                color: "danger",
            });
        });
    }, [dispatch, getValues, history, showToast]);

    const updateMovie = useCallback(() => {
        dispatch(updateMovieAction({
            ...getValues(),
            id: movie?.id || "",
            date: new Date().toLocaleDateString()
        })).unwrap().then(
            () => {
                showToast({
                    message: "Movie updated successfully",
                    duration: 2000,
                    color: "success",
                });
                history.goBack();
            }).catch((error) => {
            showToast({
                message: error,
                duration: 2000,
                color: "danger",
            });
        });
    }, [dispatch, getValues, history, movie, showToast]);

    return (
        <IonList className={"ion-padding"}>
            <CTextInput name={"title"} control={control} rules={GENERIC_RULES} label={"Title"}/>
            <CTextInput name={"description"} control={control} rules={GENERIC_RULES} label={"Description"}/>
            <CTextInput name={"year"} type={"number"} control={control} rules={GENERIC_RULES} label={"Year"}/>
            <Controller control={control} render={({field: {value, onChange, onBlur, ref}}) => {
                return (
                    <IonDatetime
                        ref={ref}
                        value={value}
                        onIonChange={(event) => {
                            onChange(event.detail.value);
                        }}
                        onIonBlur={onBlur}
                    />
                )
            }} name={"date"}/>
            <IonButton onClick={handleSubmit(scope === "CREATE" ? addMovie: updateMovie)}>
                Add movie
            </IonButton>
        </IonList>
    )
}

export default MovieDetailsPage;
