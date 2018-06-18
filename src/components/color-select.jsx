import classnames from 'classnames';
import Icon from './icon';
import React, { Component } from 'react';

class ColorSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.color || '#f44336',
            showColors: false
        }

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
        this.onClickColor = this.onClickColor.bind(this);
    }

    onClickColor(color) {
        this.setState({
            color,
            showColors: false
        });

        this.props.onChange(color);
    }

    render() {
        const { color, showColors } = this.state;

        return (
            <div className='color-select'>
                <div className='color-select__color color-select__color--preview' onClick={e => this.setState({ showColors: !showColors })} style={{ backgroundColor: color }}></div>
                <ul className={classnames([
                    'color-select__colors',
                    { 'active': showColors }
                ])}>
                    { this.colors.map(col => <li className='color-select__color' key={col} onClick={e => this.onClickColor(col)} style={{ backgroundColor: col }}>
                        { color === col ? <Icon icon='checkmark' fill='#fff' /> : null }
                    </li>)}
                </ul>
            </div>
        )
    }
}

export default ColorSelect;
