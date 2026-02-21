import './App.css';
import { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getDataSet } from './redux/DataSetSlice'
import ScatterplotContainer from './components/scatterplot/ScatterplotContainer';
import DropdownXLabel from './components/dropdown/DropdownXLabel';
import DropdownYLabel from './components/dropdown/DropdownYLabel';
import DropdownHierarchy from './components/dropdown/DropdownHierarchy';
import TreeContainer from './components/treeCluster/TreeContainer';
import ClusterContainer from './components/treeCluster/ClusterContainer';

        
/**
 * Composant principale de l'application
 * Dans celui-ci, on récupère les données et des csv et on affiche l'ensemble des graphes
 * @returns Renvoie un composant représentant l'application
 */
function App() {

  // --- VARIABLES ---

  // Récupération de la liste des hiérarchies
  const dropdownHierarchyValues = useSelector(state => state.hierarchyInteraction.hierarchies);
  
  // Récupération de l'index de sélectionné pour une hiérarchie
  const selectedHierarchy = useSelector(state => state.hierarchyInteraction.selectedHierarchy);

  // Récupération des données du store
  const dispatch = useDispatch();
    
  // Gestion de la sélection d'un item
  const [hierarchyComponent, setHierarchyComponent] = useState(<></>);


  // --- FONCTION ---

  /**
   * Chargement d'une hiérarchie en fonction de la sélection du dropdown
   * @param {*} nameHierarchy Nom de la hiérarchie
   * @returns Renvoie un composant représentant le graphe
   */
  const loadHierarchy = (nameHierarchy) => {
    switch (nameHierarchy) {
      case "tree":
        return <TreeContainer></TreeContainer>
        break;

      case "cluster":
        return <ClusterContainer></ClusterContainer>
        break;

      case "partition":
        return <></>
        break;

      case "pack":
        return <></>
        break;

      case "treemap":
        return <></>
        break;
    
      default:
        return <></>
        break;
    }
  }

  
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

  /**
   * useEffect mettant automatiquement à jour le graphe lorsque le joueur choisit de changer de visualisation
   */
  useEffect(()=>{
      setHierarchyComponent(loadHierarchy(dropdownHierarchyValues[selectedHierarchy]));
  },[dropdownHierarchyValues, selectedHierarchy])


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
        {hierarchyComponent}
      </div>
    </div>
  );
}

export default App;