import { createSlice } from '@reduxjs/toolkit'


/**
 * Slicer gérant la sélection de label pour les graphes
 * Les données de cet object sont accesibles partout dans l'application
 */
export const labelInteractionSlice = createSlice({

  // Nom du slicer dans le store
  name: 'labelInteraction',

  // Données utilisées
  initialState: {
    xLabel: 0,
    yLabel: 2,
    labels: [
        "population",
        "medIncome",
        "ViolentCrimesPerPop"
    ]
  },
  
  // Fonction utilisable depuis le reducer
  reducers: {

    /**
     * Modification du label X
     */
    setXLabel: (state, action) => {
      state.xLabel = action.payload
    },

    /**
     * Modification du label Y
     */
    setYLabel: (state, action) => {
      state.yLabel = action.payload
    }
  },
});

// Exportation de la fonction de sélection
export const { setXLabel, setYLabel } = labelInteractionSlice.actions;

// Exploration du state sous la forme de reducer
export default labelInteractionSlice.reducer;