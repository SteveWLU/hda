for i in *.jpg; do
	printf "converting $i\n"
	convert "$i" -define tiff:tile-geometry=256x256 -compress jpeg "ptif:$i.tif"
done