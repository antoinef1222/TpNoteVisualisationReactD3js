
import './TreeCluster.css'
import TreeClusterContainer from './TreeClusterContainer';
import * as d3 from 'd3'


/**
 * Composant permettant d'afficher un cluster
 * @returns Renvoie un cluster
 */
function ClusterContainer(){


    // --- COMPOSANT---

    // Affichage d'un cluster
    return(
        <TreeClusterContainer tree={d3.cluster}></TreeClusterContainer>
    )
}

export default ClusterContainer;