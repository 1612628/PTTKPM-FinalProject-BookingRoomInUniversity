import React from 'react'

export class OrderSeatPicker extends React.Component {
    constructor(props) {
        super(props)
        let grid = new Array(props.row)
        for (let i = 0; i < props.row; i++) {
            grid[i] = new Array(props.column).fill(0)
        }
        props.chosen.forEach(([r, c]) => grid[r - 1][c - 1] = 1)
        if (props.current) {
            grid[props.current[0] - 1][props.current[1] - 1] = 2
        }

        this.state = {
            grid: grid
        }
    }

    componentWillReceiveProps(props) {
        let grid = new Array(props.row)
        for (let i = 0; i < props.row; i++) {
            grid[i] = new Array(props.column).fill(0)
        }
        props.chosen.forEach(([r, c]) => grid[r - 1][c - 1] = 1)
        if (props.current) {
            grid[props.current[0] - 1][props.current[1] - 1] = 2
        }
        this.setState({ grid: grid })
    }

    render() {
        let { grid } = this.state
        let { current } = this.props
        return (
            <React.Fragment>
                <div className="mx-0 my-3 control-label font-weight-bold d-flex justify-content-center">
                    <label>{this.props.label}</label>
                </div>
                <table style={{ borderCollapse: 'collapse', width: this.props.width, height: this.props.height }}>
                    <tbody>
                        {grid.map((r, i) => {
                            return (
                                <tr key={i}
                                    style={{
                                        height: `${Math.floor(100 / this.props.row)}%`
                                    }}
                                >
                                    {r.map((c, j) => {
                                        let colors = ((data) => {
                                            switch (data) {
                                                case 0: return { text: 'black', background: 'white' }
                                                case 1: return { text: 'white', background: '#2d7ff9' }
                                                default: return { text: 'white', background: 'black' }
                                            }
                                        })(c)
                                        return (
                                            <td key={j}
                                                style={{
                                                    width: `${Math.floor(100 / this.props.column)}%`,
                                                    backgroundColor: colors.background,
                                                    color: colors.text,
                                                    verticalAlign: 'middle',
                                                    textAlign: 'center',
                                                    border: '1px solid #ccc',
                                                    cursor: this.props.disabled ? 'default' : 'pointer'
                                                }}
                                                onClick={() => {
                                                    if (this.props.disabled || c === 1) {
                                                        return null
                                                    }

                                                    let newGrid = grid.map(r => r.map(v => v))
                                                    let newCurrent = null
                                                    if (!current) {
                                                        newGrid[i][j] = 2
                                                        newCurrent = [i + 1, j + 1]
                                                    } else if (current[0] !== i + 1 || current[1] !== j + 1) {
                                                        newGrid[current[0] - 1][current[1] - 1] = 0
                                                        newGrid[i][j] = 2
                                                        newCurrent = [i + 1, j + 1]
                                                    } else {
                                                        return null
                                                    }

                                                    this.props.onChange(newCurrent)
                                                    this.setState({ grid: newGrid })
                                                }}
                                            >{i + 1}-{j + 1}</td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}