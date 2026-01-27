
Add-Type -AssemblyName System.Drawing
$imagePath = "C:/Users/ADMIN/.gemini/antigravity/brain/5297ea57-022b-46fc-bc7b-38c03ee76caa/uploaded_media_1769528440169.png"
try {
    $bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
    
    # Target is the right window. 
    # Sampling coordinates roughly in the clear background area of the right window.
    # Width * 0.8 (right side), Height * 0.15 (top area, usually free of main content)
    $x = [int]($bmp.Width * 0.8)
    $y = [int]($bmp.Height * 0.15)
    
    # Check bounds
    if ($x -lt $bmp.Width -and $y -lt $bmp.Height) {
        $pixel = $bmp.GetPixel($x, $y)
        Write-Output "BackgroundHex: #$($pixel.R.ToString('X2'))$($pixel.G.ToString('X2'))$($pixel.B.ToString('X2'))"
        Write-Output "RGB: $($pixel.R), $($pixel.G), $($pixel.B)"
    } else {
        Write-Output "Coordinates out of bounds"
    }
    
    # Sample a secondary point slightly lower/left to confirm
    $x2 = [int]($bmp.Width * 0.7)
    $y2 = [int]($bmp.Height * 0.25)
     if ($x2 -lt $bmp.Width -and $y2 -lt $bmp.Height) {
        $pixel2 = $bmp.GetPixel($x2, $y2)
        Write-Output "BackgroundHex2: #$($pixel2.R.ToString('X2'))$($pixel2.G.ToString('X2'))$($pixel2.B.ToString('X2'))"
    }

    $bmp.Dispose()
} catch {
    Write-Output "Error: $_"
}
