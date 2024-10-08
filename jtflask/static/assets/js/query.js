/*global vendors*/

const JTSpatialQuery = (() => {
    const objectIds = (layer, geometry, spatialRelationship) => {
        const queryObjectIds = () => {
            if (!geometry) {
                return;
            }
            const query = layer.createQuery();
            query.geometry = geometry;
            query.spatialRelationship = spatialRelationship;

            return layer.queryObjectIds(query).then((objectIds) => {
                if (objectIds.length > 0) {
                    console.log("Object IDs found:", objectIds);
                    return objectIds;
                }
                return [];  // Return an empty array if no object IDs are found
            });
        };
        // Debounce the query to prevent multiple requests from being sent
        const debouncedQuery = vendors.promiseUtils.debounce(queryObjectIds);
        return debouncedQuery(layer, geometry, spatialRelationship);
    };

    const attributes = (layerView, geometry, outFields, spatialRelationship) => {
        const queryFeatures = () => {
            if (!geometry) {
                return;
            }
            const query = layerView.layer.createQuery();
            query.geometry = geometry;
            query.outFields = outFields;
            query.spatialRelationship = spatialRelationship;
            query.returnGeometry = false;

            return layerView.layer.queryFeatures(query).then((results) => {
                if (results.features.length > 0) {
                    const attributes = results.features.map(feature => feature.attributes);
                    // noinspection JSUnresolvedVariable
                    const objectIds = attributes.map(attr => attr.OBJECTID);
                    JTHighlight.highlightBuildings(objectIds, layerView);
                    return attributes;
                }
                return [];  // Return an empty array if no object IDs are found
            });
        };
        // Debounce the query to prevent multiple requests from being sent
        const debouncedQuery = vendors.promiseUtils.debounce(queryFeatures);
        return debouncedQuery(layerView, geometry, outFields, spatialRelationship);
    };

    return {
        objectIds: objectIds,
        attributes: attributes
    };
})(); // IIFE

const JTAttributeQuery = (() => {
    // const byField = (layer, fieldName, outFields=["*"]) => {
    //     const query = layer.createQuery();
    //     query.where = `${fieldName} IS NOT NULL`; // not null
    //     query.returnGeometry = false;
    //     query.outFields = outFields;
    //     query.maxRecordCountFactor = 5;
    //
    //     return layer.queryFeatures(query).then((results) => {
    //         // console.log(`Fetched ${attributes.length} records with field: ${fieldName}`);
    //         return results.features.map(feature => feature.attributes);
    //     }).catch((error) => {
    //         console.error(`Error querying by field name ${fieldName}:`, error);
    //         return [];
    //     });
    // };
    //
    // const byFieldValue = (layer, fieldName, fieldValue, outFields=["*"]) => {
    //     const query = layer.createQuery();
    //     query.where = `${fieldName} = '${fieldValue}'`;
    //     query.returnGeometry = false;
    //     query.outFields = outFields;
    //     query.maxRecordCountFactor = 10;
    //
    //     return layer.queryFeatures(query).then((results) => {
    //         // console.log(`Fetched ${attributes.length} records where ${fieldName} = ${fieldValue}`);
    //         return results.features.map(feature => feature.attributes);
    //     }).catch((error) => {
    //         console.error(`Error querying by field value ${fieldName}=${fieldValue}:`, error);
    //         return [];
    //     });
    // };

    const byField = (layer, fieldName, fieldValue = null, outFields = ["*"]) => {
        const query = layer.createQuery();

        // If fieldValue is provided, check for equality, otherwise check for IS NOT NULL
        query.where = fieldValue ? `${fieldName} = '${fieldValue}'` : `${fieldName} IS NOT NULL`;
        query.returnGeometry = false;
        query.outFields = outFields;
        query.maxRecordCountFactor = 10;

        return layer.queryFeatures(query)
            .then((results) => {
                return results.features.map(feature => feature.attributes);
            })
            .catch((error) => {
                console.error(`Error querying by field ${fieldName}${fieldValue ? `=${fieldValue}` : ''}:`, error);
                return [];
            });
    };

    return {
        byField: byField
    };
})(); // IIFE
