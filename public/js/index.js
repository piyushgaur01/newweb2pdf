function GeneratePDF() {

    var allow = false;
    var url = $('#urlText')[0].value;
    if (!url) {
        alert('Please enter URL(s)');
        return false;
    }

    var postData = { url: '', devices: [] };

    if ($('#ch1').is(":checked")) {
        postData.devices.push('mobile');
        allow = true;
    }
    if ($('#ch2').is(":checked")) {

        postData.devices.push('ipad');
        allow = true;
    }
    if ($('#ch3').is(":checked")) {
        postData.devices.push('desktop');
        allow = true;
    }
    if ($('#ch4').is(":checked")) {
        postData.devices.push('largeDesktop');
        allow = true;
    }

    if (allow) {
        $(document).ajaxStart(function () {
            $("#myModal").css("display", "block");
        });
        // $(document).ajaxComplete(function(){
        //     $("#myModal").css("display", "none");
        // });		
        $('#myModal').modal({ backdrop: 'static', keyboard: false, show: true });
        var url = $('#urlText')[0].value.split(',');
        console.log(url.length);

        for (var i = 0, j = 0; i < url.length; i++) {
            if (url[i].startsWith('https://')) { }
            else {
                url[i] = 'https://' + url[i];
            }
            console.log(url[i]);
            postData.url = url[i];

            //var fileName = url[i].replace('https://', '');
            //if (fileName === url[i]) {
            //  fileName = url[i].replace('http://', '');
            //}
            //console.log(url);

            $.ajax({

                method: 'post',
                url: '/generatepdf',
                data: JSON.stringify(postData),
                contentType: "application/json",
                success: function (response) {
                    //alert(response);
                    j++;
                    console.log(response);

                    if (j == url.length) {
                        $('#myModal').modal('hide');
                        //alert(j);
                    }
                    //$('#openPdfDiv').show();
                    //$('#openPdfLink').attr('href', '../PDF/' + fileName + '.pdf');
                },
                // error: function (jqXHR, textStatus, errorThrown) {
                //   console.log(JSON.stringify(jqXHR));
                //     console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                //    // alert('Error in Creating PDF');
                // 	}
            });


        }
    } else {
        alert('Please select at least one device');
    }
}


$(document).ready(function () {
    var bgImgHeight = $(window).height() - 155;
    $('.bgBack').css('min-height', bgImgHeight);



    $('#urlForm').submit(function (e) {
        e.preventDefault();
    });

    $('.button-checkbox').each(function () {

        // Settings
        var $widget = $(this),
            $button = $widget.find('button'),
            $checkbox = $widget.find('input:checkbox'),
            color = $button.data('color'),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };

        // Event Handlers
        $button.on('click', function () {
            $("input[type='checkbox']").each(function () {
                $(this).prop('checked', false);
                $(this).triggerHandler('change');
                updateDisplay();
            })
            $checkbox.prop('checked', true);
            $checkbox.triggerHandler('change');
            updateDisplay();

        });
        $checkbox.on('change', function () {
            updateDisplay();
        });

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $button.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $button.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$button.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $button
                    .removeClass('btn-default')
                    .addClass('btn-' + color + ' active');
            }
            else {
                $button
                    .removeClass('btn-' + color + ' active')
                    .addClass('btn-default');
            }
        }

        // Initialization
        function init() {

            updateDisplay();

            // Inject the icon if applicable
            if ($button.find('.state-icon').length == 0) {
                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
            }
        }
        init();
    });

    $("#generatePdf").click(GeneratePDF);

});

