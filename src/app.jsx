// Libraries
import axios from 'axios';
import classnames from 'classnames';
import React, { Component } from 'react';

// Components
import ColorSelect from './components/color-select';
import Icon from './components/icon';
// import Search from './components/search';

// Mock data
import mockData from '../data.json';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: mockData.data,
            companies: [],
            err: null,
            range: '1m'
        }

        this.markets = {
            'New York Stock Exchange': 'NYSE',
            'Nasdaq Global Select': 'NASDAQ'
        }

        this.searchInput = null;
        this.getStock = this.getStock.bind(this);
        this.onRemoveCompany = this.onRemoveCompany.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdateCompany = this.onUpdateCompany.bind(this);
        this.renderCompany = this.renderCompany.bind(this);
    }

    componentWillMount() {
        this.getCompanies();
    }

    getCompanies() {
        axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
            .then(res => this.setState({ companies: res.data }) )
            .catch(err => this.setState({ symbolErr: err.response }) );
    }

    getStock(search) {
        const { chartData, range } = this.state;

        if (chartData.filter(company => company.quote.symbol.toLowerCase() === search.toLowerCase()).length > 0) {
            return this.setState({ err: 'You\'ve already added this stock!'});
        }

        axios.get(`https://api.iextrading.com/1.0/stock/${search}/batch?types=chart,quote,logo&range=${range}`)
            .then(res => {
                this.setState({
                    err: null,
                    chartData: chartData.concat([ res.data ])
                });
            })
            .catch(err => this.setState({ err: err.response.data }) );
    }

    onSubmit(e) {
        e.preventDefault();
        this.searchInput.blur();
        this.getStock(this.searchInput.value);
        this.searchInput.value = '';
    }

    onUpdateCompany(companySymbol, update) {
        let newChartData = this.state.chartData.map(company => company.quote.symbol === companySymbol ? Object.assign({}, company, update) : company);

        this.setState({
            chartData: newChartData
        });
    }

    onRemoveCompany(companySymbol) {
        this.setState({
            chartData: this.state.chartData.filter(company => company.quote.symbol !== companySymbol)
        });
    }

    renderCompany(company) {
        return (
            <tr className='data-table__row' key={company.quote.symbol}>
                <td className='data-table__cell'>
                    <ColorSelect color={company.color} onChange={newColor => this.onUpdateCompany(company.quote.symbol, { color: newColor })}/>
                </td>
                <td className='data-table__cell' key={company.quote.symbol}>
                    <img className='m-r-s s-l' src={`${company.logo.url}`} />
                    {company.quote.companyName} ({company.quote.symbol})
                    <span className='data-table__delete' onClick={e => this.onRemoveCompany(company.quote.symbol)}><Icon icon='close' fill='red' /></span>
                </td>
                <td className='data-table__cell'>
                    {this.markets[company.quote.primaryExchange] || company.quote.primaryExchange}
                </td>
                <td className={classnames([
                        'data-table__cell',
                        { 'color--critical': (company.quote.change < 0) },
                        { 'color--success': (company.quote.change > 0) }
                    ])}>
                    {company.quote.change > 0 ? '+' : null}{company.quote.change} ({company.quote.changePercent * 100}%)
                </td>
                <td className='data-table__cell'>
                    <strong>${company.quote.close}</strong>
                </td>
            </tr>
        );
    }

    render() {
        const { chartData, err } = this.state;

        return (
            <div className='app'>
                <div className='container'>
                    <h1 className='type--heading-1'>Stock Bubble</h1>
                    <table className='data-table'>
                        <thead className='data-table__head'>
                            <tr className='data-table__row'>
                                <th className='data-table__cell'>Graph</th>
                                <th className='data-table__cell'>Company (Symbol)</th>
                                <th className='data-table__cell'>Market</th>
                                <th className='data-table__cell'>Today's Change</th>
                                <th className='data-table__cell'>Share Price (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            { chartData.map(this.renderCompany) }
                        </tbody>
                    </table>
                    <form className='search' onSubmit={this.onSubmit} >
                        <Icon fill='#595959' icon='search' />
                        <input autoComplete='off' className='search__input' id='Search__Input'  placeholder='Search' ref={node => this.searchInput = node} />
                        { err ?
                            <label className='search__label search__label--error' htmlFor='Search__Input'>{err}</label>
                        : null }
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
