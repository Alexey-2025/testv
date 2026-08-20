"use strict"

function to2Digit(num){
    if(num === null) return '';
    return num < 10 ? `0${num}` : `${num}`;
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const MONTHS_FOR_FULL_DATE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const digits = '0123456789';

function isNumber(num){
    for(let i = 0; i < num.length; ++i){
        if(!digits.includes(num[i])){
            return false;
        }
    }

    return true;
}

class DateInput{
    /**
     * @param {string} selector selector of calendar__upper > div 
     * @param {'today' | null} defaultValue
     */
    constructor(selector, text, defaultValue = null){
		console.log(defaultValue);
        this.is_mobile = false;

        this.onCalendarRender = function(){};

        this.input_focus = false;

        this.value = null;
        this.year = null;
        this.month = null;
        this.day = null;

        this.input_year = null;
        this.input_month = null;
        this.input_day = null;

        this.element = document.querySelector(selector)

        if(!this.element){
            console.error(`Cannot get element by selector -  ${selector}`)
        } else{
            this.element.innerHTML = getCalendarBody(text);
        }

        this.params = {
            'viewType': 'dotted',
            'bg': 'none',
            'color': 'none',
            'error': 'none',
            'resetBtn': 'false'
        }

        this.inputs = this.element.querySelectorAll('input');

        if(!this.inputs){
            console.error(`Cannot get inputs`)
        }

        this.day_input = this.element.querySelector('[data-type="day"]');
        this.month_input = this.element.querySelector('[data-type="month"]');
        this.year_input = this.element.querySelector('[data-type="year"]');

        this.day_input.addEventListener('input', (e) => {
            this.onChangeDay(e);
        });
        this.month_input.addEventListener('input', (e) => {
            this.onChangeMonth(e);
        });
        this.year_input.addEventListener('input', (e) => {
            this.onChangeYear(e);
        });

        this.day_input.addEventListener('focusin', () => {
            this.need_reset = true;
        });
        this.month_input.addEventListener('focusin', () => {
            this.need_reset = true;
        });
        this.year_input.addEventListener('focusin', () => {
            this.need_reset = true;
        });

        this.day_input.addEventListener('focusout', this.to2DigitInput);
        this.month_input.addEventListener('focusout', this.to2DigitInput);

        this.full_date = this.element.querySelector('.calendar__upper__full_date');

        this.popup_year_title = this.element.querySelector('.calendar__calendar__year span');
        
        this.popup_year_section = this.element.querySelector('.calendar__calendar__year section');
        this.popup_year_block = this.element.querySelector('.calendar__calendar__year');

        this.popup_year_section.addEventListener('click', ()=>{this.openYearPopup();})
        
        this.year_popup = this.element.querySelector('.calendar__year_popup');

        this.year_popup_input = this.year_popup.querySelector('input');

        this.year_popup_input.addEventListener('input', (e) => {
            this.yearPopupInputChange(e);
        });

        this.year_popup_actions = this.year_popup.querySelector('.calendar__actions');

        this.year_popup_actions.children[0].addEventListener('click', () => {
            this.year_popup_input.value = '';
            this.yearPopupInputChange({target: {value: ''}});
        })
        this.year_popup_actions.children[1].addEventListener('click', () => {
            const year = parseInt(this.year_popup_input.value);
            
            if(isNaN(year)){
                return
            }

            this.year = year;
            this.setFullDate();
            this.setInputsValue();
            this.tryLoadFromInput();
            this.closeYearPopup();
            this.popup_year_title.textContent = String(this.year);
            this.popup_month_title.textContent = 'Выберите месяц';
        })

        this.month_popup = this.element.querySelector('.calendar__month_popup');

        for(let month of MONTHS){
            let div = document.createElement('div');
            div.textContent = month;
            div.addEventListener('click', ()=>{
                this.month = MONTHS.indexOf(month);
                this.setFullDate();
                this.setInputsValue();
                this.tryLoadFromInput();
                this.popup_month_title.textContent = MONTHS[this.month];
                this.closeMonthPopup();
            })
            this.month_popup.appendChild(div);
        }

        this.popup_month_title = this.element.querySelector('.calendar__calendar__month span');

        this.popup_month_block = this.element.querySelector('.calendar__calendar__month');
        this.popup_month_block.querySelector('section').addEventListener('click', ()=>{this.openMonthPopup();})
        this.calendar = this.element.querySelector('.calendar__calendar__calendar');
        this.calendar__week_days = this.element.querySelector('.calendar__calendar__days_of_week');

        // init config of input
        if(defaultValue !== null){
			if(typeof defaultValue=='object' && defaultValue['year'] && defaultValue['month'] && defaultValue['day']){
				this.value = new Date(defaultValue['year'], defaultValue['month'], defaultValue['day']);
			} else {
				this.value = new Date();
			}
            this.year = this.value.getFullYear();
            this.month = this.value.getMonth();
            this.day = this.value.getDate();
            this.input_day = this.day;
            this.input_month = this.month;
            this.input_year = this.year;
            this.calendar.dataset.hide="false";
            this.calendar__week_days.dataset.hide="false";

            this.popup_year_title.textContent = String(this.year);
            this.popup_month_title.textContent = MONTHS[this.month];

            this.setFullDate();

            this.setInputsValue();

            this.setViewType('full');

            this.setBg('white');
            this.setColor('blue');
            this.setResetBtn('true');
        } else {
            this.popup_year_title.textContent = 'Выберите год';
            this.popup_month_title.textContent = 'Выберите месяц';
            this.calendar__week_days.dataset.hide="true";
            this.calendar.dataset.hide="true";
            this.setBg('gray');
            this.setColor('none');
            this.setResetBtn('false');
        }

        // this.disableInputs();

        this.popup_year_prev = this.element.querySelector('.calendar__calendar__year .prev');
        this.popup_year_next = this.element.querySelector('.calendar__calendar__year .next');

        if(this.year >= new Date().getFullYear()){
            this.popup_year_next.classList.add('disabled');
        }

        if(this.year <= 1996){
            this.popup_year_prev.classList.add('disabled');
        }

        this.popup_year_prev.addEventListener('click', () => {
            if(this.year === null) return;
            if(this.year > 1996){
                this.year -= 1;
                this.loadCalendar();
                this.popup_year_next.classList.remove('disabled');

                if(this.year === 1996){
                    this.popup_year_prev.classList.add('disabled');
                }

            } else {
                this.popup_year_prev.classList.add('disabled');
            }
            this.popup_year_title.textContent = String(this.year);
            this.popup_month_title.textContent = MONTHS[this.month];
        })

        this.popup_year_next.addEventListener('click', () => {
            if(this.year === null) return;
            if(this.year < new Date().getFullYear()){
                this.year += 1;
                this.loadCalendar();
                this.popup_year_prev.classList.remove('disabled');

                if(this.year === new Date().getFullYear()){
                    this.popup_year_next.classList.add('disabled');
                }
                this.popup_year_title.textContent = String(this.year);
                this.popup_month_title.textContent = MONTHS[this.month];

            } else {
                this.popup_year_next.classList.add('disabled');
            }
        })

        this.popup_month_prev = this.element.querySelector('.calendar__calendar__month .prev');
        this.popup_month_next = this.element.querySelector('.calendar__calendar__month .next');

        this.popup_month_prev.addEventListener('click', () => {
            if(this.month === null) return;
            if(this.month > 0){
                this.month -= 1;
            } else {
                this.year--;
                this.month = 11;
            }

            this.popup_year_title.textContent = String(this.year);
            this.popup_month_title.textContent = MONTHS[this.month];

            this.loadCalendar();
        })

        this.popup_month_next.addEventListener('click', () => {
            if(this.month === null) return;
            if(this.month < 11){
                this.month += 1;
            } else {
                this.year++;
                this.month = 0;
            }

            this.popup_year_title.textContent = String(this.year);
            this.popup_month_title.textContent = MONTHS[this.month];

            this.loadCalendar();
        })

        this.is_open = false;

        this.date_part = this.element.querySelector('.calendar__upper__date_part');

        this.popup_container = this.element.querySelector('.calendar__calendar');

        this.reset_btn = this.element.querySelector('.calendar__reset_icon');

        this.reset_btn.addEventListener('click', () => {
            this.resetCalendar();
            this.onCalendarRender();
        })

        this.onOpen = () => {};

        this.onClose = () => {};

        this.onReset = () => {};

        this.prev_value = {
            'year': this.year === null ? this.input_year : this.year,
            'month': this.month === null ? this.input_month : this.month,
            'day': this.day === null ? this.input_day : this.day
        }

        this.date_part.addEventListener('click', (e) => {
            if(!this.is_open){

                this.prev_value = {
                    'year': this.year === null ? this.input_year : this.year,
                    'month': this.month === null ? this.input_month : this.month,
                    'day': this.day === null ? this.input_day : this.day
                }

                // console.log(this.prev_value);

                this.is_open = true;

                this.setBg('white')

                if(this.month !== null && this.year !== null){
                    this.calendar.dataset.hide="false";
                    this.calendar__week_days.dataset.hide="false";
                } else{
                    this.calendar.dataset.hide="true";
                    this.calendar__week_days.dataset.hide="true";
                }

                this.setViewType('dotted');
                
                this.popup_container.dataset.hide="false";
                this.setColor('none');
                this.prev_value = {
                    'year': this.year,
                    'month': this.month,
                    'day': this.day
                }
                this.activateInputs();

                this.onOpen();
            }
        })

        this.need_reset = false;

        document.addEventListener('click', (e) => {
            if(!this.need_reset) return
            if(!this.element.contains(e.target) || e.target === this.reset_btn || this.reset_btn.contains(e.target)){
                return
            }
            if(e.target !== this.day_input && e.target !== this.month_input && e.target !== this.year_input){
                if(this.day_input.value === '' || this.month_input.value === '' || this.year_input.value === ''){
                    this.day_input.value = to2Digit(this.prev_value.day);
                    if(this.prev_value.month === null){
                        this.month_input.value = '';
                    } else{
                        this.month_input.value = to2Digit(this.prev_value.month + 1);
                    }
                    this.year_input.value = this.prev_value.year;
                    this.input_day = this.prev_value.day;
                    this.input_month = this.prev_value.month;
                    this.input_year = this.prev_value.year;
                    this.year = this.prev_value.year;
                    this.month = this.prev_value.month;
                    this.day = this.prev_value.day;
                    this.tryLoadFromInput();
                }
            }
        })

        for(let i = 0; i < 6 * 7; ++i){
            const div = document.createElement('div');
            this.calendar.appendChild(div);
        }

        this.element.querySelectorAll('.calendar__year_popup__mobile .calendar__year_popup__mobile__close').forEach((el) => {
            el.addEventListener('click', () => {
                this.closeYearPopup();
            })
        })

        this.element.querySelectorAll('.calendar__month_popup_mobile .calendar__year_popup__mobile__close').forEach((el) => {
            el.addEventListener('click', () => {
                this.closeMonthPopup();
            })
        })
        
        this.element.querySelectorAll('.calendar__year_popup__mobile__clear').forEach((el) => {
            el.addEventListener('click', () => {
                console.log(`clicked`)
                this.year_popup_input.value = '';
                this.yearPopupInputChange({target: this.year_popup_input});
            })
        })

        this.loadCalendar();

        this.loadYearsPopupValues();

        this.updateParams();
    }

    fastClosePopup(){
        console.log(this.prev_value)
        this.need_reset = false;

        if(this.prev_value.day === null &&
            this.prev_value.month === null &&
            this.prev_value.year === null
        ) {
            this.setResetBtn('false');
            this.setBg('gray');
        }

        this.input_day = this.prev_value.day;
        this.input_month = this.prev_value.month;
        this.input_year = this.prev_value.year;
        this.day = this.prev_value.day;
        this.month = this.prev_value.month;
        this.year = this.prev_value.year;
        this.day_input.value = to2Digit(this.prev_value.day);
        this.month_input.value = to2Digit(this.prev_value.month + 1);
        this.year_input.value = this.prev_value.year;
        this.popup_year_title.textContent = String(this.year);
        this.popup_month_title.textContent =  MONTHS[this.month];

        this.closePopup();
    }

    closePopup(){


        this.need_reset = false;

        this.onClose();
        this.closeMonthPopup();
        this.closeYearPopup();
        
        this.is_open = false;

        if(this.input_year !== null && this.input_month !== null && this.input_day !== null){
            this.tryLoadFromInput();
            this.setViewType('full');
            this.setColor('blue');
            this.setFullDate();
            this.setBg('white');
        } else {
            this.year = null;
            this.month = null;
            this.day = null;
            this.input_day = null;
            this.input_month = null;
            this.input_year = null;
            this.popup_year_title.textContent = 'Выберите год';
            this.popup_month_title.textContent =  'Выберите месяц';
            this.setInputsValue();
            this.setViewType('dotted');
            this.setColor('none');
            this.setBg('gray');
        }

        this.popup_container.dataset.hide="true";
        // this.disableInputs();

    }

    resetCalendar(){
        this.value = null;
        this.year = null;
        this.month = null;
        this.day = null;
        this.input_day = null;
        this.input_month = null;
        this.input_year = null;
        this.day_input.value = '';
        this.month_input.value = '';
        this.year_input.value = '';
        this.setFullDate();
        this.setInputsValue();
        this.popup_year_title.textContent = 'Выберите год';
        this.popup_month_title.textContent = 'Выберите месяц';
        this.calendar__week_days.dataset.hide="true";
        this.calendar.dataset.hide="true";
        this.setViewType('dotted');
        this.setColor('none');
        this.setBg('gray');
        this.setResetBtn('false');
        this.closePopup();

        this.prev_value = {
            'day': null,
            'month': null,
            'year': null
        }

        this.onReset();
    }

    loadYearsPopupValues(){
        const container = this.year_popup.querySelector('.calendar__years_grid');

        for(let year = new Date().getFullYear(); year >= 1996; --year){
            const div = document.createElement('div');

            div.textContent = String(year);
            div.addEventListener('click', () => {
                this.year = year;
                this.month = null;
                this.day = null;
                this.setFullDate();
                this.setInputsValue();
                this.closeYearPopup();
                this.popup_year_title.textContent = String(this.year);
                this.popup_month_title.textContent = 'Выберите месяц';
                for(let i = 0; i < container.children.length; ++i){
                    container.children[i].dataset.active="false";
                }

                div.dataset.active="true";
            })
            container.appendChild(div);
        }
    }

    yearPopupInputChange(e){
        let year_s = e.target.value;

        if(year_s.length > 0){
            this.year_popup_actions.children[0].disabled = false;
        } else{
            this.year_popup_actions.children[0].disabled = true;
        }
        if(year_s.length === 4){
            this.year_popup_actions.children[1].disabled = false;
        } else{
            this.year_popup_actions.children[1].disabled = true;
        }

        let year = parseInt(year_s);

        // filter grid values

        const grid = this.year_popup.querySelector('.calendar__years_grid');

        for(let i = 0; i < grid.children.length; ++i){
            grid.children[i].dataset.hide="false";
            let value = grid.children[i].textContent;
            // if search_value in value

            if(value.indexOf(year_s) !== 0 && year_s !== '') {
                grid.children[i].dataset.hide="true";
            }
        }

    }

    closeYearPopup(){
        if(this.year_popup.dataset.hide!=="false"){
            return;
        }
        this.calendar.dataset.openpopup="false";
        this.month_popup.dataset.hide="true";
        this.year_popup.dataset.hide="true";
        if(this.year !== null && this.month !== null){
            this.calendar.dataset.hide="false";
            this.calendar__week_days.dataset.hide="false";
        }
        this.popup_month_block.dataset.hide="false"
        this.popup_year_block.dataset.hide="false";;
    }

    openYearPopup(){
        this.need_reset = false;
        this.calendar.dataset.openpopup="true";
        this.month_popup.dataset.hide="true";
        this.year_popup_input.value = '';
        this.year_popup.dataset.hide="false";
        this.calendar.dataset.hide="true";
        this.calendar__week_days.dataset.hide="true";
        this.popup_month_block.dataset.hide="true";
        this.popup_year_block.dataset.hide="true";
        this.year_popup_actions.children[0].disabled = true;
        this.year_popup_actions.children[1].disabled = true;
        if(!this.is_mobile){
            this.year_popup_input.focus();
            this.year_popup_input.placeholder = '';
        } else {
            this.year_popup_input.placeholder = 'Поиск';
        }

        const grid = this.year_popup.querySelector('.calendar__years_grid');

        for(let i = 0; i < grid.children.length; ++i){
            grid.children[i].dataset.hide="false";
            grid.children[i].dataset.active="false";
            let value = grid.children[i].textContent;
            if(value === String(this.year)){
                grid.children[i].dataset.active="true";
            }
        }
    }

    openMonthPopup(){
        this.need_reset = false;
        if(this.year === null) return;
        this.calendar.dataset.openpopup="true";

        this.value = null;

        this.month_popup.dataset.hide="false";
        this.year_popup.dataset.hide="true";
        this.calendar.dataset.hide="true";
        this.calendar__week_days.dataset.hide="true";
        this.popup_month_block.dataset.hide="true";
    }

    closeMonthPopup(){

        if(this.month_popup.dataset.hide!=="false"){
            return;
        }
        this.calendar.dataset.openpopup="false";
        this.month_popup.dataset.hide="true";
        this.popup_month_block.dataset.hide="false";

        if(this.year !== null && this.month !== null){
            this.calendar.dataset.hide="false";
            this.calendar__week_days.dataset.hide="false";
            this.day = null;
            this.loadCalendar();
        }
    }

    setFullDate(){
        this.full_date.textContent = `${this.day === null ? this.input_day : this.day} ${MONTHS_FOR_FULL_DATE[this.month]} ${this.year}`;
    }

    to2DigitInput(){
        if(this.value.length < 2 && this.value !== ''){
            this.value = `0${this.value}`;
        }
    }

    setInputsValue(){
        
        if(this.day !== null){
            this.day_input.value = to2Digit(this.day);
        } else {
            this.day_input.value = '';
        }

        if(this.month !== null){
            this.month_input.value = to2Digit(this.month + 1);
        } else {
            this.month_input.value = '';
        }

        if(this.year !== null){
            this.year_input.value = this.year;
        } else {
            this.year_input.value = '';
        }

        this.input_day = this.day;
        this.input_month = this.month;
        this.input_year = this.year;

        let any_value_in_input = this.input_day !== null || this.input_month !== null || this.input_year !== null;

        if(any_value_in_input){
            this.setResetBtn('true');
        }
    }

    onChangeDay(e){
        if(e.target.value === '' && this.year_input.value === '' && this.month_input.value === '') {
            this.setResetBtn('false');
        }

        let day = e.target.value;

        if(!isNumber(day)){
            e.target.value = e.target.value.slice(0, -1);
            return;
        }

        if(day === '00'){
            e.target.value = e.target.value.slice(0, -1);
            return;
        }

        if(day.length === 2){
            if(parseInt(day[0]) > 3){
                e.target.value = e.target.value.slice(0, -1);
                return;
            }

            if(parseInt(day) > 31){
                e.target.value = e.target.value.slice(0, -1);
                return;
            }
        }

        day = parseInt(day);

        if(isNaN(day)){
            return
        }

        this.input_day = day;

        if(e.target.value.length === 2 || day > 3){
            e.target.blur();
            this.month_input.focus();
        }
        this.setResetBtn('true');

        this.tryLoadFromInput();
    }

    onChangeMonth(e){
        if(e.target.value === '' && this.day_input.value === '' && this.year_input.value === '') {
            this.setResetBtn('false');
        }
        let month = e.target.value;

        if(!isNumber(e.target.value)){
            e.target.value = e.target.value.slice(0, -1);
        }

        if(month === '00'){
            e.target.value = e.target.value.slice(0, -1);
            return;
        }

        if(month.length === 2){
            if(parseInt(month[0]) > 1){
                e.target.value = e.target.value.slice(0, -1);
                return;
            }

            if(parseInt(month) > 12){
                e.target.value = e.target.value.slice(0, -1);
                return;
            }
        }

        month = parseInt(month);

        if(isNaN(month)){
            this.popup_month_title.textContent = 'Выберите месяц';
            return
        }

        if(e.target.value.length === 2 || month > 1){
            e.target.blur();
            this.year_input.focus();
        }

        this.input_month = month - 1;

        this.setResetBtn('true');

        this.popup_month_title.textContent = MONTHS[this.input_month];

        this.tryLoadFromInput();
    }

    onChangeYear(e){
        if(e.target.value === '' && this.day_input.value === '' && this.month_input.value === '') {
            this.setResetBtn('false');
        }
        let year = e.target.value;

        if(!isNumber(e.target.value)){
            e.target.value = e.target.value.slice(0, -1);
        }

        if(year.length === 0){
            return;
        }

        if(parseInt(year[0]) === 0 || parseInt(year[0]) > 2){
            e.target.value = e.target.value.slice(0, -1);
            return;
        }

        year = parseInt(year);

        if(isNaN(year)){
            this.popup_year_title.textContent = 'Выберите год';
            return
        }

        this.setResetBtn('true');

        this.input_year = year;
        this.popup_year_title.textContent = String(this.input_year);

        this.tryLoadFromInput();
    }

    tryLoadFromInput(){
        if(this.input_year !== null && this.input_month !== null && this.input_day !== null){
            this.year = this.input_year;
            this.month = this.input_month;
            this.day = this.input_day;
            this.value = new Date(this.year, this.month, this.day);
            this.popup_year_title.textContent = String(this.year);
            this.popup_month_title.textContent = MONTHS[this.month];
            this.setResetBtn('true');
            this.loadCalendar();
            this.calendar__week_days.dataset.hide="false";
            this.calendar.dataset.hide="false";
            this.closeMonthPopup();
            this.closeYearPopup();
        } else if(
            this.input_year !== null && this.input_month !== null
        ) {
            this.year = this.input_year;
            this.month = this.input_month;
            this.day = this.input_day;
            this.value = new Date(this.year, this.month, this.day);
            this.popup_year_title.textContent = String(this.year);
            this.popup_month_title.textContent = MONTHS[this.month];
            this.setResetBtn('true');
            this.loadCalendar();
            this.calendar__week_days.dataset.hide="false";
            this.calendar.dataset.hide="false";
            this.closeMonthPopup();
            this.closeYearPopup();
        }
    }

    setViewType(view_type){
        this.params['viewType'] = view_type;
        this.updateParams();
    }

    setBg(bg){
        this.params['bg'] = bg;
        this.updateParams();
    }

    setColor(color){
        this.params['color'] = color;
        this.updateParams();
    }

    setError(error){
        this.params['error'] = error;
        this.updateParams();
    }

    setResetBtn(reset){
        this.params['resetBtn'] = reset;
        this.updateParams();
    }

    updateParams(){
        for(let i in this.params){
            this.element.dataset[i] = this.params[i];
        }
    }

    disableInputs(){
        for(let inp of this.inputs){
            inp.disabled = true;
        }
    }

    activateInputs(){
        for(let inp of this.inputs){
            inp.disabled = false;
        }
    }

    loadCalendar(){

        if(this.value === null || this.month !== this.value.getMonth() || this.year !== this.value.getFullYear() || this.day === null){
            if(this.month !== null && this.year !== null){
                let first_day_of_month = new Date(this.year, this.month, 1).getDay() - 1;
                if(first_day_of_month < 0) first_day_of_month = 7 + first_day_of_month;

                const days_in_current_month = new Date(this.year, this.month + 1, 0).getDate();

                for(let i = 0; i < 6 * 7; ++i){
                    this.calendar.children[i].dataset.range="none";
                    this.calendar.children[i].dataset.last="";
                    if(i < first_day_of_month || i >= first_day_of_month + days_in_current_month){
                        this.calendar.children[i].dataset.status="empty";
                        this.calendar.children[i].textContent = "";

                        this.calendar.children[i].onclick = null;
                    } else {
                        this.calendar.children[i].dataset.status="active";
                        this.calendar.children[i].textContent = i - first_day_of_month + 1;
                        if(i - first_day_of_month + 1 === days_in_current_month){
                            if(i < 6 * 7 - 1){
                                this.calendar.children[i + 1].dataset.last="last";
                            }
                        }

                        this.calendar.children[i].onclick = () => {
                            this.value = new Date(this.year, this.month, i - first_day_of_month + 1);
                            this.day = i - first_day_of_month + 1;
                            this.input_day = i - first_day_of_month + 1;
                            this.input_month = this.month;
                            this.input_year = this.year;
                            this.setFullDate();
                            this.setInputsValue();
                            this.day_input.value = to2Digit(this.day);
                            this.loadCalendar();
                        }
                    }

                    if(i - first_day_of_month === days_in_current_month){
                        this.calendar.children[i].dataset.last="last";
                    }
                }
                this.onCalendarRender();
            }
            return;
        }

        const current_day = this.value.getDate();

        let first_day_of_month = new Date(this.value.getFullYear(), this.value.getMonth(), 1).getDay() - 1;

        if(first_day_of_month < 0 ) first_day_of_month = 7 + first_day_of_month;

        const days_in_current_month = new Date(this.value.getFullYear(), this.value.getMonth() + 1, 0).getDate();

        const calendar_blocks = this.calendar.children;

        for(let i = 0; i < 6 * 7; ++i){

            calendar_blocks[i].dataset.last="";
            calendar_blocks[i].dataset.range="";

            calendar_blocks[i].onclick = () => {};

            if(i < first_day_of_month || i >= first_day_of_month + days_in_current_month){
                calendar_blocks[i].dataset.status="empty";
                calendar_blocks[i].textContent = "";
                calendar_blocks[i].onclick = null;
            } else {
                calendar_blocks[i].dataset.status="active";
                calendar_blocks[i].textContent = i - first_day_of_month + 1;
                if(i - first_day_of_month + 1 === current_day){
                    calendar_blocks[i].dataset.status="today";
                } else {
                    calendar_blocks[i].onclick = () => {
                        let calc_year = this.value?.getFullYear();
                        if(calc_year === undefined){
                            calc_year = this.year;
                        }
                        let calc_month = this.value?.getMonth();
                        if(calc_month === undefined){
                            calc_month = this.month;
                        }
                        this.value = new Date(calc_year, calc_month, i - first_day_of_month + 1);
                        this.day = i - first_day_of_month + 1;
                        this.input_day = i - first_day_of_month + 1;
                        this.input_month = this.month;
                        this.input_year = this.year;
                        this.setFullDate();
                        this.day_input.value = to2Digit(this.day);
                        this.loadCalendar();
                    }
                }
            }


            if(i - first_day_of_month === days_in_current_month){
                calendar_blocks[i].dataset.last="last";
            }
        }
        this.onCalendarRender();
    }

}