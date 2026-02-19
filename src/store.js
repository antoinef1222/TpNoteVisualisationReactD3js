import { configureStore } from '@reduxjs/toolkit'
import dataSetReducer from './redux/DataSetSlice'
import itemInteractionReducer from './redux/ItemInteractionSlice'

/**
 * Exportation du store
 * Le store est une méthode qui regroupe tous les state de l'application dans une arborescence
 */
export default configureStore({
  reducer: {
    dataSet: dataSetReducer,
    itemInteraction: itemInteractionReducer,
  }
})