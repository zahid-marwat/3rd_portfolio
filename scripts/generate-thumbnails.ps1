Add-Type -AssemblyName System.Drawing

$srcBase = Join-Path $PSScriptRoot "..\public\assets"
$destBase = Join-Path $PSScriptRoot "..\public\assets-thumb"

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]72)

$projectDirs = @('dashboard_project', 'smart-annotator', 'cracks-project', 'road-assets-aci', 'traffice-monitoring-project', 'face-detection-project', 'botnet-detection', 'malware-detection')

foreach ($dir in $projectDirs) {
    $srcDir = Join-Path $srcBase $dir
    $destDir = Join-Path $destBase $dir
    if (-not (Test-Path $srcDir)) { continue }
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }

    Get-ChildItem -Path $srcDir -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg)$' } | ForEach-Object {
        $img = [System.Drawing.Image]::FromFile($_.FullName)
        $maxDim = 640
        $w = $img.Width
        $h = $img.Height
        if ($w -gt $maxDim -or $h -gt $maxDim) {
            if ($w -ge $h) {
                $nw = $maxDim
                $nh = [int]($h * ($maxDim / $w))
            } else {
                $nh = $maxDim
                $nw = [int]($w * ($maxDim / $h))
            }
        } else {
            $nw = $w
            $nh = $h
        }

        $canvas = New-Object System.Drawing.Bitmap $nw, $nh
        $g = [System.Drawing.Graphics]::FromImage($canvas)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $nw, $nh)
        $g.Dispose()
        $img.Dispose()

        $destFile = Join-Path $destDir ($_.BaseName + ".jpg")
        $canvas.Save($destFile, $codec, $encoderParams)
        $canvas.Dispose()

        $origK = [math]::Round($_.Length / 1024)
        $newK = [math]::Round((Get-Item $destFile).Length / 1024)
        Write-Host "$dir/$($_.Name): ${origK}KB -> ${newK}KB ($nw x $nh)"
    }
}
Write-Host "Done generating preview thumbnails!"
