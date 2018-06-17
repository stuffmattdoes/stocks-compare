import classnames from 'classnames';
import Icon from './icon';
import React, { Component } from 'react';

class ColorSelect extends Component {
    constructor(props) {
        super(props);
        this.colors = [
            '#f44336',
            '#e91e63',
            '#9c27b0',
            '#673ab7',
            '#3f51b5',
            '#2196f3',
            '#03a9f4',
            '#00bcd4',
            '#009688',
            '#4caf50',
            '#8bc34a',
            '#cddc39',
            '#ffeb3b',
            '#ffc107',
            '#ff9800',
            '#ff5722',
            '#795548',
            '#607d8b'
        ];

        this.state = {
            color: this.colors[0],
            showColors: true
        }
    }

    render() {
        const { color, showColors } = this.state;

        return (
            <div className='color-select'>
                <div className='color-select__color' onClick={e => this.setState({ showColors: true })} style={{ backgroundColor: color }}></div>
                <ul className={classnames([
                    'color-select__colors',
                    { 'active': showColors }
                ])}>
                    { this.colors.map(col => <li className='color-select__color' key={col} onClick={e => this.setState({ color: col, showColors: false })} style={{ backgroundColor: col }}>
                        { color === col ? <Icon icon='checkmark' fill='#fff' /> : null }
                    </li>)}
                </ul>
            </div>
        )
    }
}

export default ColorSelect;
