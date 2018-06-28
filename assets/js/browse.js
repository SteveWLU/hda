
var ready;
console.log('ready');
    ready = function(){
        function hide_footer(){
        // hides the footer
        if(document.getElementById('TEI_reader') !== null){
            $(".footer").hide();
        }
    }

    function assign_note_numbers(){
        // gets the xml id of the nodes and assigns them once the page has loaded.
            $.each($('sup'), function(item){
            var xml_id = this.parentNode.getAttribute('rightnum');
            var the_num = String($("note[xml=" + String(xml_id) + "]").attr("n"));
            console.log(the_num);

            try{
                if (the_num == "undefined") throw 'error assigning note number. TEI file asked for xml_id - ' + xml_id + '. But the TEI notes file returned this instead: ' + the_num;
                if (the_num != "undefined"){
                    $('note[rightnum="' + String(xml_id) +'"] sup').prepend(the_num);
                }
            }
            catch(err){
                console.log(err);
            }
        });
    }

    $(function annotation_reveal(){
        // reveal an annotation when clicked
        $('sup').click(function(){
            hide_non_active_panels();
            $('.note-contents note').hide();
            var annotation_number = this.parentNode.getAttribute('rightnum');
            $('#note-header').show();
            $("note[xml=" + String(annotation_number) + "]").show();
            $("note[xml=" + String(annotation_number) + "]").addClass('active-element');
            $('.note-contents.hidden').show();
            $('#side-panel').css('display', 'block');
            open_sidepanel();
        });
    });

    $(function all_note_reveal(){
        $('#all-note-reveal').click(function(){
            hide_non_active_panels();
            $('.note-contents note').hide();
            $('#note-header').show();
            var note_nums = $('sup').text().split("");
            $.each(note_nums,function(){
                $("note[n=" + this + "]").show();
                $("note[n=" + this + "]").addClass('active-element');
                $('.divider[n=' + this + "]").show();
            });
            $('.note-contents.hidden').show();
            $('#side-panel').css('display', 'block');
            open_sidepanel();
        });
    });

    function open_sidepanel(){
        $('#TEI_reader').unwrap();
        $('#TEI_reader').css('margin-left', '0%');
        $('#tei_wrapper').css('overflow', 'scroll');
        $('#tei_wrapper').css('padding-left', '1%');
        $('.pb').css('float', 'left');
        $('#note-close').addClass('active');
    }

    function hide_image(){
        $('#image-header').hide();
        $('#ms-image').hide();
        $('#image-header').removeClass('active-element');
        $('#ms-image-container').hide();
    }

    function hide_notes(){
        $('note.active-element').hide();
        $('note.active-element').removeClass('active-element');
        $('#note-header').hide();
    }

    function hide_tei(){
        $('#tei-embed-container').hide();
        $('#tei-embed-header').hide();
        $('#tei-embed-header').removeClass('active-element');
        $('#tei-embed').hide();
    }

    function back_to_intro(){
        $('#intro-link').click(function(){
            if(this.hasClass('active')){
                close_sidepanel();
            }
        });
    }

    $(function close_sidepanel(){
        // close the notes panel when the x is clicked
        $('#note-close').click(function(){
            hide_tei();
            hide_notes();
            hide_image();
           var notePanel = document.getElementById("side-panel");
           var bibToggle = document.getElementById("bibToggle");
           if (notePanel.style.display != "none") {
                notePanel.style.display = "none";
                $('#TEI_reader').wrap('<div id="reader-center-div">');
                $('#tei_wrapper').css('border', 'none');
           } else {
              notePanel.style.display = "block";
           }
           $('.milestone').css('margin-right', '-50px');
           $('#note-close').removeClass('active');
           $('#tei_wrapper').css('overflow', 'visible');
        });
    });

    function hide_non_active_panels(){
        if ($('#image-header.active-element').length > 0){
            hide_image();
        }
        if ($('note.active-element').length > 0){
            hide_notes();
            $('.divider').hide();
        }
        if ($('#tei-embed-header.active-element').length > 0){
            hide_tei();
        }
    }

    function page_prep(){
        // prepare the page on load
        if (!($.isNumeric($('note[rightnum]').text()))){
            assign_note_numbers();
            var current_laisse_long = $('.translation_missing').text();
            if(current_laisse_long){
                var re = new RegExp('[0-9]*\/');
                var current_laisse = re.exec(current_laisse_long)[0].slice(0,-1);
                $("#selected_laisse").val(current_laisse);
                $("#bot_laisse").val(current_laisse);
            }
            else{
                $("#selected_laisse").val(1);
                $("#bot_laisse").val(1);
            }
        }
        hide_footer();
    }

    $(function rajna_toggle(){
// if the corrections checkbox is checked, seg and anchor tags highlight red
        $('#rajnaCheckbox').click(function(){
            var checked = $('#rajnaCheckbox').prop('checked');
            if (checked) {
                $('seg').addClass('Rajna').fadeIn;
                $('.anchor').fadeIn();
            }
            else {
                $('seg').removeClass('Rajna').fadeOut;
                $('.anchor').fadeOut();
            }
        });
    });

    $(function diplo_toggle(){
        // if the corrections checkbox is checked, corr tags get highlighted
        $('#diploCheckbox').click(function(){
            var checked = $('#diploCheckbox').prop('checked');
            if (checked) {
                $('sic').show();
                $('add').hide();
                $('corr').hide();
            }
            else {
                $('sic').hide();
                $('add').show();
                $('corr').show();
            }
        });
    });


    // Not implementing yet, but will be used for the diplomatic/scribal bits.
    function toggle_sic_on(){
        $("corr").hide();
        $('sic').show();
    }

    function toggle_sic_off(){
        $('sic').hide();
        $("corr").show();
    }


    $(function image_reveal(){
        $('#image-reveal').click(function(){
            hide_non_active_panels();
            $('#image-header').addClass('active-element');
            $('#image-header').show();
            $('#ms-image-container').show();
            $('#ms-image').show();
            $('#side-panel').css('display', 'block');
            // $('#ms-image').css('display', 'block !important');
            open_sidepanel();
        });
    });

    $(function tei_reveal(){
        $('#tei-reveal').click(function(){

            hide_non_active_panels();
            // this is not working quite right
            $('#tei-embed-header').show();
            $('#tei-embed-header').addClass('active-element');
            $('#side-panel').show();
            $('.note-contents').css('display', 'none');
            $('#tei-embed-header').html('<img src="https://raw.githubusercontent.com/wludh/huon_rails/master/app/assets/images/ajax-loader-trans.gif" />');
            $('#tei-embed-container').css('display', 'inline');
            open_sidepanel();

            $.ajax({
                success: function(){
                    short = $('#tei-secret-file-name').text();
                    $('#tei-embed-header').html('TEI for this laisse. Full MS TEI viewable on <a href="https://raw.githubusercontent.com/wludh/huon_rails/master/lib/assets/' + short + '.xml">GitHub</a>');
                    $('#tei-embed').show();
                }
            });
            $.ajax({
                success:function(){
                    $('#loading-gif').hide();
                }
            });
        });
    });
    page_prep();
};

// $(document).ready(ready);
// $(document).on("page:load", ready);
$(document).on("turbolinks:load", ready);
// $(window).bind('page:change', ready);
