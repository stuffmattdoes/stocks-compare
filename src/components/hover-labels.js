import Chartist from 'chartist/dist/chartist.min.js';

const hoverLabels = options => chart => {
    const $chart = chart.container;
    let chartRect;
    let $gridArea;
    let $grid;
    let $interactionlayer;
    let gridRect;
    let hoverSection;
    let hoverSectionTemp;
    let activePoints;
    let $pointsAll;
    let $pointsSeries;
    let $sparkline;
    let hoverSectionWidth;
    let sectionWidth;
    let activeDate;
    let offsetLeft;

    // console.log(chart);

    chart.on('created', init);
    // chart.on('data', e => {
    //     console.log('update');
    //     getPoints();
    // });

    createSparkLine();

    function init(e) {
        // console.log('created', chart);
        chartRect = $chart.getBoundingClientRect();
        $grid = $chart.querySelector('.ct-grids');
        $interactionlayer = $chart.querySelector('.ct-chart__interaction');
        gridRect = $grid.getBoundingClientRect();
        sectionWidth = gridRect.width / chart.data.labels.length;
        // sectionWidth = sectionWidth < 1 ? 1 : sectionWidth;

        // createToolTip();
        setInteractionLayer();
        getPoints();
        listeners();
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

    function hideIndicator(e) {
        hoverSection = null;
        $chart.querySelectorAll('.ct-point.active').forEach(point => point.classList.remove('active'));
        $sparkline.classList.remove('active');
    }

    function getNearestPoint(e) {
        if (e.clientX < gridRect.left || e.clientX > gridRect.left + gridRect.width) {
            hideIndicator();
            return;
        }

        $sparkline.classList.add('active');
        // hoverSectionTemp = Math.round((e.clientX - (chartRect.width - gridRect.width)) / sectionWidth);
        hoverSectionTemp = Math.round(e.offsetX / sectionWidth);

        if (hoverSectionTemp != hoverSection) {
            hoverSection = hoverSectionTemp;
            console.log(e.offsetX, hoverSection);
            activeDate = chart.data.labels[hoverSection];
            activePoints = chart.data.series.map(series => series.data.findIndex((point, i) => point.date === activeDate));

            $pointsSeries.forEach((series, i) => series.forEach((point, j) => {
                if (j === activePoints[i]) {
                    offsetLeft = Math.round(point.getBoundingClientRect().left - (gridRect.left - 49));
                    point.classList.add('active');
                } else {
                    point.classList.remove('active');
                }
            }));

            $sparkline.style.left = `${offsetLeft}px`;
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

    function setInteractionLayer() {
        $interactionlayer.style.height = `${gridRect.height}px`;
        $interactionlayer.style.left = `${gridRect.left - chartRect.left}px`;
        $interactionlayer.style.top = `${gridRect.top - chartRect.top}px`;
        $interactionlayer.style.width = `${gridRect.width}px`;
    }

    function listeners() {
        $interactionlayer.addEventListener('mousemove', getNearestPoint);
        $interactionlayer.addEventListener('mouseleave', hideIndicator);
    }

    // createToolTip();
    // getNearestPoint();
}

export default hoverLabels;
