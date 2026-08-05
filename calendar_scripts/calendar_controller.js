function compareValues(inp, value){
    if(inp.prev_value.day === null && inp.prev_value.month === null && inp.prev_value.year === null){
        return (value.day === null || value.month === null || value.year === null)
    }
    let res = inp.prev_value.day === value.day && inp.prev_value.month === value.month && inp.prev_value.year === value.year;
    return res
}

class CaledarController{
    /**
     * 
     * @param {string} selector 
     * @param {DateInput} from_input 
     * @param {DateInput} to_input 
     */
    constructor(selector, from_input, to_input){

        this.is_error = false;

        this.onChange = (from_date, to_date) => {};

        this.body = document.querySelector(selector);
        this.to_input = to_input;
        this.from_input = from_input;
		
		this.from_date = {
			'year': this.from_input.input_year,
			'month': this.from_input.input_month,
			'day': this.from_input.input_day,
			'view_year': this.from_input.year,
			'view_month': this.from_input.month
		};
		
		this.to_date = {
			'year': this.to_input.input_year,
			'month': this.to_input.input_month,
			'day': this.to_input.input_day,
			'view_year': this.to_input.year,
			'view_month': this.to_input.month
		};

        this.to_input.onCalendarRender = () => {
            this.to_date.year = this.to_input.input_year;
            this.to_date.month = this.to_input.input_month;
            this.to_date.day = this.to_input.input_day;
            this.to_date.view_year = this.to_input.year;
            this.to_date.view_month = this.to_input.month;
			
			this.updateCalendars();
        }

        this.from_input.onCalendarRender = () => {
            this.from_date.year = this.from_input.input_year;
            this.from_date.month = this.from_input.input_month;
            this.from_date.day = this.from_input.input_day;
            this.from_date.view_year = this.from_input.year;
            this.from_date.view_month = this.from_input.month;

            this.updateCalendars();
        }

        this.actions_block = this.body.querySelector('.calendar_controller__actions');

        this.is_open = false;

        this.prev_error = false;

        this.actions_block.dataset.hide = "true";

        this.to_input.onOpen = () => {
            if(this.is_mobile)
                this.from_input.closePopup();
            if(this.is_open) return;
            this.prev_error = this.is_error;
            this.actions_block.dataset.hide = "false";
            this.is_open = true;
            this.to_input.setError('false');
            this.from_input.setError('false');
            this.body.dataset.error = 'false';
            this.actions[1].disabled = true;
            fill_all(this.from_input.calendar, "none");
            fill_all(this.to_input.calendar, "none");
            this.updateCalendars();
        }

        this.to_input.onClose = () => {
            if(!this.is_open) return;
            this.actions_block.dataset.hide = "true";
            this.is_open = false;
            this.updateCalendars();
        }
        
        this.from_input.onOpen = () => {
            if(this.is_mobile)
                this.to_input.closePopup();
            if(this.is_open) return;
            this.prev_error = this.is_error;
            this.to_input.setError('false');
            this.from_input.setError('false');
            this.body.dataset.error = 'false';
            this.actions_block.dataset.hide = "false";
            this.is_open = true;
            this.actions[1].disabled = true;
            fill_all(this.from_input.calendar, "none");
            fill_all(this.to_input.calendar, "none");
            this.updateCalendars();
        }

        this.from_input.onReset = () => {
            this.updateCalendars();
        }

        this.to_input.onReset = () => {
            this.updateCalendars();
        }

        this.from_input.onClose = () => {
            if(!this.is_open) return;
            this.actions_block.dataset.hide = "true";
            this.is_open = false;
            this.updateCalendars();
        }

        this.actions = this.body.querySelectorAll('.calendar_controller__actions > button')

        this.actions[0].onclick = () => {
            this.is_error = false;
            this.onChange(this.from_date, this.to_date);
            this.from_input.reset_btn.click();
            this.to_input.reset_btn.click();

            this.is_error = false;
            this.body.dataset.error = 'false';
            this.from_input.setError('false');
            this.to_input.setError('false');
        }

        if(this.to_date.day === null || this.from_date.day === null){
            this.actions[1].disabled = true;
        }

        this.actions[1].onclick = () => {
            this.onChange(this.from_date, this.to_date);
            this.to_input.closePopup();
            this.from_input.closePopup();
            this.to_input.prev_value = {
                'day': this.to_date.day,
                'month': this.to_date.month,
                'year': this.to_date.year
            }

            this.from_input.prev_value = {
                'day': this.from_date.day,
                'month': this.from_date.month,
                'year': this.from_date.year
            }
            if(this.is_error){
                this.to_input.setError('true');
                this.from_input.setError('true');
                this.body.dataset.error = 'true';
                this.body.querySelector('.calendar__error_container span').textContent = this.error_text;
            } else {
                this.to_input.setError('false');
                this.from_input.setError('false');
                this.body.dataset.error = 'false';
            }
			if(typeof window.main750=='object'){
			if(document.querySelector('.calendar__error_container').getBoundingClientRect().height<1){
				if(window.localStorage.getItem('fieldSettings_followers')){
					var settings=JSON.parse(window.localStorage.getItem('fieldSettings_followers'));
				} else {
					var settings={};
				}
				if(this.from_date['day'] && this.from_date['month'] && this.from_date['year']){
					settings['date_from']=this.from_date;
				}
				if(this.to_date['day'] && this.to_date['month'] && this.to_date['year']){
					if(settings['date_from']){
						if((settings['date_from']['year']+'.'+String(settings['date_from']['month']).padStart(2, '0')+'.'+String(settings['date_from']['month']).padStart(2, '0'))>(this.to_date['year']+'.'+String(this.to_date['month']).padStart(2, '0')+'.'+String(this.to_date['month']).padStart(2, '0'))){
							settings['date_to']=settings['date_from'];
						} else {
							settings['date_to']=this.to_date;
						}
					} else {
						settings['date_to']=this.to_date;
					}
				} else if(settings['date_from']){
					settings['date_to']=settings['date_from'];
				}
				window.localStorage.setItem('fieldSettings_followers', JSON.stringify(settings));
				window.main750.calendarInsert();
				window.main750.calendarClick();
				console.log(this.from_date, this.to_date);
			}
			}
        }

        document.addEventListener('click', e => {
            if(!this.body.contains(e.target) && this.is_open){
                this.to_input.fastClosePopup();
                this.from_input.fastClosePopup();
                this.is_error = this.prev_error;
                this.to_date.year = this.to_input.input_year;
                this.to_date.month = this.to_input.input_month;
                this.to_date.day = this.to_input.input_day;
                this.from_date.year = this.from_input.input_year;
                this.from_date.month = this.from_input.input_month;
                this.from_date.day = this.from_input.input_day;
                if(this.is_error){
                    this.to_input.setError('true');
                    this.from_input.setError('true');
                    this.body.dataset.error = 'true';
                    this.body.querySelector('.calendar__error_container span').textContent = this.error_text;
                } else {
                    this.to_input.setError('false');
                    this.from_input.setError('false');
                    this.body.dataset.error = 'false';
                }

                const today = new Date();
                if(this.to_date.year > today.getFullYear() || (
                    this.to_date.year === today.getFullYear() && (
                        this.to_date.month > today.getMonth() || (
                            this.to_date.month === today.getMonth() && (
                                this.to_date.day > today.getDate()
                            )
                        )
                    )
                ) && this.to_date.day !== null && this.to_date.month !== null && this.to_date.year !== null) {
                    this.error_text = 'Выберите дату не позднее сегодняшнего дня';
                    this.is_error = true;
                    this.body.dataset.error = 'true';
                    this.to_input.setError('true');
                    this.body.querySelector('.calendar__error_container span').textContent = this.error_text;
                }
            }
        })

        this.is_mobile = window.innerWidth <= 640;
        this.to_input.is_mobile = this.is_mobile;
        this.from_input.is_mobile = this.is_mobile;

        window.addEventListener('resize', () => {
            let width = window.innerWidth;
            if(width <= 640){
                this.is_mobile = true;
                this.to_input.is_mobile = true;
                this.from_input.is_mobile = true;
            } else {
                this.is_mobile = false;
                this.to_input.is_mobile = false;
                this.from_input.is_mobile = false;
            }
        })

    }

