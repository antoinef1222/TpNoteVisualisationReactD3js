import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Papa from "papaparse"

/**
 * Récupération des données du fichier communities.csv
 * Utilisation de Thunk afin de gérer le fetch du fichier et afin d'injecter directement les données dans le reducer
 * @returns Renvoie les données mappées sous la forme d'objet avec un index
 */
export const getDataSet = createAsyncThunk('communities/fetchData', async (args, thunkAPI) => {
  try {

    // Récupération des données du fichier
    const response = await fetch('data/communities.csv');
    const responseText = await response.text();
    console.log("loaded file length:" + responseText.length);

    // Parsage des données avec typage automatique
    const responseJson = Papa.parse(responseText,{header:true, dynamicTyping:true});

    // Renvoie des données avec l'ajout d'un index pour les identifier
    return responseJson.data.map((item,i)=>{return {...item,index:i}});
  }

  // En cas d'erreur, on renvoie une thunkAPI.rejectWithValue
  catch(error) {
    console.error("error catched in asyncThunk" + error);
    return thunkAPI.rejectWithValue(error)
  }
});


/**
 * Slicer gérant la récupération des données csv
 * Les données de cet object sont accesibles partout dans l'application
 */
export const dataSetSlice = createSlice({

  // Nom du slicer dans le store
  name: 'dataSet',

  /**
   * Données utilisées
   * Les données prennent la forme d'un tableau, alors on instancie [] au lieu d'un objet
   */
  initialState: [],

  /**
   * Gestion des états de Thunk
   * Chaque état correspond à un status de la requête fetch (pending, fulfilled, rejected)
   */
  extraReducers: builder => {

    // Cas - Chargement des donneés
    builder.addCase(getDataSet.pending, (state, action) => {
      console.log("extraReducer getDataSet.pending");
    });

    /**
     * Cas - Les données ont été chargées avec succès
     * On sauvegarde les données dans le initialState en remplaçant les données existantes
     */
    builder.addCase(getDataSet.fulfilled, (state, action) => {
      return action.payload;
    });

    // Cas - Echecs du chargement des données
    builder.addCase(getDataSet.rejected, (state, action) => {
      console.log("extraReducer getDataSet.rejected with error" + action.payload);
    })
  }
});

// Exploration du state sous la forme de reducer
export default dataSetSlice.reducer;