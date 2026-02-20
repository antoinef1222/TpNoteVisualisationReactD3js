import './App.css';
import { useEffect} from 'react';
import { useDispatch } from 'react-redux'
import { getDataSet } from './redux/DataSetSlice'
import ScatterplotContainer from './components/scatterplot/ScatterplotContainer';
import DropdownXLabel from './components/dropdown/DropdownXLabel';
import DropdownYLabel from './components/dropdown/DropdownYLabel';
import DropdownHierarchy from './components/dropdown/DropdownHierarchy';

        
/**
 * Composant principale de l'application
 * Dans celui-ci, on récupère les données et des csv et on affiche l'ensemble des graphes
 * @returns Renvoie un composant représentant l'application
 */
function App() {

  // --- VARIABLES ---

  // Récupération des données du store
  const dispatch = useDispatch();

  
  // --- USE-EFFECT---

  /**
   * useEffect appelé à chaque modification de l'application (changement d'état ou de props)
   * On utilise cette fonction principalement pour le debug
   */
  useEffect(()=>{
      console.log("App useEffect (called each time App re-renders)");
  });

  /**
   * Dispatch ne changeant jamais, ce useEffect est exécutée une seule fois au démarrage de l'application
   * getDataSet() récupère les données stockées dans le fichier communities.csv et les stocks dans le store via le dispatch
   */
  useEffect(()=>{
      dispatch(getDataSet());
  },[dispatch])


  // --- COMPOSANT---

  /**
   * Composant à afficher dans la page
   * On regroupe ici tous les graphes à afficher
   */
  return (
    <div className="App">
      <div className='dropdown-menu'>
        <DropdownXLabel></DropdownXLabel>
        <DropdownYLabel></DropdownYLabel>
        <DropdownHierarchy></DropdownHierarchy>
      </div>

      <div id={"MultiviewContainer"} className={"row"}>
        <ScatterplotContainer/>
        <ScatterplotContainer/>
      </div>
    </div>
  );
}

export default App;