let chosenTags = new Map();
$(document).ready(function() {

    addDropdownTags(chosenTags);
  
});
  
function addDropdownTags(chosenTags){
    $('#tagDropdown').select2({
        width: '100%', 
        placeholder: 'Выберете тэги', 
      });
  
      $('#tagDropdown').on('select2:select', function (e) {
        var selectedTag = e.params.data;
        chosenTags.set(selectedTag.text, selectedTag.id);
      });
  
      $('#tagDropdown').on('select2:unselect', function (e) {
        var deselectedTag = e.params.data;
        chosenTags.delete(deselectedTag.text);
    });
  }
  