window.resettableLabelSettingsStorageKeys = []

window.addEventListener("load", () => {
  const sheetElem = document.getElementById("sheet");
  sheetElem.classList.add("sheet");

  bindInput(
    "label-data",
    "",
    (elem) => createLabels(sheetElem, elem.value));

  bindInput(
    "font-size",
    8,
    (elem) => {
      for (const sheetElem of document.getElementsByClassName("sheet")) {
        sheetElem.style.fontSize = elem.value + "px";
      }
    });

  bindCssToggle(
    "label-toggle-bold",
    "label-bold",
    true);

  bindCssToggle(
    "label-toggle-barcodes",
    "label-barcodes",
    true);

  bindCssToggle(
    "label-toggle-borders",
    "label-border",
    true);

  bindCssToggle(
    "label-toggle-overflow",
    "label-overflow",
    false);

  bindInput(
    "sheet-zoom",
    80,
    (elem) => {
      for (const sheetElem of document.getElementsByClassName("sheet")) {
        sheetElem.style.zoom = elem.value + "%";
      }
    });
});

function bindCssToggle(elemId, className, defaultValue) {
  const sheetElem = document.getElementById("sheet");
  bindInput(
    elemId,
    defaultValue.toString(),
    (elem) => {
      if (elem.checked)
        sheetElem.classList.add(className);
      else
        sheetElem.classList.remove(className);
    });
}

function bindInput(elemId, defaultValue, handler) {
  if (elemId !== "label-data")
    window.resettableLabelSettingsStorageKeys.push(elemId);

  const elem = document.getElementById(elemId);
  const value = window.localStorage.getItem(elemId) || defaultValue;

  if (elem.type === "checkbox")
    elem.checked = value == "true"
  else
    elem.value = value;

  elem.addEventListener("input", () => {
    window.localStorage.setItem(elemId, elem.type === "checkbox"
      ? elem.checked
      : elem.value);
    handler(elem);
  });
  handler(elem);
}

function resetLabelSettings() {
  for (const storageKey of window.resettableLabelSettingsStorageKeys)
    window.localStorage.removeItem(storageKey);
  location.reload();
}

function createLabels(sheetElem, text) {
  while (sheetElem.firstChild)
  sheetElem.removeChild(sheetElem.lastChild);

  for (let labelText of text.split("\n")) {
    labelText = labelText.trim();
    if (labelText)
      sheetElem.appendChild(createLabel(labelText, labelText));
  }
}

function createLabel(text, barcode) {
  const labelElem = document.createElement("figure");
  const captionElem = document.createElement("figcaption");

  const barcodeElem = DATAMatrix({
    msg: barcode,
    dim: 32,
    rct: 0,
    pad: 2,
    vrb: 0
  });

  const captionContentElem = document.createElement("div");
  captionElem.appendChild(captionContentElem);

  const textElem = document.createElement("div");
  textElem.textContent = text;

  captionContentElem.appendChild(barcodeElem);
  captionContentElem.appendChild(textElem);

  labelElem.appendChild(captionElem);

  return labelElem;
}
