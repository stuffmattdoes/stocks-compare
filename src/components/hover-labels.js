import Chartist from 'chartist/dist/chartist.min.js';

const hoverLabels = options => chart => {
    const $chart = chart.container;
    let $grid;
    let hoverSection = 0;
    let $sparkline;
    let $points;

    chart.on('created', init);
    chart.on('updated', e => {
        getPoints();
    });

    function init(e) {
        $grid = $chart.querySelector('.ct-grids');
        listeners();
        createToolTip();
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
        const sectionWidth = ($chart.clientWidth) / chart.data.series[0].data.length;
        // $sparkline.style.left = event.offsetX + 'px';
        // $toolTip.style.left = event.offsetX + 'px';
        // $toolTip.style.top = event.layerY + 'px';
        // offset = event.offsetX - event.clientX;

        let hoverSectionTemp = Math.round(e.offsetX / sectionWidth);

        if (hoverSectionTemp != hoverSection) {
            hoverSection = hoverSectionTemp;
            $points.forEach(point => point.style.opacity = 0);
            $chart.querySelectorAll(`.ct-point:nth-child(${hoverSection})`).forEach(point => point.style.opacity = 1);
        }
    }

    function getPoints() {
        $points = $chart.querySelectorAll('.ct-point');
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