    updateCalendars(){
        fill_all(this.from_input.calendar, "none");
        fill_all(this.to_input.calendar, "none");
        this.actions[1].disabled = true;
        let is_correct = this.from_date.year < this.to_date.year || (
            this.from_date.year === this.to_date.year && (
                this.from_date.month < this.to_date.month || (
                    this.from_date.month === this.to_date.month && (
                        this.from_date.day < this.to_date.day
                    )
                )
            )
        ); // if from_date < to_date

        let any_null = this.from_date.year === null || this.from_date.month === null || this.from_date.day === null
        || this.to_date.year === null || this.to_date.month === null || this.to_date.day === null;
        
        this.is_error = !is_correct && !any_null;
        if(this.is_error){
            this.from_input.setError('true')
            this.error_text = 'Дата начала периода превышает дату окончания';
        }

        if(any_null && ((this.from_date.year !== null && this.from_date.month !== null && this.from_date.day !== null ||
            this.to_date.year !== null && this.to_date.month !== null && this.to_date.day !== null
        ))){
            this.is_error = false;
        }

        const today = new Date();
        if(this.to_date.year > today.getFullYear() || (
            this.to_date.year === today.getFullYear() && (
                this.to_date.month > today.getMonth() || (
                    this.to_date.month === today.getMonth() && (
                        this.to_date.day > today.getDate()
                    )
                )
            )
        )){
            this.is_error = true;
            this.error_text = 'Выберите дату не позднее сегодняшнего дня';
            this.to_input.setError('true');
        }
        if(this.from_date.year > today.getFullYear() || (
            this.from_date.year === today.getFullYear() && (
                this.from_date.month > today.getMonth() || (
                    this.from_date.month === today.getMonth() && (
                        this.from_date.day > today.getDate()
                    )
                )
            )
        )){
            this.is_error = true;
            this.error_text = 'Выберите дату не позднее сегодняшнего дня';
            this.from_input.setError('true');
        }

        if(this.is_error){
            this.body.dataset.error = 'true';
            this.body.querySelector('.calendar__error_container span').textContent = this.error_text;
        } else {
            this.body.dataset.error = 'false';
            this.to_input.setError('false');
            this.from_input.setError('false');
        }

        if(!any_null){
            this.actions[1].disabled = false;
        }

        if(this.is_mobile || 1){
            if(this.from_date.year !== null && this.from_date.month !== null && this.from_date.day !== null ||
                this.to_date.year !== null && this.to_date.month !== null && this.to_date.day !== null
            ) {
               if(!compareValues(this.from_input, this.from_date) || !compareValues(this.to_input, this.to_date)){
                   this.actions[1].disabled = false;
               } else {
                   this.actions[1].disabled = true;
               }
            }
        }

        if(any_null || !is_correct
        ){
            // if any date is not set, clear all ranges
            // or dates are not correct: from_date >= to_date
            fill_all(this.from_input.calendar, "none");
            fill_all(this.to_input.calendar, "none");
            // this.fill_points(this.from_input.calendar, {year: this.from_date.view_year, month: this.from_date.view_month});
            // this.fill_points(this.to_input.calendar, {year: this.to_date.view_year, month: this.to_date.view_month});

            return;
        }

        this.fill_caneldar(this.from_input.calendar, {year: this.from_date.view_year, month: this.from_date.view_month});
        this.fill_caneldar(this.to_input.calendar, {year: this.to_date.view_year, month: this.to_date.view_month});

    }

