import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast} from '@ionic/react';
import {FC, useCallback} from "react";
import CTextInput from "../components/Common/CTextInput";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import {EMAIL_REGEX} from "../utils/regex";
import {useAppDispatch} from "../store";
import {createAccountAction} from "../store/reducers/user/actions";

const FIRST_NAME_RULES = {required: {value: true, message: "First name is required"}};

const LAST_NAME_RULES = {required: {value: true, message: "Last name is required"}};

const EMAIL_RULES = {
    required: {value: true, message: "Email is required"},
    patters: {value: EMAIL_REGEX, message: "Invalid email format"}
};

const PASSWORD_RULES = {required: {value: true, message: "Password is required"}};

const CreateAccountPage: FC = () => {
    const [showToast] = useIonToast();
    const dispatch = useAppDispatch();

    const {control, handleSubmit, getValues} = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        }
    });

    const createAccount = useCallback(() => {
        dispatch(createAccountAction({id: "", ...getValues()})).unwrap().then(() => {
            showToast({
                message: "Account created successfully",
                duration: 2000,
                color: "success",
            });
        }).catch((error) => {
            showToast({
                message: error,
                duration: 2000,
                color: "danger",
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
                <CTextInput control={control} name={"firstName"} rules={FIRST_NAME_RULES} type={"email"}
                            label={"First name"}/>
                <CTextInput control={control} name={"lastName"} rules={LAST_NAME_RULES} type={"password"}
                            label={"Last name"}/>
                <CTextInput control={control} name={"email"} rules={EMAIL_RULES} label={"Email"}/>
                <CTextInput control={control} name={"password"} type={"password"} rules={PASSWORD_RULES}
                            label={"Password"}/>
                <CTextInput control={control} name={"confirmPassword"} type={"password"} rules={PASSWORD_RULES}
                            label={"Confirm password"}/>
                <IonButton onClick={handleSubmit(createAccount)}>
                    Create account
                </IonButton>

                <Link to={"/login"}>
                    <IonButton fill={"outline"}>
                        Login
                    </IonButton></Link>
            </IonContent>
        </IonPage>
    );
};

export default CreateAccountPage;
