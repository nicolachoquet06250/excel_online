function get_alphabet() {
	let alphabet = 'abcdefghijklmnopqrstuvw'.toUpperCase();
	return alphabet.split('');
}

function get_next_letter(current) {
	let alphabet = get_alphabet();
	for(let i in alphabet) {
		if(alphabet[i] === current) {
			if (alphabet[parseInt(i) + 1] !== undefined) {
				return alphabet[parseInt(i) + 1];
			}
		}
	}
}

function get_last_letter(tr) {
	return tr.querySelectorAll('th')[tr.querySelectorAll('th').length - 1].innerHTML;
}

function get_current_letter(i) {
	let alphabet = get_alphabet();
	return alphabet[i];
}

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
	let cmp_horizontal = 0;
	default_horizontal_header.forEach(letter => {
		let context_menu = '';
		if (cmp_horizontal === default_horizontal_header.length - 1) {
			context_menu = 'contextmenu="add-col-menu"';
		}
		horizontal_header += `<th ${context_menu} style="cursor: default;">${letter}</th>`;
		cmp_horizontal ++;
	});
	horizontal_header += `</tr>`;
	table.querySelector('thead').innerHTML = horizontal_header;

	// vertical header and cel
	table.querySelector('tbody').innerHTML = '';
	let lines = '';
	let cmp_vertical = 0;
	default_vertical_header.forEach(number => {
		let context_menu = '';
		if(cmp_vertical === default_vertical_header.length - 1 && cmp_horizontal === default_horizontal_header.length - 1) {
			context_menu = 'contextmenu="add-col-and-row-menu"';
		}
		else if(cmp_vertical === default_vertical_header.length - 1) {
			context_menu = 'contextmenu="add-row-menu"';
		}
		else if (cmp_horizontal === default_horizontal_header.length - 1) {
			context_menu = 'contextmenu="add-col-menu"';
		}
		lines += `<tr>
	<th ${context_menu} style="cursor: default;">${number}</th>`;
		cmp_horizontal = 0;
		default_horizontal_header.forEach(letter => {
			let context_menu = '';
			if(cmp_vertical === default_vertical_header.length - 1 && cmp_horizontal === default_horizontal_header.length - 1) {
				context_menu = 'contextmenu="add-col-and-row-menu"';
			}
			else if(cmp_vertical === default_vertical_header.length - 1) {
				context_menu = 'contextmenu="add-row-menu"';
			}
			else if (cmp_horizontal === default_horizontal_header.length - 1) {
				context_menu = 'contextmenu="add-col-menu"';
			}
			lines += `<td ${context_menu}>
	<input type="text" class="cel" placeholder="${letter}${number}" />
</td>`;
			cmp_horizontal++;
		});
		cmp_vertical++;
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

	// init toolbar
	document.querySelector('#toolbar').innerHTML = `<button class="add-row">Ajouter une ligne</button>
<button class="add-col">Ajouter une colonne</button>
<button class="add-row add-col">Ajouter une ligne et une colonne</button>`;
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

function add_table_col(id_html_table) {
	let table = document.querySelector(`#${id_html_table}`);
	let tr_header = table.querySelector('thead tr');
	tr_header.querySelectorAll('th')[tr_header.querySelectorAll('th').length - 1]
		.removeAttribute('contextmenu');
	let nb_tr = table.querySelectorAll('tbody tr').length;
	let tr_cmp = 0;
	table.querySelectorAll('tbody tr').forEach(tr => {
		if(tr_cmp < nb_tr - 1) {
			tr.querySelectorAll('td')[tr.querySelectorAll('td').length - 1].removeAttribute('contextmenu');
		}
		else {
			tr.querySelectorAll('td')[tr.querySelectorAll('td').length - 1].setAttribute('contextmenu', 'add-row-menu');
		}
		tr_cmp++;
	});
	let letter = get_next_letter(get_last_letter(tr_header));
	tr_header.innerHTML += `<th>${letter}</th>`;
	let number = 1;
	let trs = table.querySelectorAll('tbody tr');
	let max = trs.length;
	trs.forEach(tr => {
		tr.innerHTML += `<td><input type="text" class="cel" placeholder="${letter}${number}" contextmenu="${number < max ? 'add-col-menu' : 'add-col-and-row-menu'}" /></td>`;
		number++;
	})
}

function add_table_row(id_html_table) {
	let table = document.querySelector(`#${id_html_table}`);
	let next_number = table.querySelectorAll('tbody tr').length;
	let last_tr = table.querySelectorAll('tbody tr')[next_number - 1];

	let nb_td = 0;
	last_tr.querySelectorAll('td').forEach(td => {
		td.removeAttribute('contextmenu');
		nb_td++;
	});

	let str = `<tr>
	<th>${next_number + 1}</th>`;
	for(let i = 0; i < nb_td; i++) {
		str += `<td><input type="text" class="cel" placeholder="${get_current_letter(i)}${next_number + 1}" contextmenu="${next_number + 1 < nb_td ? 'add-row-menu' : 'add-col-and-row-menu'}" /></td>`;
	}
	str += `</tr>`;

	table.querySelector('tbody').innerHTML += str;
}

function calc_functions() {
	return {
		SOMME_COL: col => {
			let table_to_array = get_table_to_array(APPNAME);
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
			let table_to_array = get_table_to_array(APPNAME);
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