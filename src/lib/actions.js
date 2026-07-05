export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";
export const FETCH_HOME_DATA_SUCCESS = "FETCH_HOME_DATA_SUCCESS";

export const fetchDataRequest = (loading = true) => ({
	type: FETCH_DATA_REQUEST,
	loading,
});

export const fetchDataSuccess = (data) => ({
	type: FETCH_DATA_SUCCESS,
	payload: data,
});

export const fetchDataFailure = (error) => ({
	type: FETCH_DATA_FAILURE,
	payload: error,
});

export const fetchHomeDataSuccess = (data) => ({
	type: FETCH_HOME_DATA_SUCCESS,
	payload: data,
});