    fill_points(calendar, view = {year: null, month: null}){
        let first_day_of_month = new Date(view.year, view.month, 1).getDay() - 1;
        if(first_day_of_month < 0) first_day_of_month+=7;
        let p1 = -1;
        if(view.year === this.to_date.year && view.month === this.to_date.month){
            p1 = this.to_date.day;
        }
        let p2 = -1;
        if(view.year === this.from_date.year && view.month === this.from_date.month){
            p2 = this.from_date.day;
        }

        for(let i = 0; i < calendar.children.length; ++i){
            if(
                calendar.children[i].dataset.status!=="empty"
            ) {
                const cur_day = i - first_day_of_month + 1;
                if(cur_day === p1 || cur_day === p2){
                    calendar.children[i].dataset.range="point";
                }
            }
        }
    }

    fill_caneldar(calendar, view = {year: null, month: null}){
        let is_median = false;
        let start_fill = 33;
        let end_fill = -1;

        if(view.year === this.to_date.year && this.to_date.year === this.from_date.year){ // if years are equal
            if(view.month === this.to_date.month && this.to_date.month === this.from_date.month){
                start_fill = this.from_date.day;
                end_fill = this.to_date.day;
                is_median = false;
            } else if(
                this.from_date.month < view.month && view.month < this.to_date.month
            ) {
                is_median = true;
            } else if(
                view.month === this.to_date.month
            ) {
                end_fill = this.to_date.day;
                start_fill = -1;
            } else if(
                view.month === this.from_date.month
            ) {
                start_fill = this.from_date.day;
                end_fill = 33;
            }
        }

        if(view.year === this.to_date.year && this.to_date.year > this.from_date.year){
            if(view.month < this.to_date.month){
                is_median = true;
            }
            if(view.month === this.to_date.month){
                end_fill = this.to_date.day;
                start_fill = -1;
            }
        }

        if(view.year === this.from_date.year && this.from_date.year < this.to_date.year){   
            if(view.month > this.from_date.month){
                is_median = true;
            }
            if(view.month === this.from_date.month){
                start_fill = this.from_date.day;
                end_fill = 33;
            }
        }

        if(end_fill === null) end_fill = -1;
        if(start_fill === null) start_fill = 33;

        if(this.to_date.day === null){
            end_fill = -1;
        }

        if(this.from_date.day === null){
            start_fill = 33;
        }

        if(this.from_date.year < view.year && view.year < this.to_date.year){
            is_median = true;
        }

        if(is_median){
            fill_all(calendar, "range");
            return;
        }

        let first_day_of_month = new Date(view.year, view.month, 1).getDay() - 1;
        if(first_day_of_month < 0) first_day_of_month+=7;
        let days_in_current_month = new Date(view.year, view.month + 1, 0).getDate();

        for(let i = 0; i < 6 * 7; ++i){
            calendar.children[i].dataset.range = "none";
            if(calendar.children[i].dataset.status!=="empty"){
                let day = i - first_day_of_month + 1;
                if(day === start_fill || day === end_fill){
                    calendar.children[i].dataset.range = "point";
                }

                if(day > start_fill && day < end_fill){
                    calendar.children[i].dataset.range = "range";
                }
            }
        }
        
    }
    
}


function fill_all(calendar, fill="none"){
    for(let i = 0; i < calendar.children.length; ++i){
        if(
            calendar.children[i].dataset.status!=="empty"
        ) {
            calendar.children[i].dataset.range=fill;
        }
    }
}