$(document).ready(function() {

    const $valueSpan = $('.valueSpan2');
    const $value = $('#customRange11');
    $valueSpan.html($value.val());
    $value.on('input change', () => {

        $valueSpan.html($value.val());
    });

    var pmdSliderStep = document.getElementById('pmd-slider-step');
    noUiSlider.create(pmdSliderStep, {
        start: [ 30 ],
        connect: 'lower',
        tooltips: [wNumb({ decimals: 0 }) ],
        range: {
            'min': [  0 ],
            'max': [ 500 ]
        },
        step: 10,

    });

    var pmdSliderRange = document.getElementById('pmd-slider-range');
	noUiSlider.create(pmdSliderRange, {
		start: [30, 75],
		connect: true,
		tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
		range: {
			'min': [0],
			'max': [100]
		},
        step: 10,
	});	
});