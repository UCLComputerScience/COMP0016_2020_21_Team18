/* eslint-disable no-undef */

$(document).ready(function () {
  const searchBar = $('#search');
  const searchForm = $('#searchForm');
  searchBar.on('input', function () {
    const searchBarText = searchBar.val().toLowerCase();
    $('.text').each(function (index) {
      if (!$(this).text().toLowerCase().includes(searchBarText)) {
        $(this).parent().addClass('invisible');
      } else {
        $(this).parent().removeClass('invisible');
      }
    });
  });

  searchForm.submit(function(event) {
    event.preventDefault();
  });
});
