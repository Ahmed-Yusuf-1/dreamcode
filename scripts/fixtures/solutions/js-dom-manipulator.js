function transformElement(element, newText, classToAdd, classToRemove) {
  element.textContent = newText;
  element.classList.add(classToAdd);
  element.classList.remove(classToRemove);
  return element;
}

function testDOM(textContent, classes, newText, classToAdd, classToRemove) {
  const element = {
    textContent,
    classList: {
      classes: [...classes],
      add(c) {
        if (!this.classes.includes(c)) this.classes.push(c);
      },
      remove(c) {
        this.classes = this.classes.filter((x) => x !== c);
      },
    },
  };
  transformElement(element, newText, classToAdd, classToRemove);
  return { text: element.textContent, classes: element.classList.classes };
}
