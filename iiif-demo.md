---
layout: default
title: "IIIF demos: a presentation and an image"
iiif_image: Jheronimus_Bosch_011-1
---

This is a demo of [jekyll-iiif](https://github.com/pbinkley/jekyll-iiif).

## Presentation view

{% iiif_presentation narrenschiff %}

Source of page images: [Aff-ghebeelde narren speel-schuyt](https://archive.org/details/affghebeeldenarr00bran), 1610 (internet Archive).

Manifest: {{ site.url }}{{ site.baseurl }}/tiles/narrenschiff/manifest.json

[Drag-and-drop link](https://medium.com/@aeschylus/create-and-share-iiif-items-quickly-and-easily-with-drag-and-drop-over-email-879f13c9caba#.xm0t9nud1): [![IIIF]({{ site.baseurl }}/iiif_viewer/International_Image_Interoperability_Framework_logo.png){:.draggablelogo}]({{ site.url }}{{ site.baseurl }}/narrenschiff/?manifest={{ site.url | append: site.baseurl | append: "/tiles/narrenschiff/manifest.json" | cgi_escape }}&canvas={{ site.url | append: site.baseurl | append: "/tiles/narrenschiff/canvas/front.json" | cgi_escape }})

## Image view

{% iiif %}

Image source: [Hieronymus Bosch, Ship of Fools](https://en.wikipedia.org/wiki/Ship_of_Fools_(painting)#/media/File:Jheronimus_Bosch_011.jpg) (Wikimedia)

Manifest: {{ site.url }}{{ site.baseurl }}/tiles/Jheronimus_Bosch_011/manifest.json

[Drag-and-drop link](https://medium.com/@aeschylus/create-and-share-iiif-items-quickly-and-easily-with-drag-and-drop-over-email-879f13c9caba#.xm0t9nud1): [![IIIF]({{ site.baseurl }}/iiif_viewer/International_Image_Interoperability_Framework_logo.png){:.draggablelogo}]({{ site.url }}{{ site.baseurl }}/Jheronimus_Bosch_011/?manifest={{ site.url | append: site.baseurl | append: "/tiles/Jheronimus_Bosch_011/manifest.json" | cgi_escape }}&canvas={{ site.url | append: site.baseurl | append: "/tiles/Jheronimus_Bosch_011-1/canvas/front.json" | cgi_escape }})
