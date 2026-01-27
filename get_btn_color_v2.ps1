
Add-Type -AssemblyName System.Drawing
$imagePath = "C:/Users/ADMIN/.gemini/antigravity/brain/5297ea57-022b-46fc-bc7b-38c03ee76caa/uploaded_media_1769528440169.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)

# Scan top right area for button color
# Searching from x=80% to 95%, y=5% to 15%
$found = $false
for ($y = [int]($bmp.Height * 0.05); $y -lt [int]($bmp.Height * 0.15); $y += 5) {
    for ($x = [int]($bmp.Width * 0.80); $x -lt [int]($bmp.Width * 0.95); $x += 5) {
        $pixel = $bmp.GetPixel($x, $y)
        # Look for a vivid blue/purple
        # R > 50, B > 100
        if ($pixel.B -gt 150 -and $pixel.R -gt 50) {
            Write-Output "ButtonCandidate found at $x,$y: #$($pixel.R.ToString('X2'))$($pixel.G.ToString('X2'))$($pixel.B.ToString('X2'))"
            $found = $true
            break
        }
    }
    if ($found) { break }
}
$bmp.Dispose()
