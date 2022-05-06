HTMLElement.prototype.selectpicker = function () {

    var select = this;
    const wrapper = document.createElement("div");
    wrapper.className = "selectpicker";
    let button = document.createElement("button");
    button.className = "selectpicker button";
    wrapper.appendChild(button)
    const options = document.createElement("div");
    options.className = "options";
    button.innerText = [...this.options][0].innerText;
    options.classList.add("hide");
    button.addEventListener('click', () => {
        options.classList.contains("hide") ? options.classList.remove("hide") : options.classList.add("hide");
    });
    [...this.options].forEach(item => {
        let option = document.createElement("div");
        option.className = "select-option";
        option.innerText = item.innerText
        options.appendChild(option);
        option.addEventListener('click', function () {
            select.value = item.value
            this.parentNode.querySelector(".selected")?.classList.remove("selected");
            this.classList.add("selected");
            button.innerText = option.innerText
            options.classList.add("hide")
        })
    })
    wrapper.appendChild(options);
    this.after(wrapper)

}