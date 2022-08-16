# Island Maker

## How to Recolor Isle of Lore 2 Objects

1. Find asset to recolor in `rawAssets/isle-of-lore-2-strategy-figures-all/Sources/Figures`
2. Search for a corresponding color in an Isle of Lore asset using the Digital Color Meter
3. Find the appropriate layer in Krita nightly (need v5.1+, which is not released at time of writing)
4. Check fill tool settings in top right "Tool Options":

   - Fill with Contiguous Region

   - **Threshold: 25**
   - Spread 100%

   - **Anti-alias: true**
   - Grow: 0
   - Feather: 0

5. Use Fill tool on recolored layer piece
6. Save edited `.kra` file in `rawAssets/isle-of-lore-2-recolors`
7. Save file as `.png` file in `rawAssets/isle-of-lore-2-recolors`
8. Run `./tasks/convert-isle-of-lore-2.sh` to move files to `assets`
