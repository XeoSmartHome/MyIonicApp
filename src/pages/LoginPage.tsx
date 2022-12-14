import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast} from '@ionic/react';
import {FC, useCallback} from "react";
import CTextInput from "../components/Common/CTextInput";
import {useForm} from "react-hook-form";
import {Link, useHistory} from "react-router-dom";
import {EMAIL_REGEX} from "../utils/regex";
import {useAppDispatch} from "../store";
import {loginAction} from "../store/reducers/user/actions";

const EMAIL_RULES = {
    required: {value: true, message: "Email is required"},
    patters: {value: EMAIL_REGEX, message: "Invalid email format"}
};

const PASSWORD_RULES = {required: {value: true, message: "Password is required"}};

const LoginPage: FC = () => {
    const [showToast] = useIonToast();
    const dispatch = useAppDispatch();
    const history = useHistory();

    const {control, handleSubmit, getValues} = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const login = useCallback(() => {
        dispatch(loginAction(getValues())).unwrap().then(() => {
            showToast({
                message: "Login success",
                duration: 2000
            });
            history.replace("/movies");
        }).catch((error) => {
            showToast({
                message: error.message,
                duration: 2000
            });
        });
    }, [dispatch, getValues, showToast]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen={true} className={"ion-padding"}>
                <CTextInput control={control} name={"email"} type={"email"} rules={EMAIL_RULES} label={"Email"}/>
                <CTextInput control={control} name={"password"} type={"password"} rules={PASSWORD_RULES}
                            label={"Password"}/>
                <IonButton onClick={handleSubmit(login)}>
                    Login
                </IonButton>

                <Link to={"/create-account"}>
                    <IonButton fill={"outline"}>
                        Create account
                    </IonButton></Link>
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;
