(function ($bs) {
  const CLASS_NAME = "has-child-dropdown-show";
  $bs.Dropdown.prototype.toggle = (function (_orginal) {
    return function () {
      document.querySelectorAll("." + CLASS_NAME).forEach(function (e) {
        e.classList.remove(CLASS_NAME);
      });
      let dd = this._element
        .closest(".dropdown")
        .parentNode.closest(".dropdown");
      for (; dd && dd !== document; dd = dd.parentNode.closest(".dropdown")) {
        dd.classList.add(CLASS_NAME);
      }
      return _orginal.call(this);
    };
  })($bs.Dropdown.prototype.toggle);

  document.querySelectorAll(".dropdown").forEach(function (dd) {
    dd.addEventListener("hide.bs.dropdown", function (e) {
      if (this.classList.contains(CLASS_NAME)) {
        this.classList.remove(CLASS_NAME);
        e.preventDefault();
      }
      e.stopPropagation(); 
    });
  });

  // for hover
  document
    .querySelectorAll(".dropdown-hover, .dropdown-hover-all .dropdown")
    .forEach(function (dd) {
      dd.addEventListener("mouseenter", function (e) {
        let toggle = e.target.querySelector(
          ':scope>[data-bs-toggle="dropdown"]'
        );
        if (!toggle.classList.contains("show")) {
          $bs.Dropdown.getOrCreateInstance(toggle).toggle();
          dd.classList.add(CLASS_NAME);
          $bs.Dropdown.clearMenus();
        }
      });
      dd.addEventListener("mouseleave", function (e) {
        let toggle = e.target.querySelector(
          ':scope>[data-bs-toggle="dropdown"]'
        );
        if (toggle.classList.contains("show")) {
          $bs.Dropdown.getOrCreateInstance(toggle).toggle();
        }
      });
    });
})(bootstrap);
$(document).ready(function () {
  $.ajax({
    url: "https://api.acharyaprashant.org/v2/legacy/courses/tags",
    type: "GET",
    success: function (data) {
      var categoriesHTML = "";

      $.each(data[0], function (index, category) {
        var categoryClass = category.hasChildren
          ? "dropdown dropend"
          : "no-child";
        categoriesHTML += '<div class="' + categoryClass + '">';
        categoriesHTML +=
          '<a class="dropdown-item dropdown-toggle" href="#" id="dropdown-' +
          category.tagId +
          '" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
          category.name.english +
          "</a>";

        if (category.hasChildren) {
          categoriesHTML +=
            '<div class="dropdown-menu" aria-labelledby="dropdown-' +
            category.tagId +
            '">';

          $.each(data[1], function (subIndex, subcategory) {
            if (subcategory.parent === category.tagId) {
              categoriesHTML +=
                '<a class="dropdown-item" href="#">' +
                subcategory.name.english +
                "</a>";
            }
          });

          categoriesHTML += "</div>";
        }

        categoriesHTML += "</div>";
      });

      $("#dynamicCategories").html(categoriesHTML);
    },
    error: function (xhr, status, error) {
      console.log("Error: " + error);
    },
  });


  $.ajax({
    url: 'https://api.acharyaprashant.org/v2/legacy/courses/faqs?language=english',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      $('#accordionFlushExample').empty();

      $.each(data, function(index, item) {
        var accordionItem = `
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapse${index}">
                <b>${item.question}</b>
              </button>
            </h2>
            <div id="flush-collapse${index}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body">${item.answer}</div>
            </div>
          </div>
        `;

        $('#accordionFlushExample').append(accordionItem);
      });
    },
    error: function() {
      console.log('Error fetching data');
    }
  });
});

$.ajax({
  url: 'https://api.acharyaprashant.org/v2/legacy/courses/series/optuser/course-series-eeb9d3',
  type: 'GET',
  dataType: 'json',
  success: function(response) {
    // Update the top banner section
    updateTopBanner(response.details);

    // Update the HTML with the response data
    updateHTML(response);
  },
  error: function(xhr, status, error) {
    console.error('Error:', error);
  }
});

function updateTopBanner(details) {
  // Update top banner section
  $('.topBannerSection .nato-hindi:first').text(details.title);
  $('.topBannerSection .nato-hindi:eq(1) h5').text(details.subtitle);
  $('.topBannerSection .nato-hindi:eq(1) p').text(details.description);
  $('.topBannerSection .col-5 img').attr('src', details.thumbnail.domain + '/' + details.thumbnail.basePath + '/' + details.thumbnail.key);
}

function updateHTML(data) {
  // Clear existing content
  $('.videoSeriesSec').empty();

  // Add new title
  $('.videoSeriesSec').append('<div class="col-12"><h3 class="title">Video Series (' + data.courses.length + ')</h3></div>');

  // Add video grid
  var videoGrid = $('<div class="row"></div>');
  $.each(data.courses, function(index, course) {
    var videoItem = $('<div class="col-lg-3 col-12"><div class="singleVideoGrid"><span class="partTag nato-hindi">भाग ' + (index + 1) + '</span><h5 class="nato-hindi">' + course.title + '</h5><p class="nato-hindi">' + course.subtitle + '</p><p class="smallText">' + course.courseHours + ' hours</p><p class="smallText">Contribution: ₹' + course.amount + '<span class="strike">₹' + course.originalAmount + '</span></p><span class="catTag">' + course.language + '</span><div class="bottomCta"><button type="button" class="btn btn-link">Add to Cart</button><button type="button" class="btn btn-link">Enrol</button></div></div></div>');
    videoGrid.append(videoItem);
  });
  $('.videoSeriesSec').append(videoGrid);
}