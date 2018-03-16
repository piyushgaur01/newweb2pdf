$('#openPdfDiv').hide();

function GeneratePDF() {

    var allow = false;
    var url = $('#urlText')[0].value;
    if(!url){
        alert('Please enter URL(s)');
        return false;
    }

    var postData = { url: '', devices: []};

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
        $('#myModal').modal({ backdrop: 'static', keyboard: false, show: true });
        var url = $('#urlText')[0].value;
        postData.url = url;
        var fileName = url.replace('https://', '');
        if (fileName === url) {
            fileName = url.replace('http://', '');
        }
        console.log(url);
        console.log(fileName);
        $.ajax({
            method: 'post',
            url: '/generatepdf',
            data: postData,
            //contentType: "application/json",
            success: function (response) {
                console.log(response);
                $('#myModal').modal('hide');
                $('#openPdfDiv').show();
                $('#openPdfLink').attr('href', '../PDF/' + fileName + '.pdf');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                $('#myModal').modal('hide');
            }
        });
    } else {
        alert('Please select at least one device');
    }
}


$(document).ready(function () {
    var bgImgHeight = $(window).height() - 50;
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
            $checkbox.prop('checked', !$checkbox.is(':checked'));
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