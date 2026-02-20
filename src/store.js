import { configureStore } from '@reduxjs/toolkit'
import dataSetReducer from './redux/DataSetSlice'
import itemInteractionReducer from './redux/ItemInteractionSlice'
import labelInteractionReducer from './redux/LabelInteractionSlice'
import hierarchyInteractionReducer from './redux/HierarchyInteraction'

/**
 * Exportation du store
 * Le store est une méthode qui regroupe tous les state de l'application dans une arborescence
 */
export default configureStore({
  reducer: {
    dataSet: dataSetReducer,
    itemInteraction: itemInteractionReducer,
    labelInteraction: labelInteractionReducer,
    hierarchyInteraction: hierarchyInteractionReducer
  }
})