"use strict";
const SELECTPICKER = "selectpicker"
const OPTIONS = "options"
const HIDE = "hide"
const OPTGROP_NODENAME = "optgroup"
const SELECTED = "selected"
const SELECTED_MULTIPLE = "selected_multiple"
let BUTTON_TEXT = "Choose an option"
const SEARCH = "search"

HTMLElement.prototype.selectpicker = function () {
    try {
        selectpicker_obj.setup(this)
        this.hidden = true

    } catch (error) {
        console.log(error)
    }

}

const selectpicker_wrapper = document.createElement('div')
const button = document.createElement("button")
const options = document.createElement("div")
const searchInput = document.createElement("input")
var selectpicker_obj = {
    setup: function (_element) {
        selectpicker_wrapper.classList.add(SELECTPICKER)
        this.isDisabled(_element) ? button.setAttribute("disabled", "") : "";
        this.showTicks(_element) ? selectpicker_wrapper.setAttribute("show-ticks", "") : "";
        this.isDropUp(_element) ? selectpicker_wrapper.setAttribute("dropup", "") : "";
        BUTTON_TEXT = _element.getAttribute("title") ?? BUTTON_TEXT
        button.innerText = BUTTON_TEXT
        selectpicker_wrapper.appendChild(button)
        options.className = `${OPTIONS} ${HIDE}`
        options.innerHTML = this.formatHTML(_element.innerHTML)
        selectpicker_wrapper.appendChild(options)
        _element.after(selectpicker_wrapper)
        this.formatOptions(options.querySelectorAll('option'))

        this.selectOption(options.querySelectorAll('option,.option'), _element, this.hasMultiple(_element), this.maxValue(_element), this.showCount(_element))
        document.querySelector("*:not([disabled])").addEventListener('click', this.showOrHideDropDown.bind(this, this.hasMultiple(_element), this.addSearch(_element)))
    },
    formatHTML: function (html) {

        return html.replaceAll(OPTGROP_NODENAME, `div class="optgroup"`)
    },
    showOrHideDropDown: function (showDropdown, hasSearch, e) {
        if (hasSearch && !showDropdown && e.composedPath().includes(searchInput)) {
            e.composedPath().includes(searchInput) ? options.classList.remove(HIDE) : options.classList.add(HIDE)
            return
        }
        e.composedPath().includes(selectpicker_wrapper) ? (showDropdown ? options.classList.remove(HIDE) : options.classList.toggle(HIDE)) : options.classList.add(HIDE)
    },
    formatOptions: function (_options) {
        if (!_options) return
        [..._options].forEach(o => {
            if (o.dataset.content) {
                o.outerHTML = `<div data-value=${o.value} class="option">${o.dataset.content}</div>`
            }

        })
    },
    hasMultiple: (e) => e.hasAttribute("multiple"),
    maxValue: (e) => e.getAttribute("max"),
    isDisabled: (e) => e.hasAttribute("disabled"),
    isDropUp: (e) => e.hasAttribute("dropup"),
    showCount: (e) => e.getAttribute("show-selected-count"),
    showTicks: (e) => e.hasAttribute("show-tick"),
    addSearch: function (e) {
        if (!e.hasAttribute("search")) return false
        searchInput.classList.add(SEARCH)
        document.addEventListener('input', b => {
            if (b.composedPath().includes(document.querySelector(`.${SEARCH}`)))
                this.handleSearch(b)
        })
        options.prepend(searchInput);
        return true
    },
    handleSearch: function (e) {
        e?.target?.value || options.querySelectorAll('option').forEach(o => o.removeAttribute("hidden"))
        if (e?.target?.value == null) return;
        options.querySelectorAll('option').forEach(o => { if (!o.innerText.toLowerCase().includes(e.target.value.toLowerCase())) o.setAttribute("hidden", "") })
        console.log(options.querySelectorAll('option'), e.target.value)
    },
    selectOption(_options, _element, isMultiple, maxValue, showCount) {
        if (!_options) return
        [..._options].forEach(item => item.addEventListener('click', function () {
            _element.value = this.value ?? this.dataset.value.replaceAll("'", "")
            if (isMultiple) {

                if (maxValue && [...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].length >= Number(maxValue)) {
                    if ([...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].includes(this)) this.classList.toggle(SELECTED_MULTIPLE);
                    let count = [...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].length;
                    button.textContent = eval(showCount) && count != 0 ? `${count} selected` : [...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].map(o => o.textContent).join(' + ') || BUTTON_TEXT
                    return
                }
                this.classList.toggle(SELECTED_MULTIPLE);
                let count = [...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].length;
                button.textContent = eval(showCount) && count != 0 ? `${count} selected` : [...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].map(o => o.textContent).join(' + ') || BUTTON_TEXT
                return
            }
            [..._options]
                .find(t => t.classList.contains(SELECTED))?.classList.remove(SELECTED)
            this.classList.add(SELECTED)
            button.textContent = this.textContent;

        }))
    }

}

