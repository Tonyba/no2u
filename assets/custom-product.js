const variant_picker = document.querySelector('.variant-picker');
const variantOptions = Array.from(document.querySelectorAll('.variant-picker__form > .variant-option:first-child option')).map(item => ({
    label: item.textContent.trim(),
    value: item.getAttribute('data-option-value-id')
}));
const flavorsCount = Array.from(document.querySelectorAll('.variant-picker__form > .variant-option:last-child option')).length;
const flavorLabel = document.querySelector('.variant-picker__form > .variant-option:last-child label');

flavorLabel.innerText = `${flavorsCount} ${flavorLabel.innerText}`;

const selectOpts = Array.from(document.querySelectorAll('.variant-picker__form > .variant-option:first-child option'));
const select = document.querySelector('.variant-picker__form > .variant-option:first-child select');

const newElsReferences = [];

const optWrapper = document.createElement('div');
optWrapper.classList.add('flex');
optWrapper.classList.add('size-boxes')

variantOptions.map((opt, i) => {
    const newEl = document.createElement('div');
    const subEl = document.createElement('div');

    subEl.classList.add('serving');

    subEl.innerText = '($1.80/serving)';

    newEl.classList.add('col');
    newEl.classList.add('w-100');
    newEl.setAttribute('data-value', opt.value);

    newEl.innerHTML = '<div class="label">' + opt.label + '</div>';
    newEl.append(subEl);

    optWrapper.append(newEl);

    newElsReferences.push(newEl);

    newEl.addEventListener('click', () => handleSelection(i, newEl));
});

variant_picker?.insertAdjacentElement('beforebegin', optWrapper);


function handleSelection(value, el) {

    select.selectedIndex = value;
    select.dispatchEvent(new Event('change', {
        bubbles: true, // Crucial for ensuring the event propagates up the DOM tree
        cancelable: true,
        view: window
    }));
    // select.dispatchEvent(new Event('bs:variant:change'));

    newElsReferences.map(current => current.classList.remove('selected'))

    el.classList.add('selected');
}
