import { createSlice } from '@reduxjs/toolkit'


/**
 * Slicer gérant la sélection d'une hiérarchie pour les graphes
 * Les données de cet object sont accesibles partout dans l'application
 */
export const hierarchyInteractionSlice = createSlice({

  // Nom du slicer dans le store
  name: 'hierarchyInteraction',

  // Données utilisées
  initialState: {
    selectedHierarchy: 0,
    hierarchies: [
        "tree",
        "cluster",
        "partition",
        "pack",
        "treemap"
    ]
  },
  
  // Fonction utilisable depuis le reducer
  reducers: {

    /**
     * Modification de la hiérarchie de graphe
     */
    setHierarchy: (state, action) => {
      state.selectedHierarchy = action.payload
    }
  },
});

// Exportation de la fonction de sélection
export const { setHierarchy } = hierarchyInteractionSlice.actions;

// Exploration du state sous la forme de reducer
export default hierarchyInteractionSlice.reducer;