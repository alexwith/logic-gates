import { configureStore } from "@reduxjs/toolkit";
import diagramReducer from "./reducers/diagramReducer";

export default configureStore({
  reducer: diagramReducer,
});
