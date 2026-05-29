# setup-desktop-commander.ps1
# Adds Desktop Commander to Claude Desktop's MCP config, then restarts Claude.

$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
$configDir  = Split-Path $configPath

# Ensure the Claude config directory exists
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

# Load existing config or start fresh
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
} else {
    $config = [PSCustomObject]@{ mcpServers = [PSCustomObject]@{} }
}

# Ensure mcpServers key exists
if (-not $config.PSObject.Properties['mcpServers']) {
    $config | Add-Member -MemberType NoteProperty -Name 'mcpServers' -Value ([PSCustomObject]@{})
}

# Add desktop-commander entry
$desktopCommander = [PSCustomObject]@{
    command = "npx"
    args    = @("-y", "@wonderwhy-er/desktop-commander")
}

$config.mcpServers | Add-Member -MemberType NoteProperty -Name 'desktop-commander' -Value $desktopCommander -Force

# Write back
$config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8

Write-Host ""
Write-Host "✓ Desktop Commander added to $configPath" -ForegroundColor Green
Write-Host ""

# Restart Claude Desktop so it picks up the new server
$claude = Get-Process -Name "Claude" -ErrorAction SilentlyContinue
if ($claude) {
    Write-Host "Restarting Claude Desktop..." -ForegroundColor Yellow
    Stop-Process -Name "Claude" -Force
    Start-Sleep -Seconds 2
    $claudeExe = (Get-Command "Claude" -ErrorAction SilentlyContinue)?.Source
    if (-not $claudeExe) {
        $claudeExe = "$env:LOCALAPPDATA\Claude\Claude.exe"
    }
    if (Test-Path $claudeExe) {
        Start-Process $claudeExe
        Write-Host "✓ Claude Desktop restarted." -ForegroundColor Green
    } else {
        Write-Host "Restart Claude Desktop manually to activate Desktop Commander." -ForegroundColor Yellow
    }
} else {
    Write-Host "Claude Desktop is not running — open it and Desktop Commander will be available." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. Desktop Commander is now available in Claude." -ForegroundColor Cyan
