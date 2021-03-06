import api from "../utils/api";
import { setAlert } from "./alert";
import axios from "axios";
import qs from "qs";
import moment from "moment";
import {
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_FAIL,
} from "./types";

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/api/v1/users/dashboard");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/api/v1/users/register", formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  try {
    const res = await api.post("/api/v1/users/login", body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout
export const logout = () => {
  console.log("logoutCalled");
  return { type: LOGOUT };
};

const appointmentAPI = {
  listClinics: () => {
    return api.get("/api/v1/clinics");
  },
  getSlots: (appointmentDate, clinicID) => {
    return api.get(
      `/api/v1/slots?appointmentDate=${moment(appointmentDate).format(
        "YYYY-MM-DD"
      )}&clinicID=${clinicID}`
    );
  },
  createAppointment: (clinicID, appointmentDate, timeslot) => {
    return api.post(`/api/v1/createmyappointment`, {
      clinic_id: clinicID,
      date: appointmentDate,
      time_slot: timeslot,
    });
  },

  cancelappt: () => {
    return api.delete("/api/v1/users/cancelappt");
  },
};

export default appointmentAPI;
