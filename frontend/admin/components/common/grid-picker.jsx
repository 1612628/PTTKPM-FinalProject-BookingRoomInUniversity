import React from 'react'

export class GridPicker extends React.Component {
    constructor(props) {
        super(props)
        let grid = new Array(props.row)
        for (let i = 0; i < props.row; i++) {
            grid[i] = new Array(props.column).fill(0)
        }
        props.chosen.forEach(([r, c]) => grid[r - 1][c - 1] = 1)

        this.state = {
            grid: grid
        }
    }

    render() {
        let { grid } = this.state
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
                                        return (
                                            <td key={j}
                                                style={{
                                                    width: `${Math.floor(100 / this.props.column)}%`,
                                                    backgroundColor: c !== 0 ? '#2D7FF9' : 'white',
                                                    color: c !== 0 ? 'white' : 'black',
                                                    verticalAlign: 'middle',
                                                    textAlign: 'center',
                                                    border: '1px solid #ccc',
                                                    cursor: this.props.disabled ? 'default' : 'pointer'
                                                }}
                                                onClick={() => {
                                                    if (this.props.disabled) {
                                                        return null
                                                    }
                                                    let newGrid = grid.map(r => r.map(v => v))
                                                    newGrid[i][j] = 1 - c
                                                    let newChosen = newGrid.map((row, i) => row.map((val, j) => {
                                                        if (val !== 0) {
                                                            return [i + 1, j + 1]
                                                        }
                                                        return null
                                                    })).reduce((prev, cur) => prev.concat(cur), []).filter(v => v !== null)
                                                    this.props.onChange(newChosen)
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