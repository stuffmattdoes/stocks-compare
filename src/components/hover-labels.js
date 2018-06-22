import Chartist from 'chartist/dist/chartist.min.js';

const hoverLabels = options => chart => {
    const $chart = chart.container;
    let $toolTip = $chart.querySelector('.sparkline-tooltip');

    if (!$toolTip) {
        $toolTip = document.createElement('div');
        $toolTip.className = 'sparkline-tooltip';
        $chart.appendChild($toolTip);
    }

    const height = $toolTip.offsetHeight;
    const width = $toolTip.offsetWidth;
}

export default hoverLabels;
