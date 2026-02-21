import * as d3 from 'd3'
import { MapperHierarchy } from '../../utils/MapperHierarchy';


/**
 * Class TreeClusterD3
 * Cette classe créée une arborescence en utilisant D3.js
 */
class TreeClusterD3 {

    // --- VARIABLES ---

    margin = {top: 100, right: 10, bottom: 50, left: 100};
    size;
    height;
    width;
    svg;
    defaultOpacity=0.3;
    transitionDuration=1000;
    circleRadius = 3;
    xScale;
    xLabel = "";
    yScale;
    yLabel = "";
    el;
    fill = "#999";
    fillOpacity;
    stroke = "#555";
    strokeWidth = 1.5;
    strokeOpacity = 0.4;
    strokeLinejoin;
    strokeLinecap;
    halo = "#fff";
    haloWidth = 3;
    curve = d3.curveBumpX;
    zoomLayer;
    tree;


    // --- CONSTRUCTEUR ---

    /**
     * Constructeur de la classe TreeClusterD3 
     * @param {*} el Parent contenant le graphe
     * @param {*} tree Type d'arbre à afficher
     */
    constructor(el, tree){
        this.el = el;
        this.tree = tree;
    };


    // --- FONCTIONS ---

    /**
     * Création d'un graphe à partir des données de configuration
     * @param {*} config objet de type {size: {width: number, height: number}}
     */
    create(config) {
        this.size = {width: config.size.width, height: config.size.height};

        // Calculer les dimensions du graphe à partir des marges et des dimensions de la configuration
        this.width = this.size.width - this.margin.left - this.margin.right;
        this.height = this.size.height - this.margin.top - this.margin.bottom;

        // Création du svg représentant le graphe
        this.svg = d3.select(this.el).append("svg")
            .attr("width", this.size.width)
            .attr("height", this.size.height)
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
        ;

        // Définition d'un zoom afin de pouvoir voir les données
        this.zoomLayer = this.svg.append("g");
        this.svg.call(
            d3.zoom()
                .scaleExtent([1, 25])
                .on("zoom", (event) => {
                    this.zoomLayer.attr("transform", event.transform);
                })
        );
    }


    /**
     * Modification de l'opacité et de la bordure pour la sélection d'un point
     * @param {*} selection Point du graphe
     * @param {*} selected Est ce que le point est sélectionné ? (true, si c'est vrai)
     */
    changeBorderAndOpacity(selection, selected) {
        console.log(selection);
        console.log(selected);

        // Modification de l'opacité
        selection.style("opacity", selected ? 1 : this.defaultOpacity);

        // Modification de la bordure
        selection.select(".markerCircle")
            .attr("fill", selected ? "red" : (d => d.children ? this.stroke : this.fill));
        ;

        selection.select(".markerText")
            .attr("fill", selected ? "red" : "black")
        ;
    }


    changeLinkStyle(selection, selected) {
        selection
            .attr("stroke", selected ? "red" : this.stroke)
            .attr("stroke-opacity", selected ? 1 : this.strokeOpacity)
            .attr("stroke-width", this.strokeWidth)
        ;
    }


    /**
     * Sélectionne un point dans le graphe
     * @param {*} selectedItems Point sélectionné
     */
    highlightSelectedItems(selectedItems){

        // Selection
        const tabSelected = [];
        this.zoomLayer.selectAll(".markerG")
            .each((point, i, nodes) => {
                const isSelected = selectedItems.some(
                    (item) => {
                        if (point.data.hasOwnProperty("index")) {
                            return item.index === point.data.index;
                        }
                        else {
                            return item.name === point.data.name
                        }
                    }
                );

                this.changeBorderAndOpacity(d3.select(nodes[i]), isSelected);
            });
        ;

        this.zoomLayer.selectAll(".markerLink")
            .each((link, i, nodes) => {
                const isSelected = selectedItems.some(
                    (item) => {
                        if (link.target.data.hasOwnProperty("index")) {
                            return item.index === link.target.data.index;
                        }
                        else {
                            return item.name === link.target.data.name
                        }
                    }
                );

                this.changeLinkStyle(d3.select(nodes[i]), isSelected);
            });
    }


    getParent(point) {
        if (point.parent) {
            const parent = point.parent;

            return [parent.data, ...this.getParent(parent)];
        }
        else {
            return [];
        }
    }

