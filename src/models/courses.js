import _ from 'lodash';
import * as myCoursesServices from '@/services/myCourses';
import { fetchFriendsForRecommend, recommendCourseForFriends } from '@/services/friend';
import MY_COURSES from '@/assets/fakers/mycourses';
import FRIENDS from '@/assets/fakers/topFriends';
import { delay } from '@/utils/utils';

const CATEGORIES = [
    {
        _id: 1,
        title: 'Web Development'
    },
    {
        _id: 2,
        title: 'Machine Learning'
    },
    {
        _id: 3,
        title: 'Marketing'
    },
    {
        _id: 4,
        title: 'Career Development'
    }
];

const PROGRESSES = [
    {
        key: 'not-started',
        title: 'Not started'
    },
    {
        key: 'inprogress',
        title: 'Inprogress'
    },
    {
        key: 'completed',
        title: 'Completed'
    }
];

const INSTRUCTORS = [
    {
        _id: 1,
        name: 'Ngoc Hanh Vuong'
    },
    {
        _id: 2,
        name: 'Phuoc Nguyen Ho Minh'
    },
    {
        _id: 3,
        name: 'Minh Tran Quang'
    },
    {
        _id: 4,
        name: 'Manh Le Duc'
    },
    {
        _id: 5,
        name: 'Huy Tran Canh'
    },
    {
        _id: 6,
        name: 'Khang Nguyen An'
    }
];

const initialState = {
    friends: {
        total: null,
        list: null
    },
    sortBy: 'a-z',
    category: null,
    progress: null,
    instructor: null,
    filters: {
        categories: null,
        progresses: null,
        instructors: null,
    },
    loadMore: true,
    list: null
};

export default {
    namespace: 'courses',
    state: initialState,
    effects: {
        *fetch(action, { call, put, select }) {
            const { sortBy } = yield select(state => state.courses);
            const response = yield call(myCoursesServices.fetchMyCourses, sortBy);
            if (response) {
                yield put({
                    type: 'saveMyCourses',
                    payload: response.data
                })
            }
        },
        *fetchFriends(action, { call, put }) {
            const response = yield call(fetchFriendsForRecommend);
            if (response) {
                yield put({
                    type: 'saveFriends',
                    payload: response.data
                });
            }
        },
        *fetchOptions(action, { call, put }) {
            yield delay(1000);
            yield put({
                type: 'saveOptions',
                payload: {
                    categories: CATEGORIES,
                    progresses: PROGRESSES,
                    instructors: INSTRUCTORS
                }
            })
        },
        *sort({ payload: sortBy }, { call, put, select }) {
            const { category, progress, instructor } = yield select(state => state.courses);
            const response = yield call(myCoursesServices.fetchMyCourses, sortBy);
            if (response) {
                yield put({
                    type: 'saveSortByType',
                    payload: sortBy
                });
                yield put({
                    type: 'saveMyCourses',
                    payload: response.data
                });
            }
        },
        *filter({ payload }, { call, put, select }) {
            const { sortBy } = yield select(state => state.courses);
            const { category = null, progress = null, instructor = null } = payload;
            //filter with sortBy, pagination = 1. 
            yield delay(1600);
            // yield put({
            //     type: 'save',
            //     payload: MY_COURSES
            // });
            yield put({
                type: 'saveFilters',
                payload: {
                    category, progress, instructor
                }
            });
        },
        *reset(action, { call, put, select }) {
            const { sortBy } = yield select(state => state.courses);
            yield put({
                type: 'fetchOptions'
            });
            yield delay(2000);
            yield put({
                type: 'save',
                payload: MY_COURSES
            });
            yield put({
                type: 'saveFilters',
                payload: {
                    category: null,
                    progress: null,
                    instructor: null
                }
            });
        },
        *moreCourses(action, { call, put, select }) {
            const {
                sortBy,
                category,
                instructor,
                progress,
                list
            } = yield select(state => state.courses);
            const response = yield call(myCoursesServices.fetchMyCourses, sortBy, list.length);
            if (response) {
                yield put({
                    type: 'pushMyCourses',
                    payload: response.data
                })
            }
        },
        *allCourses(action, { call, put, select }) {
            const {
                sortBy,
                category,
                instructor,
                progress,
                list
            } = yield select(state => state.courses);
            const response = yield call(myCoursesServices.fetchMyCourses, sortBy, list.length, -1);
            if (response) {
                yield put({
                    type: 'pushMyCourses',
                    payload: response.data
                })
            }
        },
        *fetchCategories({ payload }, { call, put }) {
            const {
                progress = null,
                instructor = null
            } = payload;
            //fetch categories with instructor, progress
            yield delay(1200);
            yield put({
                type: 'saveCategories',
                payload: _.slice(CATEGORIES, 0, 3)
            });
        },
        *fetchProgresses({ payload }, { call, put }) {
            const {
                category = null,
                instructor = null
            } = payload;
            //
            yield delay(1400);
            yield put({
                type: 'saveProgresses',
                payload: _.slice(PROGRESSES, 0, 1)
            });
        },
        *fetchInstructors({ payload }, { call, put }) {
            const {
                category = null,
                progress = null
            } = payload;
            //
            yield delay(1300);
            yield put({
                type: 'saveInstructors',
                payload: _.slice(INSTRUCTORS, 0, 4)
            });
        },
        *addFriends({ payload }, { call, put }) {
            const { start, end, callback } = payload;
            const skip = start * 5;
            const limit = (end - start) * 5;
            const response = yield call(fetchFriendsForRecommend, skip, limit);
            if (response) {
                yield put({
                    type: 'pushFriends',
                    payload: response.data.list
                });
                if (callback) callback();
            }
        },
        *recommend({ payload }, { call, put }) {
            const { selectedFriendIds, courseId, callback } = payload;
            const response = yield call(recommendCourseForFriends, courseId, selectedFriendIds);
            if (response) {
                if (callback) callback();
            }
        }
    },
    reducers: {
        saveMyCourses(state, { payload }) {
            return { ...state, ...payload };
        },
        saveOptions(state, { payload }) {
            return {
                ...state,
                filters: { ...payload }
            };
        },
        saveSortByType(state, { payload: sortBy }) {
            return {
                ...state,
                sortBy
            }
        },
        clear() {
            return { ...initialState };
        },
        saveFilters(state, { payload }) {
            return { ...state, ...payload };
        },
        pushMyCourses(state, { payload }) {
            const { hasMore, list: newCourses } = payload;
            return {
                ...state,
                hasMore,
                list: [
                    ...state.list,
                    ...newCourses
                ]
            };
        },
        saveCategories(state, { payload: categories }) {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    categories
                }
            }
        },
        saveProgresses(state, { payload: progresses }) {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    progresses
                }
            }
        },
        saveInstructors(state, { payload: instructors }) {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    instructors
                }
            }
        },
        saveFriends(state, { payload }) {
            return {
                ...state,
                friends: { ...payload }
            };
        },
        pushFriends(state, { payload: newFriends }) {
            return {
                ...state,
                friends: {
                    ...state.friends,
                    list: [
                        ...state.friends.list,
                        ...newFriends
                    ]
                }
            }
        }
    }
}