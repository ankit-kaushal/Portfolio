import {
	FETCH_DATA_REQUEST,
	FETCH_DATA_SUCCESS,
	FETCH_DATA_FAILURE,
	FETCH_HOME_DATA_SUCCESS,
} from "./actions";

const initialState = {
	data: null,
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_DATA_REQUEST:
			return {
				...state,
				loading: action.loading,
				error: null,
			};
		case FETCH_DATA_SUCCESS:
			return {
				...state,
				loading: false,
				data: action.payload,
			};
		case FETCH_DATA_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case FETCH_HOME_DATA_SUCCESS:
			return {
				...state,
				homeData: action.payload,
			};
		default:
			return state;
	}
};

export default rootReducer;
