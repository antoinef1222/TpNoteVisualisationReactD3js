import {useSelector, useDispatch} from 'react-redux'
import DropdownContainer from './DropdownContainer';
import { setXLabel } from '../../redux/LabelInteractionSlice';


/**
 * Composant permettant d'afficher un menu déroulant pour le label X
 * @returns Renvoie un menu déroulant
 */
function DropdownXLabel(){

    // --- VARIABLES ---

    // Récupération de la liste des labels depuis le store
    const dropdownLabelValues = useSelector(state => state.labelInteraction.labels);
    
    // Récupération de l'index du label par défaut
    const xLabelDefaultValue = useSelector(state => state.labelInteraction.xLabel);

    // Récupération des données du store
    const dispatch = useDispatch();



    // --- COMPOSANT---

    // Affichage du menu déroulant
    return(
        <DropdownContainer listValue={dropdownLabelValues} placeholder={"Axe des X"} icons={<b>X</b>}
            indexDefaultValue={xLabelDefaultValue} onChange={(value) => {
                dispatch(setXLabel(value))
            }}
        ></DropdownContainer>
    )
}

export default DropdownXLabel;