Add-Type -AssemblyName System.Drawing

function Generate-BrandLogo($filePath) {
    $bmp = New-Object System.Drawing.Bitmap 512, 512
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    $rect = New-Object System.Drawing.Rectangle 16, 16, 480, 480
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush ($rect, [System.Drawing.Color]::FromArgb(11, 110, 153), [System.Drawing.Color]::FromArgb(22, 166, 163), 45.0)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $radius = 100
    $d = $radius * 2
    $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
    $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
    $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
    $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $g.FillPath($brush, $path)

    # Draw Cross
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $g.FillRectangle($whiteBrush, 216, 116, 80, 280)
    $g.FillRectangle($whiteBrush, 116, 216, 280, 80)

    # Draw Heart curve inside
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White, 16)
    $g.DrawArc($pen, 190, 180, 60, 60, 180, 180)
    $g.DrawArc($pen, 250, 180, 60, 60, 180, 180)

    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Successfully saved $filePath"
}

Generate-BrandLogo 'e:\FP\Hospital\all_images\medicare_brand_logo.png'
Generate-BrandLogo 'e:\FP\Hospital\all_images\logos\medicare_brand_logo.png'
