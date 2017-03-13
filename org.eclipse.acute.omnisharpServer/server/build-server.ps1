$OMNISHARP_ROSLYN_VERSION=(Get-Content package.json | ConvertFrom-Json).'omnisharp-roslyn'

Remove-Item vendor/omnisharp-roslyn -Recurse -Force
mkdir vendor/omnisharp-roslyn
pushd vendor/omnisharp-roslyn

Invoke-WebRequest "https://github.com/OmniSharp/omnisharp-roslyn/archive/$OMNISHARP_ROSLYN_VERSION.tar.gz" -OutFile '.\source.tar.gz'
tar zxvf source.tar.gz
Remove-Item source.tar.gz
$dir = (gci . -Directory)[0].FullName;
Copy-Item $dir\* . -Recurse
Remove-Item $dir -Recurse
dotnet restore
popd

pushd vendor/src/OmniSharp.TypeScriptGeneration
dotnet restore
dotnet run ../../..
popd
