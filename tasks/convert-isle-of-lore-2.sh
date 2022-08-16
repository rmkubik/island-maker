cd rawAssets/isle-of-lore-2-recolors

convert "*.png" -set filename:fn "%[basename]-resize" -resize 100x100 -background none -gravity south -extent 134x134 "%[filename:fn].png"

cp *-resize.png ../../assets/isle-of-lore-2-recolors

rm *-resize.png