import React from "react";
import styles from "../index.scss";
import mapStyles from "./map.scss";

let config = {};
config.params = {
    center: [
        40.71, -74
    ],
    zoomControl: false,
    zoom: 2,
    maxZoom: 18,
    minZoom: 1,
    scrollwheel: false,
    legends: true,
    infoControl: false,
    attributionControl: true
};

var markerParams = {
    radius: 5,
    fillColor: 'orange',
    color: '#000',
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.8
};
export default class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            meteorLayer: null,
            crashLayer: null,
            strikeLayer: null,
            policeLayer: null,
            values: null
        }
    }
    componentDidMount() {
        if (!this.state.map) 
            this.init(this._mapNode);
        this
            .getData()
            .then((data) => {
                console.log(data);
                let baseLayers = {
                    "Dark": this.state.darkGray,
                    "Topographic": this.state.topographic,
                    "Streets": this.state.streets
                }
                L
                    .control
                    .layers(baseLayers)
                    .addTo(this.state.map);

            })
            .catch((err) => {
                console.log(err);
            });

    }
    toGeo(geojson) {
        var obj = {
            "type": "Feature Collection",
            "features": geojson
        }
        console.log(obj)
        return obj
    }
    componentDidUpdate(prevProps, prevState) {
        this
            .state
            .map
            .invalidateSize();
    }

    onEachFeature(feature, layer) {
        const popupContent = `<p>${feature.properties.popupContent}</p>`;
        layer.bindPopup(popupContent);
    }

    zoomToLocation(pos) {
        this
            .state
            .map
            .panTo(pos)
        this
            .state
            .map
            .invalidateSize();
    };
    changeBase(base) {
        if (base == 0) 
            this.state.darkGray.bringToFront();
        if (base == 1) 
            this.state.topographic.bringToFront();
        if (base == 2) 
            this.state.streets.bringToFront();
        }
    zoomToFeature(target) {
        var fitBoundsParams = {
            paddingTopLeft: [
                200, 10
            ],
            paddingBottomRight: [10, 10]
        };
        console.log("Target");
        console.log(target.getBounds())
        this
            .state
            .map
            .fitBounds(target.getBounds(), fitBoundsParams);
    }
    init(id) {
        if (this.state.map) 
            return;
        let map = L.map(id, config.params);
        L
            .control
            .zoom({position: "topright"})
            .addTo(map);
        L
            .control
            .scale({position: "bottomright"})
            .addTo(map);
        let darkGray = L
            .esri
            .basemapLayer('DarkGray')
            .addTo(map);
        let topographic = L
            .esri
            .basemapLayer('Topographic')
            .addTo(map);
        let streets = L
            .esri
            .basemapLayer('Streets')
            .addTo(map);

        this.setState({darkGray, topographic, streets});
        this.setState({map});
    }
    render() {
        return (
            <div id="mapUI" className={styles.maxHeight}>
                <div ref={(node) => this._mapNode = node} id="map"/>
            </div>
        )
    }
}