import Chartist from 'chartist/dist/chartist.min.js';

const hoverLabels = options => chart => {
    const $chart = chart.container;
    let chartWidth;
    let $grid;
    let gridWidth;
    let hoverSection = 0;
    let hoverSectionTemp = 0;
    let activePoints;
    let $pointsAll;
    let $pointsSeries;
    let $sparkline;
    let hoverSectionWidth;
    let sectionWidth;
    let activeDate;

    // console.log(chart);

    chart.on('created', init);
    chart.on('updated', e => {
        console.log('updated');
        getPoints();
    });

    function init(e) {
        // console.log('created', chart);
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
        hoverSectionTemp = Math.round(e.offsetX / sectionWidth);

        if (hoverSectionTemp != hoverSection) {
            hoverSection = hoverSectionTemp;
            activeDate = chart.data.labels[hoverSection];
            activePoints = chart.data.series.map(series => series.data.findIndex((point, i) => point.date === activeDate));
            // activePoints = chart.data.series.map(series => series.data.find((point, i) => point.date === activeDate));
            $pointsSeries.forEach((series, i) => series.forEach((point, j) => j === activePoints[i] ? point.classList.add('active') : point.classList.remove('active')));
            // console.log(activePoints);
        }
    }

    function getPoints() {
        $pointsAll = $chart.querySelectorAll('.ct-point');
        $pointsSeries = Array.from($chart.querySelectorAll('.ct-series')).map(series => Array.from(series.querySelectorAll('.ct-point')));
        // $pointsSeries = Array.from($chart.querySelectorAll('.ct-series')).map(series => Array.from(series.querySelectorAll('.ct-point')).map(point => ({
        //     node: point,
        //     x: point.getBoundingClientRect().left,
        //     y: point.getBoundingClientRect().top
        // })));
    }

    function listeners() {
        $chart.addEventListener('mousemove', getNearestPoint);
    }

    // createToolTip();
    // getNearestPoint();
}

export default hoverLabels;
