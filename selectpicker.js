
HTMLElement.prototype.selectpicker = function () {
    selectpicker_obj.setup(this);
};

var selectpicker_obj = {
    setup: function (_element) {
        let selectpicker_wrapper = document.createElement('div');
        selectpicker_wrapper.classList.add('selectpicker')
        let button = document.createElement("button");
        button.innerText = _element.options[0].innerText
        selectpicker_wrapper.appendChild(button);
        let options = document.createElement("div");
        options.className = "options";
        options.innerHTML = this.formatHTML(_element.innerHTML);
        selectpicker_wrapper.appendChild(options)
        _element.after(selectpicker_wrapper);
        this.selectOption(options.querySelectorAll('option'), _element);
    },
    formatHTML: function (html) {
        return html.replaceAll('optgroup', `div class="optgroup"`)
    },
    hasOptGroup() {

    },
    selectOption(_options, _element) {
        if (!_options) return;
        [..._options].forEach(item => item.addEventListener('click', function () {
            _element.value = this.value;
            [..._options].find(t => t.classList.contains('selected'))?.classList.remove("selected")
            this.classList.add("selected")
        }));
    }

}

