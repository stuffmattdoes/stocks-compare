// Libraries
import axios from 'axios';
import Chartist from 'chartist/dist/chartist.min.js';
import HoverLabels from './components/hover-labels';
// import Tooltip from './components/tooltip';
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
            // chartData: mockData.data,
            chartData: [],
            companies: [],
            err: null,
            highlightedSeries: null,
            range: '1d',
            // showSharePrice: true,
            // showTradeVol: true
        }
        this.chartBar = null;
        this.chartLine = null;
        this.colors = [
            '#f44336', '#e91e63', '#9c27b0',
            '#673ab7', '#3f51b5', '#2196f3',
            '#03a9f4', '#00bcd4', '#009688',
            '#4caf50', '#8bc34a', '#cddc39',
            '#ffeb3b', '#ffc107', '#ff9800',
            '#795548', '#607d8b'
        ];
        this.markets = {
            'New York Stock Exchange': 'NYSE',
            'Nasdaq Global Select': 'NASDAQ'
        }
        this.searchInput = null;

        // Methods
        this.createChartLine = this.createChartLine.bind(this);
        this.colorChart = this.colorChart.bind(this);
        this.formatLabels = this.formatLabels.bind(this);
        this.getStock = this.getStock.bind(this);
        this.normalizeChartDates = this.normalizeChartDates.bind(this);
        this.onRemoveCompany = this.onRemoveCompany.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdateCompany = this.onUpdateCompany.bind(this);
        this.renderCompany = this.renderCompany.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateChart);
    }

    componentDidUpdate() {
        if (this.chartLine === null) {
            this.createChartLine();
            // this.createChartBar();
        } else {
            this.updateChart();
        }
    }

    componentWillMount() {
        // this.getCompanies();
        this.getStock('kmx');
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateChart);
    }

    createChartLine() {
        const { chartData, range } = this.state;
        const labels = this.formatLabels(chartData);
        // const labels = chartData.reduce((acc, series, i) => series.chart.length > acc.length ? series.chart.map(chart => chart.date) : acc, []);

        this.chartLine = new Chartist.Line('.ct-chart--line', {
            labels: labels,
            series: chartData.length > 0 ? chartData.map(company => ({
                className: `series-${company.quote.symbol}`,
                data: company.chart.map(chart => ({
                    date: range === '1d' ? chart.minute : chart.date,
                    value: chart.close
                })),
                name: `${company.quote.symbol} Line Series`
            })) : []
        }, {
            axisX: {
                labelInterpolationFnc: (value, i) => i % Math.round(chartData[0].chart.length / 7)  === 0 ? value : null,
                showGrid: false
            },
            fullWidth: true,
            height: 400,
            plugins: [ HoverLabels() ]
        }, true);

        // this.colorChart();
        // setTimeout(() => this.colorChart(), 100);
    }

    createChartBar() {
        const { chartData } = this.state;

        this.chartBar = new Chartist.Bar('.ct-chart--bar', {
            series: chartData.map(company => ({
                className: `series-${company.quote.symbol}`,
                data: company.chart.map(chart => chart.close),
                name: `${company.quote.symbol} Bar Series`
            }))
        }, {
            axisX: {
                showGrid: false,
                showLabel: false
            },
            axisY: {
                showGrid: false,
                showLabel: false
            },
            fullWidth: true,
            height: 400,
            stackBars: true
        });
    }

    colorChart() {
        this.state.chartData.forEach(company => {
            document.querySelectorAll(`.series-${company.quote.symbol}`).forEach(elem => { elem.style.stroke = company.color });
        });
    }

    updateChart() {
        const { chartData, range } = this.state;
        const chartDataNorm = this.normalizeChartDates(chartData);
        const labels = this.formatLabels(chartData);
        // chartData.reduce((acc, series, i) => series.chart.length > acc.length ? series.chart.map(chart => chart.date) : acc, []);

        // Update Line Chart
        this.chartLine.update({
            labels: labels,
            series: chartDataNorm.map(company => ({
                className: classnames([
                    `series-${company.quote.symbol}`,
                    { 'active': this.state.highlightedSeries === company.quote.symbol }
                ]),
                data: company.chart.map(chart => ({
                    date: range === '1d' ? chart.minute : chart.date,
                    value: chart.close
                })),
                name: `${company.quote.symbol} Line Series`
            }))
        }, {
            axisX: {
                labelInterpolationFnc: (value, i) => i % Math.round(chartData[0].chart.length / 7)  === 0 ? value : null,
            },
        }, true);

        // Update Bar Char
        // this.chartBar.update({
        //     series: chartData.map(company => ({
        //         className: `series-${company.quote.symbol}`,
        //         data: company.chart.map(chart => chart.close),
        //         name: `${company.quote.symbol} Bar Series`
        //     }))
        // }, {}, true);

        // this.colorChart();
    }

    normalizeChartDates(chartData) {
        const maxDates = chartData.reduce((acc, chart, i) => acc > chart.chart.length ? acc : chart.chart.length, 0);

        return chartData.map(chart => {
            if (chart.chart.length === maxDates) {
                return chart;
            } else {
                chart.chart.unshift({ close: 0 });

                return {
                    ...chart,
                    chart: new Array(maxDates - chart.chart.length).concat(chart.chart)
                }
            }
        });
    }

    formatLabels(chartData) {
        const { range } = this.state;

        return chartData.reduce((acc, series, i) => series.chart.length > acc.length ? series.chart.map(chart => {
            if (range === '1d') {
                // const newDate = `${chart.date.substring(0, 4)}-${chart.date.substring(4, 6)}-${chart.date.substring(6, 8)} ${chart.minute}`;
                return chart.minute;
            } else {
                return chart.date;
            }
        }) : acc, []);
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
                const newCompany = {
                    ...res.data,
                    color: this.colors[Math.floor(Math.random() * Math.floor(18))]
                };

                this.setState({
                    chartData: chartData.concat([ newCompany ]),
                    err: null
                }, this.updateChart);
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
                    // chartDataNorm: this.normalizeChartDates(newChart),
                    err: null
                });
                // }, this.updateChart);
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
            <tr className='data-table__row' key={company.quote.symbol} onMouseOver={e => this.setState({ highlightedSeries: company.quote.symbol })}>
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
                    {company.quote.change > 0 ? '+' : null}{company.quote.change} ({Math.round(company.quote.changePercent * 100 * 100) / 100}%)
                </td>
                <td className='data-table__cell'>
                    <strong>${company.quote.close}</strong>
                </td>
            </tr>
        );
    }

    render() {
        const { chartData, err, range } = this.state;

        return (
            <div className='app'>
                <div className='container'>
                    <h1 className='type--heading-1'>Compare Some Stocks</h1>
                    <ul className='tabs'>
                        { [
                            { label: '1 Day', value: '1d' },
                            { label: '5 Days', value: '5d' },
                            { label: '1 Month', value: '1m' },
                            { label: '6 Months', value: '6m' },
                            { label: '1 Year', value: '1y' },
                            { label: '5 Years', value: '5y' }
                        ].map(tab => <li className={classnames([ 'tab', { 'active': range === tab.value }])} key={tab.value} onClick={e => this.onClickTab(tab.value)}>{tab.label}</li>)}
                    </ul>
                    <div className='chart-container'>
                        <div className='ct-chart ct-chart--line'>
                            <div className='ct-chart__interaction'></div>
                            <div className='sparkline'></div>
                        </div>
                        <div className='ct-chart ct-chart--bar'></div>
                    </div>
                    <table className='data-table m-t-m' onMouseOut={e => this.setState({ highlightedSeries: null })}>
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
