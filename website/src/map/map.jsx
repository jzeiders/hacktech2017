import React from "react";
import styles from "../index.scss";
import mapStyles from "./map.scss";
import {Link} from "react-router";

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
            user: "test",
            markers: [],
            tripLine: null,
            data: null,
            started: false
        }
    }
    componentDidMount() {
        if (!this.state.map) 
            this.init(this._mapNode);
        this.getData();
    }
    getData() {
        var url = "http://ture.azurewebsites.net/user/?id="
        axios
            .get(url + this.state.user)
            .then((data) => {
                console.log(data);
                this.setState({data: data.data});
                this
                    .props
                    .updateData(data.data);
                data
                    .data
                    .map((e) => {
                        this.createMarker(e);
                    });

                this.createTripLine();
                this
                    .state
                    .map
                    .setZoomAround(this.state.markers[0].getLatLng(), 8);
                this
                    .state
                    .markers[0]
                    .openPopup();
            })
            .catch((err) => {
                console.log(err);
            })
    }
    createTripLine() {
        console.log(this.state.markers);
        var points = this
            .state
            .markers
            .map((e) => {
                return e.getLatLng();
            })
        console.log(points)
        var line = L.polyline(points, {color: "blue"})
        this.setState({tripLine: line});
        line.addTo(this.state.map);
    }

    createMarker(e) {
        console.log(e);
        var marker = L.marker(L.latLng(e.lat, e.lng), markerParams);
        marker.bindPopup(this.createPopup(e), {
            closeButton: false,
            autoPanPaddingTopLeft: L.point(0, 0),
            keepInView: true
        });
        this.setState({
            markers: [
                ...this.state.markers,
                marker.addTo(this.state.map)
            ]
        });
    }
    animate() {
        this.setState({started: true});
        this
            .state
            .markers
            .map((e, i) => {
                setTimeout((i) => {
                    // this     .state     .map     .panTo(e.getLatLng());
                    if (i > 0 && i < this.state.markers.length - 1) {
                        var bounds = L.latLngBounds(this.state.markers[i].getLatLng(), this.state.markers[i + 1].getLatLng());
                        this
                            .state
                            .map
                            .fitBounds(bounds);
                    }
                    setTimeout(() => {
                        e.openPopup();
                    }, 200)

                }, 2500 * i, i);
            })

    }
    createPopup(e) {
        e.caption = e
            .caption
            .charAt(0)
            .toUpperCase() + e
            .caption
            .slice(1);
        var style = `
            <style>
            #popup {
                display: flex;
                flex-direction: column;
                text-align: center;
            }
            img {
                border-radius: 1em;
            }
            </style>`
        var html = `
            <div id = "popup">
                <img src="${e.url}"/>
                <h3> ${e.caption} </h3>
            </div>
        `
        console.log(style + html);
        return style + html;
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
            .panTo(pos);
        this
            .state
            .map
            .invalidateSize();
    };
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
        let streets = L
            .esri
            .basemapLayer('Streets')
            .addTo(map);
        this.setState({map});
    }
    render() {
        return (
            <div className={styles.maxHeight}>
                <div
                    className={this.state.started
                    ? styles.hidden
                    : mapStyles.start}>
                    <p>
                        <b>Start your story</b>
                    </p>
                    <i
                        onClick={this
                        .animate
                        .bind(this)}
                        className={"fa fa-play"}></i>
                </div>

                <div id="mapUI" className={styles.maxHeight}>
                    <div ref={(node) => this._mapNode = node} id="map" className={mapStyles.map}/>
                </div>
                <h1 className={mapStyles.arrow}>
                    <Link to="/stats">
                        <i className={"fa fa-angle-right"}></i>
                    </Link>
                </h1>
            </div>
        )
    }
}