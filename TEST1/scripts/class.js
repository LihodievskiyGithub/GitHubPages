class Tags {
  constructor() {
    this.form = document.querySelector('#form');
    this.input = document.querySelector('#input');
    this.button = document.querySelector('#button');
    this.list = document.querySelector('.project__list');
    this.template = document.querySelector('#element-template').content;
    this.checkbox = document.querySelector('#readonly');
    this.storage = window.localStorage;
  }

  index() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleAddButtonClick(this.input.value);
      this.input.value = "";
    });

    this.checkbox.addEventListener('click', (e) => {
      this._readOnlyToggle(this.checkbox.checked);
    });

    const currentTags = this.storage.getItem('tags');

    if(!currentTags) {
      this._setTagsForStorage([]);
    } else {
      this._showTags(currentTags);
    }
  }

  _getTemplate() {
    return this.template.cloneNode(true).querySelector('.project__item');
  }

  _addTag(currentTag) {
    //добавление тега в localStorage
    const tags = this._getTagsFromStorage();

    if (tags.length < 1) {
      this._addTagToLocalStorage(currentTag);
    } else if(tags.indexOf(currentTag) === -1 && currentTag !== '') {
      this._addTagToLocalStorage(currentTag);
    }
  
  }

  _addTagOnPage(currentTag) {
    const currentTemplate = this._getTemplate();
    const title = currentTemplate.querySelector('.project__tag');
    const cross = currentTemplate.querySelector('.project__item-cross');
    title.textContent = currentTag;

    cross.addEventListener('click', (e) => {
      this._removeTag(currentTemplate, currentTag);
    });


    this.list.append(currentTemplate);
  }

  _removeTag(template, tag) {
    const tags = this._getTagsFromStorage();
    let result = tags.filter(item => item !== tag);

    this._setTagsForStorage(result);
    this.list.removeChild(template);
  }

  _addTagToLocalStorage(currentTag) {
    const tags = this._getTagsFromStorage();
    tags.push(currentTag);
    this._setTagsForStorage(tags);

    //добавление тега в html
    this._addTagOnPage(currentTag);
  }

  _showTags(array) {
    const parsedArray = JSON.parse(array);

    for (const tag of parsedArray) {
      this._addTagOnPage(tag);
    }
  }

  //геттер тегов
  _getTagsFromStorage() {
    return JSON.parse(this.storage.getItem('tags'));
  }

  //сеттер тегов
  _setTagsForStorage(tags) {
    this.storage.setItem('tags', JSON.stringify(tags));
  }

  _readOnlyToggle(checked) {
    const allTags = Array.from(this.list.querySelectorAll('.project__item'));

    if(checked) {
      this.button.disabled = true;
      this.input.disabled = true;
      allTags.forEach(item => item.classList.add('disabled'));
    } else {
      this.button.disabled = false;
      this.input.disabled = false;
      allTags.forEach(item => item.classList.remove('disabled'));
    }
  }


  _handleAddButtonClick(item){
    let tag = this.input.value;
    let splitTag = tag.split(',');
    
    splitTag.forEach(item => this._addTag(item))
    
  }
}

export default Tags;