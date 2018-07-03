---
layout: edition
title: Berlin edition
---
<head>
<script src="../../assets/js/CETEI.js"></script>
<link rel="stylesheet" href="../assets/css/CETEIcean.css">
</head>
<div id: "tei-wrapper">
<script>
      var CETEIcean = new CETEI();
      CETEIcean.getHTML5('/editions/b.xml', function(data) {
        document.getElementById("TEI").innerHTML = "";
        document.getElementById("TEI").appendChild(data);
        CETEIcean.addStyle(document, data);
      });
      // Alternatively, use then()
      // (new CETEI).getHTML5('testTEI.xml').then(function(data){
      //   document.getElementById("TEI").appendChild(data);
      // });
</script>
</div>
