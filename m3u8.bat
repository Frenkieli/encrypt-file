@echo off
setlocal

:: 检查 Node.js 是否安装
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit
)

node checkModules.js
if %ERRORLEVEL% neq 0 (
    echo Please correctly install the required modules.
    pause
    exit
)

:: 如果 Node.js 已安装，继续执行脚本
echo Node.js is installed.
echo Running script...



:: 檢查文件夾是否存在
if not exist ".\inputFolder\" (
    echo Creating directory .\inputFolder
    mkdir ".\inputFolder"
)

:: 執行 FFmpeg 命令
ffmpeg -i ".\index.mp4" -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ".\inputFolder\index.m3u8"
if %ERRORLEVEL% neq 0 (
    echo FFmpeg command execution failed.
    pause
    exit
)

:: 執行 加密解密的功能
node encryptScript.js
if %ERRORLEVEL% neq 0 (
    echo Encryption process failed.
    pause
    exit
)

:: 等待用戶輸入，防止窗口自動關閉
pause

endlocal