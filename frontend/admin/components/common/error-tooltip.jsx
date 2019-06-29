import React from 'react'
import { NigamonIcon } from './nigamon-icon';

export class ErrorTooltip extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="btn bg-transparent right-icon border-0 custom-tooltip">
                    <NigamonIcon name='exclamation-triangle' className='text-danger' />
                </div>
                <div className="tooltiptext alert alert-danger my-1 w-75">
                    {this.props.label}
                </div>
            </React.Fragment>
        )
    }
}

function buildRightIconWithTooltip(label, tooltip) {
    return `
        <div class="btn bg-transparent right-icon border-0 custom-tooltip">
            ${label}
            
        </div>
        <div class="tooltiptext alert alert-danger my-1 w-75">
                ${tooltip}
        </div>
    `;
}

export function buildErrorTooltip(text) {
    return buildRightIconWithTooltip(
        `<i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>`,
        text
    )
}