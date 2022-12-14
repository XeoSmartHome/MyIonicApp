import React, {ComponentProps, FC, useCallback} from "react";
import {IonInput, IonItem, IonLabel, IonNote} from "@ionic/react";
import {Controller, RegisterOptions} from "react-hook-form";
import {ControllerProps} from "react-hook-form/dist/types/controller";

interface CTextInputProps extends ComponentProps<typeof IonInput> {
    name: string;
    control: any;
    rules?: RegisterOptions;
    label?: ComponentProps<typeof IonLabel>["children"];
}

const CTextInput: FC<CTextInputProps> = ({name, control, rules, label, ...props}) => {

    const render = useCallback<ControllerProps["render"]>(({field: {onChange, value, onBlur, ref, name}, fieldState: {error}}) => {
        return (
            <IonItem>
                <IonLabel position="floating">
                    {label}
                </IonLabel>
                <IonInput
                    value={value}
                    onIonInput={(event) => onChange(event.target.value)}
                    onIonBlur={onBlur}
                    ref={ref}
                    name={name}
                    color={"red"}
                    {...props}
                />
                <IonNote slot={"helper"} color={"danger"}>{error?.message}</IonNote>
            </IonItem>
        );
    }, [control, name]);

    return (
        <Controller render={render} name={name} control={control} rules={rules}/>
    );
}

export default CTextInput;
