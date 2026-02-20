import {useSelector, useDispatch} from 'react-redux'
import DropdownContainer from './DropdownContainer';
import { setYLabel } from '../../redux/LabelInteractionSlice';


/**
 * Composant permettant d'afficher un menu déroulant pour le label Y
 * @returns Renvoie un menu déroulant
 */
function DropdownYLabel(){

    // --- VARIABLES ---

    // Récupération de la liste des labels depuis le store
    const dropdownLabelValues = useSelector(state => state.labelInteraction.labels);
    
    // Récupération de l'index du label par défaut
    const yLabelDefaultValue = useSelector(state => state.labelInteraction.yLabel);

    // Récupération des données du store
    const dispatch = useDispatch();



    // --- COMPOSANT---

    // Affichage du menu déroulant
    return(
        <DropdownContainer listValue={dropdownLabelValues} placeholder={"Axe des Y"} icons={<b>Y</b>}
            indexDefaultValue={yLabelDefaultValue} onChange={(value) => {
                dispatch(setYLabel(value))
            }}
        ></DropdownContainer>
    )
}

export default DropdownYLabel;