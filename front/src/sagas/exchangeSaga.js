import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';
import axios from 'axios';
import { apiUrl } from '../config';
import { 
  API_CALL_SUCCESS,
  API_CALL_FAILURE,
  API_CALL_REQUEST
} from '../actions';


const getState = (state) => state;

const fetch = (action) => {
  const { params, route } = action;
  return axios.get(`${apiUrl}/${route}`, { 
    params
  });
}

function* workerSaga(action) {
  try {
    const { data } = yield call(fetch, action);
    const curState = yield select(getState);
    yield put({ type: API_CALL_SUCCESS, data });
  } catch (error) {
    yield put({ type: API_CALL_FAILURE, error });
  }
}

export default function* exchangeSaga() {
  yield takeLatest(API_CALL_REQUEST, workerSaga);
}
