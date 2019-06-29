import React from 'react'
import { Container } from '../common/container';
import { RemoteLoader } from '../common/remote-loader';

export class LineChart extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.chart = null
    }

    componentDidMount() {
        let canvas = $(this.ref).get(0).getContext('2d');
        this.chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: this.props.data.labels,
                datasets: [{
                    data: this.props.data.data,
                    label: this.props.label,
                    backgroundColor: '#2D7FF9',
                    borderColor: '#2D7FF9',
                    borderWidth: 3,
                    fill: false
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    render() {
        return (
            <canvas ref={ref => this.ref = ref} width="400" height="300"></canvas>
        )
    }
}

export class RemoteLineChart extends React.Component {
    render() {
        return (
            <Container title={this.props.title} className={this.props.className}>
                <RemoteLoader
                    isLoading={this.props.isLoading}
                    isFailed={this.props.isFailed}
                    renderOnSuccess={() => {
                        return (
                            <LineChart
                                data={this.props.data}
                                label={this.props.label}
                            />
                        )
                    }}
                    renderOnFailed={() => this.props.error}
                />
            </Container>
        )
    }
}