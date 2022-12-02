import { Route} from 'react-router-dom';
import {
    IonApp,
    setupIonicReact
} from '@ionic/react';
import {IonReactHashRouter, IonReactRouter} from '@ionic/react-router';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {StoreProvider} from "./store";
import MovieEditor from "./pages/MovieEditor";
import MoviesPage from "./pages/MoviesPage";
import {WebSocketConnection} from "./components/WebSocketConnection";
import React from "react";

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <StoreProvider>
            <WebSocketConnection/>
            <IonReactRouter>
                <Route exact path={"/movies"}>
                    <MoviesPage/>
                </Route>
                <Route path={"/movie-editor"}>
                    <MovieEditor/>
                </Route>
            </IonReactRouter>
        </StoreProvider>
    </IonApp>
);

export default App;
