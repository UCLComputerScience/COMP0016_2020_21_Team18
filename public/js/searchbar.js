$(document).ready(function () {
    const searchBar = $("#search");
    searchBar.keypress(function () {
        const searchBarText = searchBar.val().toLowerCase();
        $(".message").each(function (index) {
            if (!$(this).text().toLowerCase().includes(searchBarText)) {
              $(this).addClass("invisible");
            } else {
              $(this).removeClass("invisible");
            }
        });
        $(".bot-message").each(function (index) {
          if (!$(this).text().toLowerCase().includes(searchBarText)) {
            $(this).addClass("invisible");
          } else {
            $(this).removeClass("invisible");
          }
      });
    });
});