    getChildren(point) {
        if (point.hasOwnProperty("children")) {
            const children = point.children;
            
            const dataChild = [];
            children.forEach(child => {
                dataChild.push(child.data);
                dataChild.push(...this.getChildren(child));
            });
            return dataChild;
        }
        else {
            return [];
        }
    }


    /**
     * Application des informations et des évènement du graphe
     * @param {*} treeClusterData 
     * @param {*} xAttribute 
     * @param {*} yAttribute 
     * @param {*} controllerMethods 
     */
    renderTreeCluster(treeClusterData, xAttribute, yAttribute, controllerMethods){
        console.log("render TreeCluster with a new data list ...");

        const root = d3.hierarchy(MapperHierarchy.mapDataToHierarchy(treeClusterData));
        console.log(root);

        // Compute labels and titles.
        const descendants = root.descendants();

        // Compute the layout.
        const dx = 10;
        const dy = this.width / (root.height + 1);
        this.tree().nodeSize([dx, dy])(root);

        // Center the tree.
        let x0 = Infinity;
        let x1 = -Infinity;
        
        root.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        console.log(MapperHierarchy.mapDataToHierarchy(treeClusterData))
        console.log(root.descendants().map(d => ({
            name: d.data.name,
            x: d.x,
            y: d.y
        })));

        // Compute the default height.
        const height = x1 - x0 + dx * 2;
        this.svg.attr("viewBox", [-dy / 2, x0 - dx, this.width, height]);



        // -------------------------
        // LINKS
        // -------------------------
        this.zoomLayer.selectAll(".markerLink")
            .data(root.links())
            .join("path")
            .attr("class", "markerLink")
            .attr("fill", "none")
            .attr("stroke", this.stroke)
            .attr("stroke-opacity", this.strokeOpacity)
            .attr("stroke-width", this.strokeWidth)
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x)
            )
        ;


        this.zoomLayer.selectAll(".markerG")
            .data(root.descendants(), (item) => item.data.name)
            .join(
                enter => {
                    const itemG = enter.append("g")
                        .attr("class","markerG")
                        .attr("transform", item => `translate(${item.y},${item.x})`)
                        .style("opacity", this.defaultOpacity)
                        .on("click", (event, item) => {
                            controllerMethods.handleOnClick([
                                item.data,
                                ...this.getParent(item),
                                ...this.getChildren(item)
                            ]);
                        })
                    ;
                    
                    itemG.append("circle")
                        .attr("class", "markerCircle")
                        .attr("fill", (item) => item.children ? this.stroke : this.fill)
                        .attr("r", this.circleRadius)
                    ;

                    itemG.append("title")
                        .attr("class", "markerTitle")
                        .text((item) => {
                            if (item["data"].hasOwnProperty(xAttribute) && item["data"].hasOwnProperty(yAttribute))
                                return `${xAttribute}: ${item["data"][xAttribute] * 100}% / ${yAttribute}: ${item["data"][yAttribute] * 100}%`;
                            else
                                return "";
                        })
                    ;

                    itemG.append("text")
                        .attr("class", "markerText")
                        .attr("dy", "0.32em")
                        .attr("x", (item) => item.children ? -8 : 8)
                        .attr("text-anchor", (item) => item.children ? "end" : "start")
                        .attr("paint-order", "stroke")
                        .attr("stroke", this.halo)
                        .attr("stroke-width", this.haloWidth)
                        .text((item) => item.data.name)
                    ;
                        
                    this.changeBorderAndOpacity(itemG, false);
                },
                update => {
                    update.selectAll(".markerTitle")
                        .text((item) => {
                            if (item["data"].hasOwnProperty(xAttribute) && item["data"].hasOwnProperty(yAttribute))
                                return `${xAttribute}: ${item["data"][xAttribute] * 100}% / ${yAttribute}: ${item["data"][yAttribute] * 100}%`;
                            else
                                return "";
                        })
                    ;

                    this.changeBorderAndOpacity(update, false);
                },
                exit => {
                    exit.remove();
                }
            )
        ;
    }


    /**
     * Suppression de tous les éléments du graphe
     */
    clear(){
        d3.select(this.el).selectAll("*").remove();
    }
}
export default TreeClusterD3;