import React from "react";
import styles from "../index.scss";
import statsStyles from "./stats.scss";
import haversine from "haversine"
import {Bar, Line} from "react-chartjs-2"

export default class StatsComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            totalDistance: 0,
            averageHappiness: 0
        }
    }
    lineOptions = {}
    happiness = {
        datasets: [
            {
                label: 'Happiness',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
            }
        ]
    }
    tagStarter = {
        labels: [],
        datasets: [
            {
                label: 'Most Common Tags',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                data: []
            }
        ]
    }
    getData() {
        var url = "http://ture.azurewebsites.net/user/?id=";
        return axios.get(url + 'test');
    }
    componentDidMount() {
        this
            .getData()
            .then((data) => {
                console.log(this.happinessData(data.data));
                this.refs.hapLine.chart_instance.data.datasets[0].data = this.happinessData(data.data);
                this
                    .refs
                    .hapLine
                    .chart_instance
                    .update();
                var tags = this.generateTags(data.data);
                this.refs.tagBar.chart_instance.data.datasets[0].data = tags.data;
                this.refs.tagBar.chart_instance.data.labels = tags.labels;
                this
                    .refs
                    .tagBar
                    .chart_instance
                    .update();
                this.setState({
                    totalDistance: this.calculateDist(data.data)
                });
                this.setState({
                    averageHappiness: this.averageHappiness(data.data)
                });
            });
    }
    calculateDist(data) {
        var totalDistance = 0;
        for (var i = 0; i < data.length - 1; i++) {
            var start = {
                latitude: data[i].lat,
                longitude: data[i].lng
            }
            var end = {
                latitude: data[i].lat,
                longitude: data[i + 1].lng
            }
            totalDistance += haversine(start, end, {unit: "mile"});
        }
        return totalDistance;
    }
    happinessData(data) {
        return data.map((v) => {
            if (v.happiness != 0.5) {
                return v.happiness;
            }
        }).filter((v) => {
            if (v) {
                return v;
            }
        });
    }
    averageHappiness(data) {
        console.log(data);
        let length = data.length;
        return data.reduce((acc, val) => {
            if(val.happiness == 0.5){
                length-=1;
                return acc;
            }
            return acc + val.happiness
        }, 0) / length
    }
    generateTags(data) {
        var tags = data.reduce((acc, val) => {
            val
                .tags
                .split(",")
                .map((v) => {
                    if (acc.hasOwnProperty(v)) 
                        acc[v] += 1;
                    else 
                        acc[v] = 1;
                    }
                )
            return acc;
        }, {});
        var out = {
            labels: [],
            data: []
        }
        for (var key in tags) {
            if (tags.hasOwnProperty(key)) {
                out
                    .labels
                    .push(key);
                out
                    .data
                    .push(tags[key]);
            }
        }
        for (var i = 0; i < out.data.length; i++) {
            for (var j = 0; j < out.data.length; j++) {
                if (out.data[j + 1] < out.data[j]) {
                    let tempData = out.data[j];
                    let tempLabel = out.labels[j];
                    out.data[j] = out.data[j + 1];
                    out.labels[j] = out.labels[j + 1];
                    out.data[j + 1] = tempData;
                    out.labels[j + 1] = tempLabel;
                }
            }
        }
        console.log(out);
        return out;
    }
    render() {
        return (
            <div className={statsStyles.main}>
                <div>
                    Total Distance: {this.state.totalDistance}
                </div>
                <div>
                    Average happiness: {this.state.averageHappiness}
                </div>
                <div>
                    Happiness Chart
                    <Line data={this.happiness} ref="hapLine" options={this.lineOptions}/>
                </div>
                <div>
                    Tag Chart
                    <Bar data={this.tagStarter} ref="tagBar" options={this.barOptionss}/>
                </div>
            </div>
        )
    }
}
