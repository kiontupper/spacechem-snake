# SpaceChem Snake

<https://kiontupper.github.io/spacechem-snake>

> Note: to avoid copyright infringement, you must upload textures and sounds from a local copy of the game.

## Getting Assets

You'll need to purchase and install [SpaceChem](https://store.steampowered.com/app/92800/SpaceChem/) on your system. Don't worry if you have macOS Catalina, we don't need the game to run for this to work, we just need a downloaded copy of the game to extract assets from.

To start, open the game in your file manager (for Steam, it should be in your `steamapps` folder, under `common`). Google knows where `steamapps` is.

### Sound

The sound file is the easy part. Simply find `sfx_PipeExtend.wav` in the `SpaceChem/sounds` folder and upload it.

### Textures

Textures are stored in a raw RGB format. Some work is needed the first-time-around to convert it to the correct format. Fortunately, [GIMP](https://www.gimp.org) is free and can import them.

 1. Open the `SpaceChem/images` folder.
 2. The pipe texture is part of `051.tex`, so copy that file to a different folder (so as not to break the SpaceChem installation), and _rename the file to 051.**data**._ This is extremely important, otherwise GIMP won't know what to do with the file.
 3. Open GIMP to a new blank window and drag `051.data` onto the window.
 4. Set `Image Type` to **RGB Alpha**, `Offset` to **16**, `Width` to **1024**, and `Height` to **1024**. Leave the other values the same.
 5. Make sure that the preview is a clear image (e.g. not a garbled mess). If the image is garbled, slanted, or miscolored, one of your settings is wrong.
 6. Click **Open**.
 7. Do not, and I repeat, _do not_ crop or modify the image. The SpaceChem snake code will take care of it using the correct parts of the image.
 8. In the **File** menu, click **Export As...** and name it something. Make sure to include `.png` at the end of your file name so GIMP can export it correctly. Save it somewhere you can find later. When the export dialog comes up, just leave everything as default and click `Export`.
 9. Upload the exported PNG to the SpaceChem snake website and enjoy!
 10. P.S.: Once you have your PNG, you can close GIMP and discard the "unsaved changes."
