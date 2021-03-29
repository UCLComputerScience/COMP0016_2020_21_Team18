/* eslint-disable no-undef */

$(document).ready(() => {
  const searchBar = $("#search");
  const searchForm = $("#searchForm");
  searchBar.on("input", () => {
    const searchBarText = searchBar.val().toLowerCase();
    $(".message").each(() => {
      if (!$(this).text().toLowerCase().includes(searchBarText)) {
        $(this).addClass("invisible");
      } else {
        $(this).removeClass("invisible");
      }
    });
    $(".bot-message").each(() => {
      if (!$(this).text().toLowerCase().includes(searchBarText)) {
        $(this).addClass("invisible");
      } else {
        $(this).removeClass("invisible");
      }
    });
  });

  searchForm.submit((event) => {
    event.preventDefault();
  });
});
