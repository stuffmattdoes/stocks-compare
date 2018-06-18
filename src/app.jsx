// Libraries
import axios from 'axios';
import Chartist from 'chartist/dist/chartist.min.js';
import classnames from 'classnames';
import React, { Component } from 'react';

// Components
import ColorSelect from './components/color-select';
import Icon from './components/icon';

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
        this.chartist = null;
        this.markets = {
            'New York Stock Exchange': 'NYSE',
            'Nasdaq Global Select': 'NASDAQ'
        }
        this.searchInput = null;
        this.tabs = [
            {
                label: '1 Day',
                value: '1d'
            },
            {
                label: '5 Days',
                value: '5d'
            },
            {
                label: '1 Month',
                value: '1m'
            },
            {
                label: '6 Months',
                value: '6m'
            },
            {
                label: '1 Year',
                value: '1y'
            },
            {
                label: '5 Years',
                value: '5y'
            }
        ];

        // Methods
        this.getStock = this.getStock.bind(this);
        this.onRemoveCompany = this.onRemoveCompany.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdateCompany = this.onUpdateCompany.bind(this);
        this.renderCompany = this.renderCompany.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    componentWillMount() {
        this.getCompanies();
    }

    createChart() {
        const { chartData } = this.state;

        this.chartist = new Chartist.Line('.ct-chart', {
            series: chartData.map(company => ({
                className: `series-${company.quote.symbol}`,
                data: company.chart.map(chart => chart.close),
                name: `${company.quote.symbol} Series`
            }))
        }, {
            axisX: {
                showGrid: false
            },
            height: 400,
            showPoint: false
        });
    }

    updateChart() {
        const { chartData, range } = this.state;

        // Handle daily trades
        // if (range !== '1d') {
        //     chart.forEach((stock, i) => {
        //         labels.push(stock.label);
        //         seriesA.push(stock.close);
        //         inputs.push(i);
        //         outputs.push(stock.close);
        //     });
        // } else {
        //     chart.forEach((stock, i) => {
        //         let price = stock.average >= 0 ? stock.average : (seriesA[i - 1] || quote.open);
        //         labels.push(stock.minute);
        //         seriesA.push(price);
        //         inputs.push(i);
        //         outputs.push(price);
        //     });
        // }

        this.chartist.update({
            labels: chartData[0].chart.map(chart => chart.label),
            series: chartData.map(company => ({
                className: `series-${company.quote.symbol}`,
                data: company.chart.map(chart => chart.close),
                name: `${company.quote.symbol} Series`
            }))
        }, {
            axisX: {
                labelInterpolationFnc: (value, i) => i % Math.round(chartData[0].chart.length / 5)  === 0 ? value : null,
            }
        }, true);

        this.state.chartData.forEach(company => {
            document.querySelector(`.ct-series.series-${company.quote.symbol}`).style.stroke = company.color;
        });
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
                    chartData: chartData.concat([ res.data ]),
                    err: null
                });
            })
            .catch(err => this.setState({ err: err.response.data }) );
    }

    updateStocks() {
        const { chartData, range } = this.state;
        const symbols = chartData.map(company => company.quote.symbol.toLowerCase()).join(',');

        axios.get(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=chart&range=${range}`)
            .then(res => {
                let newChart = chartData.map(company => ({
                    ...company,
                    chart: res.data[company.quote.symbol].chart
                }));

                this.setState({
                    chartData: newChart,
                    err: null
                }, this.updateChart);
            })
            .catch(err => this.setState({ err: err.response }) );
    }

    onClickTab(range) {
        this.setState({ range }, this.updateStocks);
    }

    onSubmit(e) {
        e.preventDefault();
        this.searchInput.blur();
        this.getStock(this.searchInput.value);
        this.searchInput.value = '';
    }

    onUpdateCompany(companySymbol, update) {
        let newChartData = this.state.chartData.map(company => {
            return company.quote.symbol === companySymbol ? Object.assign({}, company, update) : company;
        });

        this.setState({ chartData: newChartData });
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
        const { chartData, err, range } = this.state;
        console.log(chartData);

        return (
            <div className='app'>
                <div className='container'>
                    <h1 className='type--heading-1'>Compare Some Stocks, Eh?</h1>
                    <ul className='tabs'>
                        { this.tabs.map(tab => <li className={classnames([ 'tab', { 'active': range === tab.value }])} key={tab.value} onClick={e => this.onClickTab(tab.value)}>{tab.label}</li>)}
                    </ul>
                    <div className='ct-chart'></div>
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
