import React, { Component } from 'react';

class ColorSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: '#3B5998',
            showColors: true
        }
    }

    render() {
        const { color } = this.state;

        return (
            <div className='color-select'>
                <div className='color-select__preview' onClick={e => this.setState({ showColors: true })} style={{ backgroundColor: color }}></div>
            </div>
        )
    }
}

export default ColorSelect;
