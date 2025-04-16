# PowerShell script to set up the StorySketch project structure

# Create frontend directories
$frontendDirs = @(
    "frontend/src/components",
    "frontend/src/pages",
    "frontend/src/services",
    "frontend/src/utils",
    "frontend/src/assets",
    "frontend/src/hooks",
    "frontend/src/context",
    "frontend/public"
)

# Create backend directories
$backendDirs = @(
    "backend/src/controllers",
    "backend/src/models",
    "backend/src/routes",
    "backend/src/services",
    "backend/src/utils",
    "backend/src/middleware",
    "backend/src/config",
    "backend/tests"
)

# Create other directories
$otherDirs = @(
    "docs",
    "scripts"
)

# Create all directories
$allDirs = $frontendDirs + $backendDirs + $otherDirs
foreach ($dir in $allDirs) {
    $path = "projects/02_storysketch/$dir"
    if (-not (Test-Path $path)) {
        Write-Host "Creating directory: $path"
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    } else {
        Write-Host "Directory already exists: $path"
    }
}

Write-Host "Project structure setup complete!"
