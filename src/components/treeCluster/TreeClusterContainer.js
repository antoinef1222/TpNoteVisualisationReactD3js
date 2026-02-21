import './TreeCluster.css'
import { useEffect, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import TreeClusterD3 from './TreeCluster-d3';
import { setSelectedItems } from '../../redux/ItemInteractionSlice'


/**
 * Composant permettant d'afficher un arbre
 * @param {*} param0 Objet {d3.tree/cluster} avec le type d'arbre à ajouter
 * @returns Renvoie un arbre
 */
function TreeClusterContainer({tree}){

    // --- VARIABLES ---

    /**
     * Variable d'écoute sur le changement des données
     * Elle permet de mettre à jour le graphe dès que les données sont modifiées
     */
    const treeData = useSelector(state =>state.dataSet);

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
    const treeD3Ref = useRef(null);



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
        console.log("TreeClusterContainer useEffect (called each time matrix re-renders)");
    });


    /**
     * useEffect appelé après que le composant soit construit (utilisation du tableau vide en tant que liste de paramètre à observer)
     * On crée ici le nuage de point vierge à partir des dimensions
     * On définit également une fonction nettoyage pour éviter les fuites de mémoires
     */
    useEffect(() => {
        console.log("TreeClusterContainer useEffect [] called once the component did mount");

        // Création d'un nuage de point vierge
        const treeD3 = new TreeClusterD3(divContainerRef.current, tree);
        treeD3.create({size:getChartSize()});

        // Mise à jour de la référence pointant vers le graphe
        treeD3Ref.current = treeD3;

        /**
         * Fonction de nettoyage
         * Cette fonction supprime le graphe lorsqu'il disparait de l'écran
         */
        return () => {
            console.log("TreeClusterContainer useEffect [] return function, called when the component did unmount...");
            const treeD3 = treeD3Ref.current;
            treeD3.clear()
        }
    },[]);


    /**
     * useEffect appelé à chaque modification des données et des axes (dans notre cas, ce sera uniquement sur les données)
     * On instancie ici les évènements : clicks, hover et leave, puis on affiche le graphe
     */
    useEffect(() => {
        console.log("TreeClusterContainer useEffect with dependency [treeData, xAttribute, yAttribute, treeControllerMethods], called each time treeData changes...");

        /**
         * Evènement au clic - Mise à jour de la valeur sélectionnée (ref)
         * @param {*} itemsData Donnée du graphe cliquée
         */
        const handleOnClick = (itemsData) => {
            dispatch(setSelectedItems(itemsData))
        }

        // Récupération de l'objet graphe via la référence
        const treeD3 = treeD3Ref.current;

        // Mise à jour du graphe
        treeD3.renderTreeCluster(treeData, dropdownLabelValues[xLabelValue], dropdownLabelValues[yLabelValue], {
            handleOnClick
        });
    },[treeData, xLabelValue, yLabelValue, dropdownLabelValues, dispatch]);


    /**
     * useEffect appelé à chaque fois que la valeur sélectionnée change
     * Ici, on met en évidence la donnée lorsqu'on la sélectionne
     */
    useEffect(() => {
        const treeD3 = treeD3Ref.current;
        treeD3.highlightSelectedItems(selectedItems);
    },[selectedItems]);



    // --- COMPOSANT---

    // Affichage du graphe et de son conteneur
    return(
        <div ref={divContainerRef} className="treeClusterDivContainer col2"></div>
    )
}

export default TreeClusterContainer;