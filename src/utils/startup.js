import * as actionCreators from '../store/actions/actionCreators';
import { initStorage } from './storage';

/*
  Initial actions to dispatch:
  1. Hide spinner
  2. Load a project if there is a current one
*/
const initialSetup = (dispatch, storage) => {
  dispatch(actionCreators.hideSpinner());
};

export default initialSetup;
