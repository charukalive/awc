Add-Type -AssemblyName System.Drawing
$imgPath = Resolve-Path "web\assets\logo.png"
$img = [System.Drawing.Image]::FromFile($imgPath)
Write-Host "Original dimensions: $($img.Width) x $($img.Height)"
$targetW = 600
$targetH = [int]($img.Height * ($targetW / $img.Width))
$newImg = New-Object System.Drawing.Bitmap $targetW, $targetH
$g = [System.Drawing.Graphics]::FromImage($newImg)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage($img, 0, 0, $targetW, $targetH)
$g.Dispose()
$img.Dispose()
$outPath = Join-Path (Split-Path $imgPath) "og-preview.png"
$newImg.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newImg.Dispose()
$fileSize = (Get-Item $outPath).Length
Write-Host "Success! Created $outPath ($fileSize bytes)"
