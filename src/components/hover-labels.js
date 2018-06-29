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
    let $tooltip;
    let $tooltipDate;
    let $tooltipCompanies;
    let hoverSectionWidth;
    let sectionWidth;
    let activeDate;
    let offsetLeft;

    // console.log(chart);

    chart.on('created', init);
    // chart.on('draw', e => {
    //     console.log('update');
    //     getPoints();
    // });

    function init(e) {
        $grid = $chart.querySelector('.ct-grids');
        $interactionlayer = $chart.querySelector('.ct-chart__interaction');
        $sparkline = $chart.querySelector('.sparkline');
        $tooltip = document.querySelector('.tooltip');
        $tooltipDate = $tooltip.querySelector('.tooltip__date');
        $tooltipCompanies = $tooltip.querySelector('.tooltip__companies');
        chartRect = $chart.getBoundingClientRect();
        gridRect = $grid.getBoundingClientRect();
        sectionWidth = gridRect.width / chart.data.labels.length;
        // sectionWidth = sectionWidth < 1 ? 1 : sectionWidth;

        setInteractionLayer();
        getPoints();
        listeners();
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
        hoverSectionTemp = Math.floor(e.offsetX / sectionWidth);

        if (hoverSectionTemp != hoverSection) {
            hoverSection = hoverSectionTemp;
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
            updateTooltip();
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

    function updateTooltip() {
        $tooltipDate.innerHTML = activeDate;
        console.log(chart.data.series.data);

        const innerHtml = `
        <li className='tooltip__company'>
            <img className='m-r-xs s-m' src='https://storage.googleapis.com/iex/api/logos/KMX.png' />
            KMX - <strong>$78.09</strong>
        </li>`;
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

}

export default hoverLabels;
