function getCalendarBody(text) {

    const CALENDAR_BODY = `
    <div class="calendar__upper__date_part">
    <span class="calendar__upper__help_text">
        ДАТА&nbsp;
    </span>
    <span class="calendar__upper__help_text">
        ${text}&nbsp;
    </span>
    <span class="calendar__upper_dotted_formated_date">
        <span class="calendar__upper_dotted_formated_date__day__input__container">
            <input 
            type="text" 
            class="calendar__upper_dotted_formated_date__day__input calendar_input___"
            placeholder="ДД"
            maxlength="2"
            pattern="\d{2}"
            data-type="day"
            >
        </span>
        <span class="calendar__upper_dotted_formated_date__day__input__container">
            <input 
            type="text" 
            class="calendar__upper_dotted_formated_date__day__input calendar_input___"
            placeholder="ММ"
            maxlength="2"
            pattern="\d{2}"
            data-type="month"
            >
        </span>
        <input 
        type="text" 
        class="calendar__upper_dotted_formated_date__year__input calendar_input___"
        placeholder="ГГГГ"
        maxlength="4"
        pattern="\d{2}"
        data-type="year"
        >
    </span>
    <span class="calendar__upper__full_date">
        12 сентября 2023
    </span>
    <span class="calendar__calendar_icon">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.9702 3.9856H16.3704V2.8714C16.3704 2.7729 16.3313 2.67843 16.2617 2.60878C16.192 2.53913 16.0975 2.5 15.999 2.5C15.9005 2.5 15.8061 2.53913 15.7364 2.60878C15.6668 2.67843 15.6276 2.7729 15.6276 2.8714V3.9856H7.45681V2.8714C7.45681 2.7729 7.41768 2.67843 7.34803 2.60878C7.27838 2.53913 7.18391 2.5 7.08541 2.5C6.98691 2.5 6.89244 2.53913 6.82279 2.60878C6.75314 2.67843 6.71401 2.7729 6.71401 2.8714V3.9856H4.1142C3.8187 3.9856 3.5353 4.10299 3.32634 4.31194C3.11739 4.52089 3 4.8043 3 5.0998V19.9558C3 20.2513 3.11739 20.5347 3.32634 20.7437C3.5353 20.9526 3.8187 21.07 4.1142 21.07H18.9702C19.2657 21.07 19.5491 20.9526 19.7581 20.7437C19.9671 20.5347 20.0844 20.2513 20.0844 19.9558V5.0998C20.0844 4.8043 19.9671 4.52089 19.7581 4.31194C19.5491 4.10299 19.2657 3.9856 18.9702 3.9856ZM4.1142 4.7284H6.71401V5.8426C6.71401 5.9411 6.75314 6.03557 6.82279 6.10522C6.89244 6.17487 6.98691 6.214 7.08541 6.214C7.18391 6.214 7.27838 6.17487 7.34803 6.10522C7.41768 6.03557 7.45681 5.9411 7.45681 5.8426V4.7284H15.6276V5.8426C15.6276 5.9411 15.6668 6.03557 15.7364 6.10522C15.8061 6.17487 15.9005 6.214 15.999 6.214C16.0975 6.214 16.192 6.17487 16.2617 6.10522C16.3313 6.03557 16.3704 5.9411 16.3704 5.8426V4.7284H18.9702C19.0687 4.7284 19.1632 4.76753 19.2329 4.83718C19.3025 4.90683 19.3416 5.0013 19.3416 5.0998V8.4424H3.7428V5.0998C3.7428 5.0013 3.78193 4.90683 3.85158 4.83718C3.92123 4.76753 4.0157 4.7284 4.1142 4.7284ZM18.9702 20.3272H4.1142C4.0157 20.3272 3.92123 20.2881 3.85158 20.2184C3.78193 20.1488 3.7428 20.0543 3.7428 19.9558V9.1852H19.3416V19.9558C19.3416 20.0543 19.3025 20.1488 19.2329 20.2184C19.1632 20.2881 19.0687 20.3272 18.9702 20.3272Z" fill="currentColor"></path>
        </svg>
    </span>
    </div>
    <div class="calendar__reset_icon">
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5.5L19.33 19.83M5 19.83L19.33 5.5" stroke="#2879FF" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
    </div>
    <section class="calendar__reset_helper_text">
    Очистить&nbsp;поле?
    </section>
    <section class="calendar__calendar" data-hide="true">
    <div class="calendar__calendar__year calendar__calendar__title bg_white">
        <button class="prev">
            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.8426 8.53239L11.8009 14.5741L17.8426 20.6157" stroke="#161E20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </button>
        <section>
            <span>2022</span>
            <div>
                <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.03239 11.1576L15.0741 17.1992L21.1157 11.1576" stroke="#161E20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
        </section>
        <button class="next">
            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.1574 20.4676L17.1991 14.4259L11.1574 8.38428" stroke="#161E20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </button>
    </div>
    <div class="calendar__calendar__month calendar__calendar__title bg_white">
        <button class="prev">
            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.8426 8.53239L11.8009 14.5741L17.8426 20.6157" stroke="#161E20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </button>
        <section>
            <span>Сентябрь</span>
            <div>
                <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.03239 11.1576L15.0741 17.1992L21.1157 11.1576" stroke="#161E20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
        </section>
        <button class="next">
            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.1574 20.4676L17.1991 14.4259L11.1574 8.38428" stroke="#161E20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </button>
    </div>
    <div class="calendar__calendar__days_of_week bg_white">
        <span class="day_of_week">Пн</span>
        <span class="day_of_week">Вт</span>
        <span class="day_of_week">Ср</span>
        <span class="day_of_week">Чт</span>
        <span class="day_of_week">Пт</span>
        <span class="day_of_week">Сб</span>
        <span class="day_of_week">Вс</span>
    </div>
    <div class="calendar__calendar__calendar bg_white">
    </div>
    <div class="calendar__year_popup" data-hide="true">
        <div class="calendar__year_popup__mobile">
            <div class="calendar__year_popup__mobile__close">
                <svg width="29" height="17" viewBox="0 0 29 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.36364 0.5L1 8.24194M1 8.24194L8.36364 16.5M1 8.24194H28" stroke="black" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
            <span>Выберите год</span>
            <div class="calendar__year_popup__mobile__close">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21.33 21.33M3 21.33L21.33 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
        </div>
        <section class="calendar__year_popup__input bg_white">
            <div class="search_mobile_icon">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9.5" r="6.5" stroke="black"></circle>
                    <line x1="13.3536" y1="14.1464" x2="20.3536" y2="21.1464" stroke="black"></line>
                </svg>
            </div>
            <input type="text" placeholder="" class="calendar_input___">
            <label for="" class="floating_label">Выберите год</label>
            <section class="calendar__year_popup__mobile__clear">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21.33 21.33M3 21.33L21.33 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </section>
        </section>
        <section class="calendar__years_grid bg_white">
        </section>
        <section class="calendar__actions">
            <button class="calendar__reset_btn" disabled>Сбросить</button>
            <button class="calendar__apply_btn" disabled>Применить</button>
        </section>
    </div>
    <div class="calendar__month_popup bg_white" data-hide="true">
        <section class="calendar__month_popup_mobile">
            <div class="calendar__year_popup__mobile__close">
                    <svg width="29" height="17" viewBox="0 0 29 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.36364 0.5L1 8.24194M1 8.24194L8.36364 16.5M1 8.24194H28" stroke="black" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
                <span>Выберите месяц</span>
                <div class="calendar__year_popup__mobile__close">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L21.33 21.33M3 21.33L21.33 3" stroke="black" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
        </section>
    </div>
    </section>
    `
    return CALENDAR_BODY
}