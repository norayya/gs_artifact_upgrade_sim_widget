npx esbuild src/index.ts --bundle --outfile=target/index.js --format=iife --target=es2016 --tree-shaking=false --minify

if (!($LASTEXITCODE -eq 0)) {
    Write-Host "Esbuild failed, $LASTEXITCODE"
    exit $LASTEXITCODE
}

$js = Get-Content "target/index.js" -Raw -Encoding UTF8

$html = Get-Content "src/index.html" -Raw -Encoding UTF8

$replaceMark = "<!--INSERT_JS_HERE -->"

$html = $html -replace [regex]::Escape($replaceMark), $js

Set-Content "target/index.html" $html -Encoding UTF8

