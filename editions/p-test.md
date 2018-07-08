---
layout: edition
title: Padua edition
---


<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script>
      var CETEIcean = new CETEI();
      var manuscripts = {
      "P" : {
       "name": "P",
       "resource" : "p.xml"
      },
      "Br" : {
        "name" : "Br",
        "resource" : "br.xml"
      },
      "T" : {
        "name" : "T",
        "resource" : "t.xml"
      },
      "B" : {
        "name" : "B",
        "resource" : "b.xml" 
      }
    };



      var sectionsSet = new Set();

        //Object for all options. Not currently used, but is updated in toggle functions
      var options = {
        "expanded_abbreviations":true,
        "foliation":false,
        "linebeginnings":false,
        "editor_punctuation":true,
        "editor_capitalization":true
      };

      //functions
      function addManuscript(ms){
        CETEIcean.getHTML5(ms.resource, function(data){
          var ms_el = "#"+ms.name;
          $(ms_el).html("");
          $(ms_el).append(data);
          CETEIcean.addStyle(document, data);

      //Add facs div to each cb (foliation) with valid attribute
        addFoliation(ms_el);

        $(ms_el + " tei-lb").toggle(); //Start off manuscripts with line beginnings off
      });
    }


    function addFoliation(ms_el) {
      $(ms_el+" tei-milestone").each(function(){
        var n = $(this).attr("n");
        var milestone = "";
        if(typeof(n) === "undefined"){
          var unit = $(this).attr("unit");
          if(typeof(unit) != "undefined"){
            milestone = unit;
          }
        } else {
          milestone = n;
        }
        $(this).html("<span class='page-break'>" + milestone + "</span>");
      });
    }

    //Add all manuscripts
    for (var ms in manuscripts) {
      addManuscript(manuscripts[ms]);
    }

    //Function to toggle foliation
    $("input[name='foliation-toggle'").change(function(){
      options.foliation = $(this).is(":checked");
      if(options.foliation){
        if(options.linebeginnings){
          $("tei-milestone").css("display", "block");
        } else {
          $("tei-milestone").css("display", "inline");
        }
      } else {
        $("tei-milestone").hide();
      }
    });
    
</script>
