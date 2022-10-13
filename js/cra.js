    var $craMap = $('#districts-map-cra');
    if($craMap.length){

        // clicking an SVG link
        $('a',$craMap).click(function(event){
            var $selectedDistrict = $(this);
            // console.log()
            $('a',$craMap).addClass('disabled');
            $selectedDistrict.removeClass('disabled');

            var districtDivID = $selectedDistrict.attr('xlink:href');
            $('.cra-district').show().not(districtDivID).hide();
            // $('#button-cra-show-all').show();
            event.preventDefault();
        });

        // clicking a legend link
        $('.districts-list a:not(#button-cra-show-all)').click(function(event){
            var district = $(this).parent().get(0).className;

            $('a',$craMap).addClass('disabled');
            $('a.'+district, $craMap).removeClass('disabled');

            var districtDivID = $(this).attr('href');
            $('.cra-district').show().not(districtDivID).hide();
            // $('#button-cra-show-all').show();

        });

        // hide it initially, but it's clickable when a district is selected
        $('#button-cra-show-all').click(function() {
            $('a',$craMap).removeClass('disabled');
            $('.cra-district').show();
            // $(this).hide();
        });
    }