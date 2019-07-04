window.addEventListener('load', () => {
	init_excel('excel', 'A1', ['A', 'B', 'C', 'D'], ['1', '2', '3', '4']);

	document.querySelectorAll('.cel').forEach(cel => {
		let place = cel.getAttribute('placeholder');
		cel.addEventListener('keyup', () => {
			let origin_equation = cel.value;
			let matches;
			if ((matches = get_detect_function_calc_regex().exec(origin_equation)) !== null && matches[1].split('(')[0] in calc_functions()) {
				console.log(matches[1].split('(')[0] in calc_functions());
				let func = matches[1];

				let equation = func;

				let result = NaN;
				eval(`result = calc_functions().${equation}; result = result.toString();`);
				set_equation_to_cel(place, origin_equation);
				set_result_to_cel(place, result);
			}
			else if ((matches = get_detect_equation_regex().exec(origin_equation)) !== null) {
				let equation = matches[1];

				equation = get_equations_with_real_values(equation);

				let result = NaN;
				eval(`result = ${equation}; result = result.toString();`);
				set_equation_to_cel(place, origin_equation);
				set_result_to_cel(place, result);
			}
			document.querySelector('.expression').value = cel.value;
		});

		cel.addEventListener('focus', () => {
			if(cel.hasAttribute('equation')) {
				cel.value = cel.getAttribute('equation');
			}
			document.querySelector('.expression')
				.setAttribute('position', cel.getAttribute('placeholder'));
			document.querySelector('.expression').value = cel.value;
			document.querySelector('.expression')
				.setAttribute('placeholder', cel.getAttribute('placeholder'));
		});

		cel.addEventListener('blur', () => {
			if(cel.hasAttribute('equation')) {
				cel.value = cel.getAttribute('result');
			}
			else {
				document.querySelectorAll('.cel').forEach(_cel => {
					if(_cel.getAttribute('placeholder') !== place) {
						if(_cel.hasAttribute('equation')) {
							let place = cel.getAttribute('placeholder');
							let current_place = _cel.getAttribute('placeholder');
							let current_equation = _cel.getAttribute('equation');
							let matches;
							if ((matches = get_detect_equation_regex().exec(current_equation)) !== null) {
								matches.shift();
								let equation = matches[0];
								if(equation.indexOf(place) !== -1) {

									equation = get_equations_with_real_values(equation);

									let result = 'NaN';
									eval(`result = ${equation}; result = result.toString();`);
									result = parseInt(result);
									set_equation_to_cel(current_place, current_equation);
									set_result_to_cel(current_place, result);
									_cel.value = result;
								}
							}
							else if ((matches = get_detect_function_calc_regex().exec(current_equation)) !== null) {
								console.log(matches);
							}
						}
					}
				});
			}
		});
	});

	get_expression().addEventListener('keyup', () => {
		let position = get_expression().getAttribute('position');
		get_cel(position).value = get_expression().value;
		let origin_equation = get_cel(position).value;
		let matches;
		if ((matches = get_detect_function_calc_regex().exec(origin_equation)) !== null) {
			console.log(matches[1].split('(')[0] in calc_functions());
			let func = matches[1];

			let equation = func;

			let result = NaN;
			eval(`result = calc_functions().${equation}; result = result.toString();`);
			set_equation_to_cel(place, origin_equation);
			set_result_to_cel(place, result);
		}
		else if ((matches = get_detect_equation_regex().exec(origin_equation)) !== null) {
			matches.shift();
			let equation = matches[0];

			equation = get_equations_with_real_values(equation);

			let result = 0;
			eval(`result = ${equation}`);
			set_equation_to_cel(position, origin_equation);
			set_result_to_cel(position, result);
		}
	});

	get_expression().addEventListener('focus', () => {
		let position = get_expression().getAttribute('position');
		let cel = get_cel(position);
		if(cel.hasAttribute('equation')) {
			cel.value = cel.getAttribute('equation');
		}
		get_expression().setAttribute('position', cel.getAttribute('placeholder'));
		get_expression().value = cel.value;
	});

	get_expression().addEventListener('blur', () => {
		let position = get_expression().getAttribute('position');
		let cel = get_cel(position);
		if(cel.hasAttribute('equation')) {
			cel.value = cel.getAttribute('result');
		}
		else {
			document.querySelectorAll('.cel').forEach(_cel => {
				if(_cel.getAttribute('placeholder') !== position) {
					if(_cel.hasAttribute('equation')) {
						let place = cel.getAttribute('placeholder');
						let current_place = _cel.getAttribute('placeholder');
						let current_equation = _cel.getAttribute('equation');
						let matches;
						if ((matches = get_detect_equation_regex().exec(current_equation)) !== null) {
							matches.shift();
							let equation = matches[0];
							if(equation.indexOf(place) !== -1) {

								equation = get_equations_with_real_values(equation);

								let result = 'NaN';
								eval(`result = '${equation}';`);
								result = parseInt(result);
								set_equation_to_cel(current_place, current_equation);
								set_result_to_cel(current_place, result);
								_cel.value = result;
							}
						}
						else if ((matches = get_detect_function_calc_regex().exec(current_equation)) !== null) {
							console.log(matches);
						}
					}
				}
			});
		}
	});

	// get_cel('A1').value = '10';
	// get_cel('A2').value = '20';
	// get_cel('A3').value = '5';
	// get_cel('A4').value = '0';
	//
	// get_cel('B1').value = '20';
	// get_cel('C1').value = '5';
	// get_cel('D1').value = '10';
	//
	// console.log(calc_functions().SOMME_COL`A`);
	// console.log(calc_functions().SOMME_ROW`1`);
	// console.log(calc_functions().SOMME_VALUES(10, 20, 5, 0));
});