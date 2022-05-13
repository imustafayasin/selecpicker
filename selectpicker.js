const SELECTPICKER = "selectpicker";
const OPTIONS = "options";
const HIDE = "hide";
const OPTGROP_NODENAME = "optgroup";
const SELECTED = "selected";
const BUTTON_TEXT = "Choose an option"

HTMLElement.prototype.selectpicker = function () {
    selectpicker_obj.setup(this);
};

const selectpicker_wrapper = document.createElement('div')
const button = document.createElement("button")
const options = document.createElement("div")
var selectpicker_obj = {
    setup: function (_element) {
        selectpicker_wrapper.classList.add(SELECTPICKER)
        button.innerText = BUTTON_TEXT
        selectpicker_wrapper.appendChild(button);
        options.className = `${OPTIONS} ${HIDE}`;
        options.innerHTML = this.formatHTML(_element.innerHTML);
        selectpicker_wrapper.appendChild(options)
        _element.after(selectpicker_wrapper);
        this.selectOption(options.querySelectorAll('option'), _element, this.isMultiple(_element));
        document.addEventListener('click', this.showOrHideDropDown.bind(this, this.isMultiple(_element)))
    },
    formatHTML: function (html) {
        return html.replaceAll(OPTGROP_NODENAME, `div class="optgroup"`)
    },
    showOrHideDropDown: function (showDropdown, e) {
        e.composedPath().includes(selectpicker_wrapper) ? (showDropdown ? options.classList.remove(HIDE) : options.classList.toggle(HIDE)) : options.classList.add(HIDE)
    },
    isMultiple: (e) => e.hasAttribute("multiple"),
    selectOption(_options, _element, isMultiple) {
        if (!_options) return;
        [..._options].forEach(item => item.addEventListener('click', function () {
            _element.value = this.value;
            if (isMultiple) {
                this.classList.toggle(SELECTED);
                button.textContent = [...options.querySelectorAll('.selected')].map(o => o.textContent).join(' + ') || BUTTON_TEXT
                return
            }
            [..._options]
                .find(t => t.classList.contains(SELECTED))?.classList.remove(SELECTED)
            this.classList.add(SELECTED);
            button.textContent = this.textContent
        }));
    }

}

