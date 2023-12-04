$(document).ready(function() {

    addDropdownTags();
    setDescription();

});

function addDropdownTags(){
    $('#tagDropdown').select2({
        width: '100%', 
        placeholder: 'Выберете тэги', 
      });

      $('#tagDropdown').on('select2:select', function (e) {
        var selectedTag = e.params.data.text;
        appendTag(selectedTag);
      });
  
      $('#tagDropdown').on('select2:unselect', function (e) {
        var deselectedTag = e.params.data.text;
        removeTag(deselectedTag);
    });
}

function appendTag(tag) {
    var currentTags = $('#tagInput').val();
    if (currentTags === '') {
      $('#tagInput').val(tag);
    } else {
      $('#tagInput').val(currentTags + ', ' + tag);
    }
  }

function removeTag(tag) {
    var currentTags = $('#tagInput').val();
    var updatedTags = currentTags.replace(tag + ', ', '');
    updatedTags = updatedTags.replace(', ' + tag, '');
    updatedTags = updatedTags.replace(tag, '');
    $('#tagInput').val(updatedTags);
}

function setDescription(){

    var postDescription = "Описание поста, которое может быть довольно длинным. Описание поста, которое может быть довольно длинным. Описание поста, которое может быть довольно длинным.";

    $('#postDescription').text(postDescription.substring(0, 100));

    if (postDescription.length > 100) {
        $('#readMoreLink').removeClass('d-none');
    }

    $('#readMoreLink').on('click', function() {
        $('#postDescription').text(postDescription); 
        $('#readMoreLink').addClass('d-none'); 
    });
}