
Add-Type -AssemblyName System.Drawing
$imagePath = "C:/Users/ADMIN/.gemini/antigravity/brain/5297ea57-022b-46fc-bc7b-38c03ee76caa/uploaded_media_1769528440169.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)

$found = $false
$startY = [int]($bmp.Height * 0.05)
$endY = [int]($bmp.Height * 0.20)
$startX = [int]($bmp.Width * 0.70)
$endX = [int]($bmp.Width * 0.95)

Write-Host "Scanning area: $startX,$startY to $endX,$endY (Image size: $($bmp.Width)x$($bmp.Height))"

for ($y = $startY; $y -lt $endY; $y += 5) {
    for ($x = $startX; $x -lt $endX; $x += 5) {
        $pixel = $bmp.GetPixel($x, $y)
        # Look for predominant blue.
        if ($pixel.B -gt ($pixel.R + 40) -and $pixel.B -gt ($pixel.G + 40) -and $pixel.B -gt 100) {
           $hex = "#{0:X2}{1:X2}{2:X2}" -f $pixel.R, $pixel.G, $pixel.B
           Write-Host "Blue/Purple Candidate found at ($x, $y) -> $hex (R:$($pixel.R) G:$($pixel.G) B:$($pixel.B))"
           $found = $true
           # Keep scanning a bit to find the 'best' one (brightest/most saturated)
           if ($pixel.B -gt 200) { break }
        }
    }
    if ($found) { break }
}
$bmp.Dispose()
