
/**
 * Class static MapperHierarchy
 * Cette classe mappe les données reçues depuis le csv en hiérarchie utilisable par les graphes
 */
export class MapperHierarchy {

    /**
     * Transformation des données en hiérarchie
     * @param {*} data Données du csv
     * @returns Objet sous la forme {name: "communities", children[...]}
     */
    static mapDataToHierarchy(data) {

        /**
         * Regroupement des données en utilisant l'état
         * On utilise la fonction reduce afin d'aggréger les données des villes dans un tableau identifié par un id (numéro de l'état)
         */
        const initialValue = {};
        const mapData = data.reduce((map, currentValue) => {
            if (currentValue.hasOwnProperty("state")) {
                const id = String(currentValue["state"]);

                if (map.hasOwnProperty(id)) {
                    map[id].push({
                        name: currentValue["communityname"],
                        ...currentValue
                    });
                }
                else {
                    map[id] = [{
                        name: currentValue["communityname"],
                        ...currentValue
                    }];
                }
            }
            return map;
        }, initialValue);

        /**
         * Mise en forme et filtrage des données réduites
         * On filtre les données parasites et on les met en forme pour qu'il soit utilisable par les graphes
         */
        const hierarchy = Object.keys(mapData).filter((key) => {
            return key !== "null";
        }).map((key) => {
            const value = mapData[key];
            return {
                name: key,
                children: value
            }
        });

        // Renvoie des données transformées
        return {
            name: "communities",
            children: hierarchy
        };
    }
}