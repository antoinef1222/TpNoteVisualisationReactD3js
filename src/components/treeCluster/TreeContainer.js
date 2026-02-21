
import './TreeCluster.css'
import TreeClusterContainer from './TreeClusterContainer';
import * as d3 from 'd3'


/**
 * Composant permettant d'afficher un arbre
 * @returns Renvoie un arbre
 */
function TreeContainer(){


    // --- COMPOSANT---

    // Affichage d'un arbre
    return(
        <TreeClusterContainer tree={d3.tree}></TreeClusterContainer>
    )
}

export default TreeContainer;