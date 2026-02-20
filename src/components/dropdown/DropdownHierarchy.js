import {useSelector, useDispatch} from 'react-redux'
import DropdownContainer from './DropdownContainer';
import { setHierarchy } from '../../redux/HierarchyInteraction';
import QueryStatsIcon  from '@mui/icons-material/QueryStats';


/**
 * Composant permettant d'afficher un menu déroulant pour la hiérarchie de graphe
 * @returns Renvoie un menu déroulant
 */
function DropdownHierarchy(){

    // --- VARIABLES ---

    // Récupération de la liste des hiérarchies depuis le store
    const dropdownHierarchyValues = useSelector(state => state.hierarchyInteraction.hierarchies);
    
    // Récupération de l'index du hiérarchie par défaut
    const hierarchyDefaultValue = useSelector(state => state.hierarchyInteraction.selectedHierarchy);

    // Récupération des données du store
    const dispatch = useDispatch();



    // --- COMPOSANT---

    // Affichage du menu déroulant
    return(
        <DropdownContainer listValue={dropdownHierarchyValues} placeholder={"Sélection de la hiérarchie de graphe"} icons={<QueryStatsIcon fontSize="medium" />}
            indexDefaultValue={hierarchyDefaultValue} onChange={(value) => {
                dispatch(setHierarchy(value))
            }}
        ></DropdownContainer>
    )
}

export default DropdownHierarchy;