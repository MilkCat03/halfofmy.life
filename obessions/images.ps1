# ===== CONFIG =====
$ImageDirectory = "C:\Users\ARI\Documents\GitHub\halfofmy.life\obessions\thom yorke\media\old"   # change this
$Extensions = @(".jpg", ".jpeg", ".png", ".gif", ".webp")

# ==================

Get-ChildItem -Path $ImageDirectory -Recurse -File |
Where-Object { $Extensions -contains $_.Extension.ToLower() } |
ForEach-Object {
    # Convert Windows paths to web-friendly paths
    $relativePath = $_.FullName.Replace($ImageDirectory, "").TrimStart("\")
    $relativePath = $relativePath -replace "\\", "/"

@"
<div class="grid-item" onclick="openModal(this)">
    <img src="media/old/$relativePath">
</div>
"@
}

Read-Host "Press Enter to exit"