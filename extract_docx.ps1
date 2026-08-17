[System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem")
$zip = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\MdsoftAlam\Downloads\Mostafa_Karam_CV_ATS.docx')
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$text = [regex]::Replace($xml, '<[^>]+>', "`n")
$lines = $text -split "`n" | Where-Object { $_.Trim() -ne "" }
$lines -join "`n" | Out-File -FilePath 'C:\Users\MdsoftAlam\.gemini\antigravity-ide\scratch\mostafa-karam-portfolio\cv_text.txt' -Encoding utf8
Get-Content 'C:\Users\MdsoftAlam\.gemini\antigravity-ide\scratch\mostafa-karam-portfolio\cv_text.txt'
