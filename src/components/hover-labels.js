import Chartist from 'chartist/dist/chartist.min.js';

const hoverLabels = options => chart => {
    const $chart = chart.container;
    let $grid;
    let hoverSection = 0;
    let $pointsAll;
    let $pointsSeries;
    let $sparkline;

    chart.on('created', init);
    chart.on('updated', e => {
        // console.log('updated');
        getPoints();
    });

    function init(e) {
        // console.log('created');
        $grid = $chart.querySelector('.ct-grids');
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
        const sectionWidth = ($chart.clientWidth - 50) / chart.data.series[0].data.length;
        // $sparkline.style.left = event.offsetX + 'px';
        // $toolTip.style.left = event.offsetX + 'px';
        // $toolTip.style.top = event.layerY + 'px';
        // offset = event.offsetX - event.clientX;

        let hoverSectionTemp = Math.round(e.offsetX / sectionWidth);
        // console.log($chart.clientWidth - 50, e.offsetX - 50);

        if (hoverSectionTemp != hoverSection) {
            console.log($chart.clientWidth - 50, sectionWidth, hoverSectionTemp);
            hoverSection = hoverSectionTemp;
            $pointsAll.forEach(point => point.style.opacity = 0);
            // console.log($pointsSeries.forEach(series => Array.from(series).find(point => console.log(point) && e.clientX <= point.x)));
            $chart.querySelectorAll(`.ct-point:nth-child(${hoverSection})`).forEach(point => point.style.opacity = 1);
        }
    }

    function getPoints() {
        $pointsAll = $chart.querySelectorAll('.ct-point');
        $pointsSeries = Array.from($chart.querySelectorAll('.ct-series')).map(series => series.querySelectorAll('.ct-point'));
        // console.log($pointsSeries);
    }

    function listeners() {
        $chart.addEventListener('mousemove', event => {
            getNearestPoint(event);
        });
    }

    // createToolTip();
    // getNearestPoint();
}

export default hoverLabels;
