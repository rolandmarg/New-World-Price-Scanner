<# : batch portion (begins PowerShell multiline comment block)
@echo off & setlocal

set /P "=Waiting for ctrl-F... "<NUL

rem # re-launch self with PowerShell interpreter
powershell -noprofile "iex (${%~f0} | out-string)"

echo Pressed.  Toodles.

goto :EOF
: end batch / begin PowerShell chimera #>

# import GetAsyncKeyState()
Add-Type user32_dll @'
    [DllImport("user32.dll")]
    public static extern short GetAsyncKeyState(int vKey);
'@ -namespace System

# for Keys object constants
Add-Type -As System.Windows.Forms

function keyPressed($key) {
    return [user32_dll]::GetAsyncKeyState([Windows.Forms.Keys]::$key) -band 32768
}

while ($true) {
    $ctrl = keyPressed "ControlKey"
    $F = keyPressed "F"
    if ($ctrl -and $F) { node index.js }
    start-sleep -milliseconds 40
}

$Host.UI.RawUI.FlushInputBuffer()