
Add-Type -AssemblyName System.Drawing
$imagePath = "C:/Users/ADMIN/.gemini/antigravity/brain/5297ea57-022b-46fc-bc7b-38c03ee76caa/uploaded_media_1769528440169.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)

$found = $false
$startY = [int]($bmp.Height * 0.05)
$endY = [int]($bmp.Height * 0.15)
$startX = [int]($bmp.Width * 0.8)
$endX = [int]($bmp.Width * 0.95)

for ($y = $startY; $y -lt $endY; $y += 5) {
    for ($x = $startX; $x -lt $endX; $x += 5) {
        if ($x -lt $bmp.Width -and $y -lt $bmp.Height) {
            $pixel = $bmp.GetPixel($x, $y)
            if ($pixel.B -gt 150 -and $pixel.R -gt 50 -and $pixel.R -lt 200) {
               $hex = "#{0:X2}{1:X2}{2:X2}" -f $pixel.R, $pixel.G, $pixel.B
               Write-Host "Button found at ($x, $y) -> $hex"
               $found = $true
               break
            }
        }
    }
    if ($found) { break }
}
$bmp.Dispose()
