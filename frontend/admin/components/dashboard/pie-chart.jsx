import React from 'react'
import { Container } from '../common/container';
import { RemoteLoader } from '../common/remote-loader';

export class PieChart extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.chart = null
    }

    componentDidMount() {
        let canvas = $(this.ref).get(0).getContext('2d');
        this.chart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: this.props.data.labels,
                datasets: [{
                    data: this.props.data.data,
                    label: this.props.label,
                    backgroundColor: ['#2D7FF9', '#d3ebfb']
                }]
            },
            options: {
                showLines: true,
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

export class RemotePieChart extends React.Component {
    render() {
        return (
            <Container title={this.props.title} className={this.props.className}>
                <RemoteLoader
                    isLoading={this.props.isLoading}
                    isFailed={this.props.isFailed}
                    renderOnSuccess={() => {
                        return (
                            <PieChart
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