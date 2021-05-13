echo OFF
echo Building private extension
if exist pkg (
   rmdir /S /Q pkg || goto :error
)
mkdir pkg || goto :error

echo Copying private extension template files
xcopy /S /Y templates\private\* pkg\ || goto :error

echo Copying source files
xcopy /S /Y src\* pkg\Tasks\StartTask\ >NUL || goto :error
xcopy /S /Y src\* pkg\Tasks\EndTask\ >NUL || goto :error
echo Copying source files DONE

pushd .
echo.
echo ======================================
echo Building StartTask
cd pkg\Tasks\StartTask
cmd /C "npm install && tsc || goto :error"
echo StartTask is ready
echo ======================================
popd

pushd .
echo.
echo ======================================
echo Building EndTask
cd pkg\Tasks\EndTask
cmd /C "npm install && tsc || goto :error"
echo EndTask is ready
echo ======================================
popd

pushd .
echo.
echo ======================================
echo Packaging the extension
cd pkg
cmd /C tfx extension create --manifests vss-extension.json --output-path ..\ || goto :error
echo The extension is ready
echo ======================================
popd

goto :eof

:error
echo Error occurred
popd
goto :eof