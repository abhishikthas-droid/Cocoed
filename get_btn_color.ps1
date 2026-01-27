
Add-Type -AssemblyName System.Drawing
$imagePath = "C:/Users/ADMIN/.gemini/antigravity/brain/5297ea57-022b-46fc-bc7b-38c03ee76caa/uploaded_media_1769528440169.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)

# Button is likely top right.
# Let's scan a small area around 85% width, 10% height
for ($i = 0; $i -lt 20; $i++) {
    $x = [int]($bmp.Width * (0.85 + ($i * 0.005)))
    $y = [int]($bmp.Height * 0.12)
    $pixel = $bmp.GetPixel($x, $y)
    # Check if not background color (which is likely dark)
    if ($pixel.R -gt 50 -or $pixel.B -gt 50) {
        Write-Output "ButtonCandidate: #$($pixel.R.ToString('X2'))$($pixel.G.ToString('X2'))$($pixel.B.ToString('X2'))"
        break
    }
}
$bmp.Dispose()
