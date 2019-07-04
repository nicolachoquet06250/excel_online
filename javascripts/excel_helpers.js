function cel_exists(position) {
	return document.querySelector(`.cel[placeholder='${position}']`) !== null;
}

function get_cel(position) {
	return document.querySelector(`.cel[placeholder='${position}']`);
}

function set_equation_to_cel(position, equation) {
	get_cel(position).setAttribute('equation', equation);
}

function set_result_to_cel(position, result) {
	get_cel(position).setAttribute('result', result);
}

function get_equations_with_real_values(equation, cmp = 0) {
	let m;
	if((m = /([A-Z][0-9])/.exec(equation)) !== null) {
		let member = m[0];
		let member_value = cel_exists(member) && get_cel(member).value !== '' ? get_cel(member).value : 'NaN';
		if(member_value === 'NaN') {
			return 'NaN';
		}
		return get_equations_with_real_values(equation.replace(member, member_value), cmp);
	}
	else return equation;
}

function init_excel(id_html_table, default_focus, default_horizontal_header, default_vertical_header) {
	let table = document.querySelector(`#${id_html_table}`);
	// header horizontal
	let horizontal_header = `<tr>
	<th></th>`;
	default_horizontal_header.forEach(letter => {
		horizontal_header += `<th>${letter}</th>`;
	});
	horizontal_header += `</tr>`;
	table.querySelector('thead').innerHTML = horizontal_header;

	// vertical header and cel
	table.querySelector('tbody').innerHTML = '';
	let lines = '';
	default_vertical_header.forEach(number => {
		lines += `<tr>
	<th>${number}</th>`;
		default_horizontal_header.forEach(letter => {
			lines += `<td>
	<input type="text" class="cel" placeholder="${letter}${number}" />
</td>`;
		});
		lines += '</tr>';
	});
	table.querySelector('tbody').innerHTML += lines;

	// init focus
	document.querySelectorAll('.cel').forEach(cel => {
		if(cel.getAttribute('placeholder') === default_focus) {
			cel.focus();
		}
		document.querySelector('.expression').setAttribute('placeholder', default_focus);
	});
}

function get_expression() {
	return document.querySelector('.expression');
}

function get_table_to_array(id_html_table) {
	let table = document.querySelector(`#${id_html_table}`);
	let object = {};
	table.querySelectorAll('.cel').forEach(cel => {
		object[cel.getAttribute('placeholder')] = cel.value;
	});
	return object;
}

function get_detect_equation_regex() {
	return /\=([A-Z0-9\*\-\+\%\/\(\)]+)/;
}

function get_detect_function_calc_regex() {
	return /\=([A-Z0-9\_\(\)\'\"\,\ ]+)/;
}

function add_col(id_html_table) {

}

function add_row(id_html_table) {

}

function calc_functions() {
	return {
		SOMME_COL: col => {
			let table_to_array = get_table_to_array('excel');
			let _array = [];
			for(let key in table_to_array) {
				if(key.indexOf(col) !== -1) {
					if(!isNaN(parseInt(table_to_array[key]))) {
						_array.push(parseInt(table_to_array[key]));
					}
				}
			}
			let somme = 0;
			_array.forEach(value => somme += value);
			return somme;
		},
		SOMME_ROW: row => {
			let table_to_array = get_table_to_array('excel');
			let _array = [];
			for(let key in table_to_array) {
				if(key.indexOf(row) !== -1) {
					if(!isNaN(parseInt(table_to_array[key]))) {
						_array.push(parseInt(table_to_array[key]));
					}
				}
			}
			let somme = 0;
			_array.forEach(value => somme += value);
			return somme;
		},
		SOMME_VALUES: (...values) => {
			let somme = 0;
			values.forEach(value => somme += value)
			return somme;
		}
	}
}

function calc_func_exists(func) {
	return func in calc_functions();
}