$docxPath = 'C:\Users\MdsoftAlam\.gemini\antigravity-ide\scratch\mostafa-karam-portfolio\assets\cv\Mostafa_Karam_CV_ATS.docx'
$pdfPath  = 'C:\Users\MdsoftAlam\.gemini\antigravity-ide\scratch\mostafa-karam-portfolio\assets\cv\Mostafa_Karam_CV_ATS.pdf'

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open($docxPath)
    $doc.SaveAs($pdfPath, 17) # 17 = wdFormatPDF
    $doc.Close()
    $word.Quit()
    Write-Host "Successfully generated $pdfPath"
} catch {
    Write-Host "Failed to convert docx to pdf: $_"
}
