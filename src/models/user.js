import { delay } from '@/utils/utils';
import storage from '@/utils/storage';
import router from 'umi/router';

const USER = {
    token: 'foo-token',
    name: 'Ngoc Hanh Vuong',
    avatar: null,
    email: 'ngochanhvuong@gmail.com',
    phone: '0919079306',
    gender: 'female',
    birthday: '21/12/1997',
    facebook: 'facebook.com/ngochanhvuong',
    linkedin: null,
    job: 'student',
    noOfUsMessage: 7,
    noOfUsNotification: 2
};

const response = {
    data: USER
}

export default {
    namespace: 'user',
    state: null,
    effects: {
        *fetch({ payload }, { call, put }) {
            const { callback } = payload;
            yield delay(1400);
            yield put({
                type: 'save',
                payload: USER
            });
            if (callback) callback();
            //set FCM token.
        },
        *login({ from, payload }, { call, put }) {
            const { phone, password } = payload;
            yield delay(1600);
            if (response) {
                const { data: user } = response;
                const token = user.token;
                storage.setToken(token);
                yield put({
                    type: 'save',
                    payload: user
                });
                //set FCM token
                router.replace(from);
            }
        },
        *register({ payload }, { call }) {
            yield delay(2000);
            router.push('/user/login');
        },
        *logout(action, { put }) {
            storage.setToken(null);
            yield put({ type: 'reset' });
            router.push('/user/login');
        }
    },
    reducers: {
        save(state, { payload }) {
            return { ...payload };
        },
        saveNoUsMessage(state, { payload }) {
            return {
                ...state,
                noUsMessage: payload
            };
        },
        saveNoUsNotification(state, { payload }) {
            return {
                ...state,
                noUsNotification: payload
            };
        },
        reset() {
            return null;
        }
    }
}