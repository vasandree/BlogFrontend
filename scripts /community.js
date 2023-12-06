$(document).ready(function() {

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
  });