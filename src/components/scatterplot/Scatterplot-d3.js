import * as d3 from 'd3'


/**
 * Class ScatterplotD3
 * Cette classe créée un nuage de point en utilisant D3.js
 */
class ScatterplotD3 {

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
    yScale;
    el;


    // --- CONSTRUCTEUR ---

    /**
     * Constructeur de la classe ScatterplotD3 
     * @param {*} el Parent contenant le graphe
     */
    constructor(el){
        this.el = el;
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
            .append("g")
            .attr("class","svgG")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        ;

        // Définition de l'échelle
        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);

        // Affichage des axes
        this.svg.append("g")
            .attr("class","xAxisG")
            .attr("transform","translate(0," + this.height + ")")
        ;
        this.svg.append("g")
            .attr("class","yAxisG")
        ;
    }


    /**
     * Modification de l'opacité et de la bordure pour la sélection d'un point
     * @param {*} selection Point du graphe
     * @param {*} selected Est ce que le point est sélectionné ? (true, si c'est vrai)
     */
    changeBorderAndOpacity(selection, selected){

        // Modification de l'opacité
        selection.style("opacity", selected?1:this.defaultOpacity);

        // Modification de la bordure
        selection.select(".markerCircle")
            .attr("stroke-width", selected?2:0)
        ;
    }


    /**
     * Mise à jour de la position d'un point à partir de nouveaux attribut et réinitialisation de l'effet de click
     * @param {*} selection Point sélectionné
     * @param {*} xAttribute Attribut sur l'axe des x
     * @param {*} yAttribute Attribut sur l'axe des y
     */
    updateMarkers(selection,xAttribute,yAttribute){
        selection
            .transition().duration(this.transitionDuration)
            .attr("transform", (item) => {
                return "translate(" + this.xScale(item[xAttribute]) + "," + this.yScale(item[yAttribute])+")";
            })
        ;
        this.changeBorderAndOpacity(selection, false);
    }



    /**
     * Sélectionne un point dans le graphe
     * @param {*} selectedItems Point sélectionné
     */
    highlightSelectedItems(selectedItems){

        /**
         * Pour chaque données du graphe, on lie l'item sélectionné a une donnée :
         * - Ici, on n'ajoute pas de nouvelles données au graphe, donc la fonction enter reste vide
         * - Si un nouvel objet match avec l'item sélectionné, alors on modifie la bordure et son opacité
         * - Sinon, on retire l'effet de sélection
         */
        this.svg.selectAll(".markerG")
            .data(selectedItems,(itemData) => itemData.index)
            .join(
                enter => {
                },
                update => {
                    this.changeBorderAndOpacity(update, true);
                },
                exit => {
                    this.changeBorderAndOpacity(exit, false);
                },
            )
        ;
    }


    /**
     * Mise à jour des axes du graphe
     * @param {*} visData Liste des données
     * @param {*} xAttribute Attribut sur l'axe des x
     * @param {*} yAttribute Attribut sur l'axe des y
     */
    updateAxis(visData,xAttribute,yAttribute){

        // Sélection d'u nminimum est d'un maximum pour définir l'échelle
        const minX = d3.min(visData.map(item => item[xAttribute]))
        const maxX = d3.max(visData.map(item => item[xAttribute]))
        const minY = d3.min(visData.map(item => item[yAttribute]))
        const maxY = d3.max(visData.map(item => item[yAttribute]))
        this.xScale.domain([minX,maxX]);
        this.yScale.domain([minY,maxY]);

        // Mise à jours de l'échelle de tous les points du graphe
        this.svg.select(".xAxisG")
            .transition().duration(500)
            .call(d3.axisBottom(this.xScale))
        ;
        this.svg.select(".yAxisG")
            .transition().duration(500)
            .call(d3.axisLeft(this.yScale))
        ;
    }


    /**
     * Application des informations et des évènement du graphe
     * @param {*} visData 
     * @param {*} xAttribute 
     * @param {*} yAttribute 
     * @param {*} controllerMethods 
     */
    renderScatterplot(visData, xAttribute, yAttribute, controllerMethods){
        console.log("render scatterplot with a new data list ...")

        // Modifcation des échelles des axes x et y à partir des données
        this.updateAxis(visData, xAttribute, yAttribute);

        /**
         * Pour chaque données du graphe, on associe les nouvelles données aux points existants :
         * - Si le point n'existe pas encore dans le tableau, alors on le crée
         * - Sinon s'il exsite déjà, alors on met à jour la position du point en fonction de la nouvelle échelle
         * - Sinon, c'est qu'il n'existe plus, auquel cas on le supprime du graphe
         */
        this.svg.selectAll(".markerG")
            .data(visData, (itemData) => itemData.index)
            .join(
                enter => {
                    // Création d'un point
                    const itemG = enter.append("g")
                        .attr("class","markerG")
                        .style("opacity", this.defaultOpacity)
                        .on("click", (event, itemData) => {
                            controllerMethods.handleOnClick(itemData);
                        })
                    ;
                    itemG.append("circle")
                        .attr("class", "markerCircle")
                        .attr("r", this.circleRadius)
                        .attr("stroke", "red")
                    ;
                    this.updateMarkers(itemG, xAttribute, yAttribute);
                },
                update => {
                    this.updateMarkers(update, xAttribute, yAttribute);
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
export default ScatterplotD3;