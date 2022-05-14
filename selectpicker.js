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
    selectpicker_obj.setup(this)
}

const selectpicker_wrapper = document.createElement('div')
const button = document.createElement("button")
const options = document.createElement("div")
const searchInput = document.createElement("input")
var selectpicker_obj = {
    setup: function (_element) {
        selectpicker_wrapper.classList.add(SELECTPICKER)
        BUTTON_TEXT = _element.getAttribute("title") ?? BUTTON_TEXT
        button.innerText = BUTTON_TEXT
        selectpicker_wrapper.appendChild(button)
        options.className = `${OPTIONS} ${HIDE}`
        options.innerHTML = this.formatHTML(_element.innerHTML)

        selectpicker_wrapper.appendChild(options)
        _element.after(selectpicker_wrapper)

        this.selectOption(options.querySelectorAll('option'), _element, this.hasMultiple(_element), this.maxValue(_element))
        document.addEventListener('click', this.showOrHideDropDown.bind(this, this.hasMultiple(_element), this.addSearch(_element)))
    },
    formatHTML: function (html) {
        return html.replaceAll(OPTGROP_NODENAME, `div class="optgroup"`)
    },
    showOrHideDropDown: function (showDropdown, hasSearch, e) {
        if (hasSearch && !showDropdown) {
            e.composedPath().includes(searchInput) ? options.classList.remove(HIDE) : options.classList.toggle(HIDE)
            return
        }
        e.composedPath().includes(selectpicker_wrapper) ? options.classList.remove(HIDE) : options.classList.toggle(HIDE)
    },
    hasMultiple: (e) => e.hasAttribute("multiple"),
    maxValue: (e) => e.getAttribute("max"),
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
    selectOption(_options, _element, isMultiple, maxValue) {
        if (!_options) return
        [..._options].forEach(item => item.addEventListener('click', function () {
            _element.value = this.value
            if (isMultiple) {

                if (maxValue && [...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].length >= Number(maxValue)) {
                    if ([...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].includes(this)) {
                        this.classList.toggle(SELECTED_MULTIPLE);
                        button.textContent = [...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].map(o => o.textContent).join(' + ') || BUTTON_TEXT
                    }
                    return
                }
                this.classList.toggle(SELECTED_MULTIPLE);
                button.textContent = [...options.querySelectorAll(`.${SELECTED_MULTIPLE}`)].map(o => o.textContent).join(' + ') || BUTTON_TEXT
                return
            }
            [..._options]
                .find(t => t.classList.contains(SELECTED))?.classList.remove(SELECTED)
            this.classList.add(SELECTED)
            button.textContent = this.textContent;

        }))
    }

}

