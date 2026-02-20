import { createSlice } from '@reduxjs/toolkit'


/**
 * Slicer gérant la sélection d'élément dans le graphe
 * Les données de cet object sont accesibles partout dans l'application
 */
export const itemInteractionSlice = createSlice({

  // Nom du slicer dans le store
  name: 'itemInteraction',

  // Données utilisées
  initialState: {
    selectedItems: []
  },
  
  // Fonction utilisable depuis le reducer
  reducers: {

    /**
     * Modification de l'item sélectionné
     */
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
  },
});

// Exportation de la fonction de sélection
export const { setSelectedItems } = itemInteractionSlice.actions;

// Exploration du state sous la forme de reducer
export default itemInteractionSlice.reducer;