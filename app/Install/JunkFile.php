<?php

namespace App\Install;

use Illuminate\Support\Facades\File;

class JunkFile
{
    public function getFiles()
    {
        $trueFiles = ['0.67ea79e3.chunk.js', '1.0e91a3a5.chunk.js', '10.9a693340.chunk.js', '11.75c97eea.chunk.js', '12.e9befe2a.chunk.js', '13.e2f64f6a.chunk.js', '14.bbed23ed.chunk.js', '15.890e4492.chunk.js', '16.42938481.chunk.js', '17.9c84c2c5.chunk.js', '18.243f27a7.chunk.js', '19.ffc86e44.chunk.js', '2.f8fdecb5.chunk.js', '20.eb94fcae.chunk.js', '21.60185ee7.chunk.js', '22.42335c40.chunk.js', '23.339178c6.chunk.js', '24.fa65a5f2.chunk.js', '25.930787d1.chunk.js', '26.209cf225.chunk.js', '27.344e3dcf.chunk.js', '28.12e5edfc.chunk.js', '29.8e539131.chunk.js', '3.35dc2256.chunk.js', '30.09cb6a74.chunk.js', '31.693f165d.chunk.js', '32.e4bcf628.chunk.js', '33.00cf3d9c.chunk.js', '34.9b73d37c.chunk.js', '35.b4da0f41.chunk.js', '36.ed6a1c7a.chunk.js', '37.d6bc683c.chunk.js', '38.8c1cdd7b.chunk.js', '39.4e385ba9.chunk.js', '4.18274ff6.chunk.js', '5.0f466ab9.chunk.js', '6.b0b97e1b.chunk.js', '7.d21e06f3.chunk.js', '8.deed215a.chunk.js', 'main.65e0b372.chunk.js', 'runtime~main.b4781cc8.js'];
        return $trueFiles;
    }

    public function delete()
    {
        $trueFiles = self::getFiles();

        $filesToDelete = [];

        if (is_dir(base_path('static/js'))) {

            $allFrontendFiles = File::files(base_path('static/js/'));
            foreach ($allFrontendFiles as $frontFile) {
                $file = pathinfo($frontFile);
                if (!in_array($file['basename'], $trueFiles)) {
                    array_push($filesToDelete, $file['basename']);
                }
            }

            if (!empty($filesToDelete)) {
                foreach ($filesToDelete as $file) {
                    $filename = base_path('static/js/' . $file);
                    unlink($filename);
                }
            }
        }
    }
}
