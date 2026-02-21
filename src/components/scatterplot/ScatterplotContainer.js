import './Scatterplot.css'
import { useEffect, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import ScatterplotD3 from './Scatterplot-d3';
import { setSelectedItems } from '../../redux/ItemInteractionSlice'
import { hierarchy } from "d3-hierarchy";
import * as d3 from 'd3'
import { MapperHierarchy } from '../../utils/MapperHierarchy';

/**
 * Composant permettant d'afficher un nuage de point
 * @param {*} param0 Objet {string, string} indiquant les données sur l'axe des x et sur l'axe des y / Attention, il faut que les labels correspondent à une colonne du tableau de données
 * @returns Renvoie un nuage de point
 */
function ScatterplotContainer(){

    // --- VARIABLES ---

    /**
     * Variable d'écoute sur le changement des données
     * Elle permet de mettre à jour le graphe dès que les données sont modifiées
     */
    const scatterplotData = useSelector(state => state.dataSet);

    /**
     * Variable d'écoute sur la sélection
     * Elle permet de mettre à jour le graphe dès que des données sont sélectionnées
     */
    const selectedItems = useSelector(state => state.itemInteraction.selectedItems);

    // Récupération de la liste des labels depuis le store
    const dropdownLabelValues = useSelector(state => state.labelInteraction.labels);
    
    // Récupération de l'index du label x
    const xLabelValue = useSelector(state => state.labelInteraction.xLabel);
    
    // Récupération de l'index du label y
    const yLabelValue = useSelector(state => state.labelInteraction.yLabel);

    // Récupération des données du store
    const dispatch = useDispatch();

    /**
     * Référence vers la div contenant le graphe et le graphe
     * Le but de ces variables est de pouvoir manipuler des objets à la place de devoir les recréer à chaque modification
     */
    const divContainerRef = useRef(null);
    const scatterplotD3Ref = useRef(null)



    // --- FONCTIONS ---

    /**
     * Renvoie les dimensions du graphe
     * Par défaut, les dimensions sont 900 par 900
     * Mais, si le composant a un composant parent, alors on utilise la taille qu'il est affecté par le parent
     * @returns Renvoie un objet {width: number, height: number}
     */
    const getChartSize = () => {
        let width = 900;
        let height = 900;
        if(divContainerRef.current !== undefined){
            width=divContainerRef.current.offsetWidth;
            height=divContainerRef.current.offsetHeight;
        }
        return {width:width,height:height};
    }

  
    // --- USE-EFFECT---
  
    /**
     * useEffect appelé à chaque modification de l'application (changement d'état ou de props)
     * On utilise cette fonction principalement pour le debug
     */
    useEffect(() => {
        console.log("ScatterplotContainer useEffect (called each time matrix re-renders)");
    });


    /**
     * useEffect appelé après que le composant soit construit (utilisation du tableau vide en tant que liste de paramètre à observer)
     * On crée ici le nuage de point vierge à partir des dimensions
     * On définit également une fonction nettoyage pour éviter les fuites de mémoires
     */
    useEffect(() => {
        console.log("ScatterplotContainer useEffect [] called once the component did mount");

        // Création d'un nuage de point vierge
        const scatterplotD3 = new ScatterplotD3(divContainerRef.current);
        scatterplotD3.create({size:getChartSize()});

        // Mise à jour de la référence pointant vers le graphe
        scatterplotD3Ref.current = scatterplotD3;

        /**
         * Fonction de nettoyage
         * Cette fonction supprime le graphe lorsqu'il disparait de l'écran
         */
        return () => {
            console.log("ScatterplotContainer useEffect [] return function, called when the component did unmount...");
            const scatterplotD3 = scatterplotD3Ref.current;
            scatterplotD3.clear()
        }
    },[]);


    /**
     * useEffect appelé à chaque modification des données et des axes (dans notre cas, ce sera uniquement sur les données)
     * On instancie ici les évènements : clicks, hover et leave, puis on affiche le graphe
     */
    useEffect(() => {
        console.log("ScatterplotContainer useEffect with dependency [scatterplotData, xAttribute, yAttribute, scatterplotControllerMethods], called each time scatterplotData changes...");

        /**
         * Evènement au clic - Mise à jour de la valeur sélectionnée (ref)
         * @param {*} itemData Donnée du graphe cliquée
         */
        const handleOnClick = (itemData) => {
            dispatch(setSelectedItems([itemData]))
        }
        /**
         * Evènement au survol
         * @param {*} itemsData  Données sélectionnées
         */
        const handleSelection = (itemsData) => {
            dispatch(setSelectedItems(itemsData));
        }

        // Récupération de l'objet graphe via la référence
        const scatterplotD3 = scatterplotD3Ref.current;

        // Mise à jour du graphe
        scatterplotD3.renderScatterplot(scatterplotData, dropdownLabelValues[xLabelValue], dropdownLabelValues[yLabelValue], {
            handleOnClick,
            handleSelection
        });
    },[scatterplotData, xLabelValue, yLabelValue, dropdownLabelValues, dispatch]);


    /**
     * useEffect appelé à chaque fois que la valeur sélectionnée change
     * Ici, on met en évidence la donnée lorsqu'on la sélectionne
     */
    useEffect(() => {
        const scatterplotD3 = scatterplotD3Ref.current;
        scatterplotD3.highlightSelectedItems(selectedItems);
    },[selectedItems]);



    // --- COMPOSANT---

    // Affichage du graphe et de son conteneur
    return(
        <div ref={divContainerRef} className="scatterplotDivContainer col2"></div>
    )
}

export default ScatterplotContainer;