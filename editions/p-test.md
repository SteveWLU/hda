---
layout: edition
title: Padua edition
---


<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
crossorigin="anonymous"></script>
<script>
      var CETEIcean = new CETEI();
      var manuscripts = {
        "B" : {
          "name": "B",
          "resource" : "b.xml",
        },
        "T" : {
          "name": "T",
          "resource" : "t.xml",
        },
        "Br" : {
          "name": "Br",
          "resource" : "br.xml",
          "manifest": "{{ sitebase.url }}/tiles/br-images/manifest.json"
        },
        "P" : {
          "name": "P",
          "resource" : "p.xml",
          "manifest": "{{ sitebase.url }}/tiles/p-images/manifest.json"
        }
      };

      var sectionsSet = new Set();


      function addManuscript(ms){
        CETEIcean.getHTML5(ms.resource, function(data){
          var ms_el = "#"+ms.name;
          $(ms_el).html("");
          $(ms_el).append(data);
          CETEIcean.addStyle(document, data);

        addFoliation(ms_el);

        $(ms_el + " tei-lb").toggle();
      });
    }


    function addFoliation(ms_el) {
      $(ms_el+" tei-cb").each(function(){
        var n = $(this).attr("n");
        var pb = "";
        if(typeof(n) === "undefined"){
          var facs = $(this).attr("facs");
          if(typeof(facs) != "undefined"){
            pb = facs;
          }
        } else {
          pb = n;
        }
        $(this).html("<span class='page-break'>" + pb + "</span>");
      });
    }

    //Add all manuscripts
    for (var ms in manuscripts) {
      addManuscript(manuscripts[ms]);
    }
</script>
