#!/bin/bash
#$OMNISHARP_ROSLYN_VERSION=(Get-Content package.json | ConvertFrom-Json).'omnisharp-roslyn'i
OMNISHARP_ROSLYN_VERSION=v1.9-beta11

dotnet --version

rm -rf vendor/omnisharp-roslyn
mkdir vendor/omnisharp-roslyn
pushd vendor/omnisharp-roslyn

wget -O source.tar.gz "https://github.com/OmniSharp/omnisharp-roslyn/archive/$OMNISHARP_ROSLYN_VERSION.tar.gz"
tar zxvf source.tar.gz
rm source.tar.gz
dir=$(ls -d -1 */)
echo Dir=	$dir
cp -r $dir/* .
rm -r $dir
dotnet restore
popd

pushd vendor/src/OmniSharp.TypeScriptGeneration
dotnet restore
dotnet run ../../..
popd
