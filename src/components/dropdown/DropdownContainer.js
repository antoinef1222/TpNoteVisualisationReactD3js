import './Dropdown.css'
import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

/**
 * Composant permettant d'afficher un menu de sélection
 * @param {*} param0 Objet {fonction de modification onChange, liste des valeurs, placeholder de l'input, index par défaut}
 * @returns Renvoie un menu déroualtn
 */
function DropdownContainer({onChange, listValue, placeholder, icons, indexDefaultValue=0}){

    // --- VARIABLES ---

    // Gestion de la sélection d'un item
    const [dropdownValue, setDropdownValue] = useState(listValue[indexDefaultValue]);
    

  
    // --- USE-EFFECT---

    /**
     * useEffect appelé à chaque fois que la valeur sélectionnée change
     * Ici, on met à jour la valeur du sélecteur passé en paramètre
     */
    useEffect(() => {
        const index = listValue.indexOf(dropdownValue);
        if (index !== -1)
            onChange(index);
        
    },[dropdownValue, listValue, onChange]);



    // --- COMPOSANT---

    // AAffichage d'un menu déroulant
    return(
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
            {icons}
        </span>
        <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={listValue} optionLabel="name" 
            placeholder={placeholder} className="w-full md:w-14rem" />
      </div>
    )
}

export default DropdownContainer;