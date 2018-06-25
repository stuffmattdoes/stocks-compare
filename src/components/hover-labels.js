import Chartist from 'chartist/dist/chartist.min.js';

const hoverLabels = options => chart => {
    const $chart = chart.container;
    let chartWidth;
    let $grid;
    let gridWidth;
    let hoverSection = 0;
    let hoverSectionTemp = 0;
    let $pointsAll;
    let $pointsSeries;
    let $sparkline;
    let hoverSectionWidth;
    let sectionWidth;
    let activeDate;

    chart.on('created', init);
    chart.on('updated', e => {
        console.log('updated');
        $grid = $chart.querySelector('.ct-grids');
        getPoints();
    });

    function init(e) {
        console.log('created', chart);
        chartWidth = $chart.getBoundingClientRect().width;
        $grid = $chart.querySelector('.ct-grids');
        gridWidth = $grid.getBoundingClientRect().width;
        // sectionWidth = gridWidth / chart.data.labels.length;
        sectionWidth = chartWidth / (chart.data.labels.length - 1);
        // sectionWidth = sectionWidth < 1 ? 1 : sectionWidth;

        listeners();
        // createToolTip();
        getPoints();
    }

    // Create tooltip
    function createToolTip() {
        let $toolTip = $chart.querySelector('.sparkline-tooltip');

        if (!$toolTip) {
            $toolTip = document.createElement('div');
            $toolTip.className = 'sparkline-tooltip';
            $toolTip.innerHTML = `<p>Lollerskates</p>`;

            $chart.appendChild($toolTip);
        }
    }

    // // Create dashed line
    function createSparkLine() {
        $sparkline = $chart.querySelector('.sparkline-line');

        if (!$sparkline) {
            $sparkline = document.createElement('div');
            $sparkline.className = 'sparkline';
            $chart.appendChild($sparkline);
        }
    }

    function getNearestPoint(e) {
        // const $grid = $chart.querySelector('.ct-grids').getBoundingClientRect().width;
        hoverSectionTemp = Math.round(e.offsetX / sectionWidth);

        if (hoverSectionTemp != hoverSection) {
            hoverSection = hoverSectionTemp;
            activeDate = chart.data.labels[hoverSection];
            // let activePoints = chart.data.series[0].data
            let activePoints = chart.data.series.map(series => series.data.filter(point => point.date === activeDate)[0].value);
            console.log(activeDate, activePoints);
        }
    }

    function getHoverSection(event) {
        console.log(event.clientX, gridWidth, sectionWidth);
    }

    function getPoints() {
        $pointsAll = $chart.querySelectorAll('.ct-point');
        $pointsSeries = Array.from($chart.querySelectorAll('.ct-series')).map(series => Array.from(series.querySelectorAll('.ct-point')).map(point => ({
            node: point,
            x: point.getBoundingClientRect().left,
            y: point.getBoundingClientRect().top
        })));
    }

    function listeners() {
        $chart.addEventListener('mousemove', event => {
            // getHoverSection(event);
            getNearestPoint(event);
        });
    }

    // createToolTip();
    // getNearestPoint();
}

export default hoverLabels;
