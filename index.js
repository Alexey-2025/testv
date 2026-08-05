if(window.localStorage.getItem('fieldSettings_followers')){
	var settings=JSON.parse(window.localStorage.getItem('fieldSettings_followers'));
} else {
	var settings={};
}

const from_date=(settings['date_from']) ? new DateInput('.calendar__date_from_container', 'ОТ', settings['date_from']) : new DateInput('.calendar__date_from_container', 'ОТ', undefined);
const to_date=(settings['date_to']) ? new DateInput('.calendar__date_to_container', 'ДО', settings['date_to']) : new DateInput('.calendar__date_to_container', 'ДО', 'today');

const controller = new CaledarController('.calendar__container', from_date, to_date);

controller.onChange = console.log