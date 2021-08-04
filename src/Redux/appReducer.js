
import { USER_AUTH } from '../Utils/UserAuth';

const initialState = {
    name: '',
    permissions: USER_AUTH.get().userInfo != null? USER_AUTH.get().userInfo.permissions: [],
    btnsColor: {
        moviesBtn: 'default',
        subscriptionsBtn: 'default',
        adminBtn: 'default'
    }
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case "NAME":
            return { ...state, name: action.payload};

        case "PERMISSIONS":
            return { ...state, permissions: action.payload};

        case "CHANGE_MENU_BTN_COLOR":
            return { ...state, btnsColor: action.payload};

        case "CHANGE_SUBMENU_BTN":
            return { ...state, btnsColor: action.payload };

        case "USER_LOGOUT":
            return initialState ;
        
        default:
            return state;
    }
}

export default appReducer;