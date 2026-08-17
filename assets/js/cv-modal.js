/* 
  ATS CV Viewer Modal & Download Handler
  Mostafa Karam Saeed Portfolio
*/

function openCvModal() {
  const modal = document.getElementById('cv-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCvModal() {
  const modal = document.getElementById('cv-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function downloadCvFile(format = 'docx') {
  const fileName = format === 'pdf' ? 'Mostafa_Karam_CV_ATS.pdf' : 'Mostafa_Karam_CV_ATS.docx';
  const cvPath = `assets/cv/${fileName}`;
  
  const link = document.createElement('a');
  link.href = cvPath;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
