(() => {
  $(document).ready(() => {

    // only run script on body.bucket-scroll
    var body = $("body");
    if(!body.is(".bucket-scroll")){ return; }

    var loading = false;

    var loadBucket = (bucket) => {
      loading = true;
      console.log("loading bucket...", bucket);

      $.ajax({
        type: "GET",
        url: `/date/${bucket}`,
        dataType: "html",
        data: {
          partial: true
        },
        success: (html) => {
          var projectList = $(html);
          $(".buckets").append(projectList);

          if(projectList.is(".end-of-buckets")) {
            console.log("Reached the end.");
            body.removeClass(".bucket-scroll");
          }

          loading = false;
        },
        error: (xhr) => {
          console.error(xhr);
        },
        complete: (json) => {}
      });
    };

    var triggerScroll = () => {
      if(loading) { return; }

      var prevBucket = $(".project-list").last().data("prev-bucket")
      if(!prevBucket) {
        console.log("End of buckets.")
        return;
      }

      loadBucket(prevBucket);
    };

    // setup infinite scroll
    $(window).scroll((e) => {

      if(!((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
        return;
      }

      triggerScroll();
    });

    triggerScroll();

  });
})();
