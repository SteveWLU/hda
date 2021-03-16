---
layout: default
permalink: about/technical-notes.html
title: Technical Notes
---

# Technical Notes

For TEI Encoding criteria, please see the Criteria section of the website. 

## Jekyll 
The *Huon d'Auvergne* Digital Archive is built using the static site framework [Jekyll](https://jekyllrb.com/). We chose this framework for several reasons. 1) The textual and static nature of our project does not necessitate a robust or dynamic database-driven platform. 2) Familiarity with Jekyll in our small development team. 3) The potential of Jekyll to integrate with new technologies like the CETEIcean Javascript library and the International Image Interoperability Framework. 

We rely heavily on the [Liquid](https://jekyllrb.com/docs/liquid/) templating language and the front matter structure in Jekyll to structure our site. 

## CETEIcean
[CETEIcean](https://github.com/TEIC/CETEIcean) is "a Javascript library that allows TEI documents to be displayed in a web browser without first transforming them to HTML." It uses HTML 5 Custom Elements which enables you to perform actions on the TEI elements as if they were HTML, rather than requiring XML transformation methods like XSLT. Because it uses more common web technologies, we find CETEIcean to be a better fit for our small development team. CETEIcean was created by Hugh Cayless and Raff Viglianti and you can learn more in their Balisage paper: [CETEIcean: TEI in the Browser](https://www.balisage.net/Proceedings/vol21/html/Cayless01/BalisageVol21-Cayless01.html). We are extremely grateful to Raff Viglianti for his assistance in configuring multiple sections of our project, including the [page function](https://github.com/SteveWLU/SteveWLU.github.io/blob/9b977250af06d79f1bd8f581999c982c9687af5c/_layouts/edition.html#L128) and the [notes function](https://github.com/SteveWLU/SteveWLU.github.io/blob/9b977250af06d79f1bd8f581999c982c9687af5c/_layouts/edition.html#L234).

## IIIF
The [International Image Interoperability Framework](https://iiif.io/) is an emerging standard for providing access to digital images. By using a shared standard instead of local or proprietary systems, researchers and institutions can benefit. Given that our project relies on manuscript from four separate institutions, it was necessary to design our project to accommodate a range of attribution. 

Manifests for each of the manuscript facsimiles are available: 
* B manifest
* BR manifest
* P manifest 
* R manifest
* T manifest 

## Credits 
