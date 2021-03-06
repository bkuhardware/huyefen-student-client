import TEACHERS from '@/assets/fakers/teachers';
import OLD_TEACHERS from '@/assets/fakers/oldTeachers';
import { delay } from '@/utils/utils';

export default {
    namespace: 'teachers',
    state: {
        hasMore: true,
        list: null
    },
    effects: {
        *fetch(action, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'save',
                payload: {
                    hasMore: true,
                    data: TEACHERS
                }
            });
        },
        *more(action, { call, put, select }) {
            const { list } = yield select(state => state.teachers);
            yield delay(1300);
            yield put({
                type: 'push',
                payload: {
                    hasMore: false,
                    data: OLD_TEACHERS
                }
            })
        },
        *all(action, { call, put, select }) {
            const { list } = yield select(state => state.teachers);
            yield delay(1300);
            yield put({
                type: 'push',
                payload: {
                    hasMore: false,
                    data: OLD_TEACHERS
                }
            });
        }
    },
    reducers: {
        save(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                hasMore,
                list: [...data]
            }
        },
        push(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                hasMore,
                list: [
                    ...state.list,
                    ...data
                ]
            };
        },
        reset() {
            return { hasMore: true, list: null };
        }
    }
}