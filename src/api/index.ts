import {Configuration, DefaultApi} from "./generated";
import {getStore} from "../store/refference";

export const apiClient = new DefaultApi(new Configuration({
    apiKey: () => {
        return getStore()?.getState().user.accessToken;
    }
}));
