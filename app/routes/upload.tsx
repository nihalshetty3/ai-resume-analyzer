import { prepareInstructions } from 'constants';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { string } from 'valibot';
import FileUploader from '~/Components/FileUploader';
import Navbar from '~/Components/Navbar';
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';


const Upload = () => {
  const {auth, isLoading, fs, ai, kv}= usePuterStore();
  const navigate= useNavigate();

  const [isProcessing, setIsProcessing] = useState(true);
  const [statusText, setStatusText] = useState('');
  const [file, setFile]=useState<File | null>(null);

  const handleAnalyze = async({companyName, jobTitle, jobDescription, file } : {companyName:string, jobTitle:string, jobDescription:string, file:File}){
      setIsProcessing(true);
      setStatusText('Uploading the file...');
      const uploadedFile = await fs.upload([file]);

      if(!uploadedFile) setStatusText('Error: Failed to upload the file');

      //here file has been uploaded suceesfully
      setStatusText('Converting to Image...');

      //coverting pdf to image
      const imageFile= await convertPdfToImage(file);

      if(!imageFile.file) return setStatusText('Error failed to convert PDF to image!');

      setStatusText('Uploading the image...');
      const uploadedImage= await fs.upload([imageFile.file]);

      if(!uploadedImage) setStatusText('Error: Failed to upload image');
      setStatusText('Preparing data...');
      const uuid= generateUUID();
      
      const data={
        id:uuid, 
        resumePath: uploadFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle, jobDescription,
        feedback: ' ',
      }

      await kv.set(`resume.${uuid}`, JSON.stringify(data));
      setStatusText('Analyzing...');
      const feedback = await ai.feedback(
        uploadedFile.path, 
       prepareInstructions9({jobTitle, jobDescription})
      )

      if(!feedback) return setStatusText('Error: failed to analyze resume');

      //at this point theres feedback
      // if the feedback is in string return string
      // if the array then arr[0]
      const feedbacktext = typeof feedback.message.content=== 'string'
      ? feedback.message.content 
      : feedback.message.content[0].text;

      data.feedback = JSON.parse(feedbacktext);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText('Analysis complete, redirecting...');

      console.log(data);
  }


  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form= e.currentTarget.closest('form');
    if(!form) return;
    const formData = new FormData(form);

    const companyName= formData.get('company-name');
    const jobTitle= formData.get('job-title');
    const jobDescription= formData.get('job-Description') as string;

     if(!file) return;

     handleAnalyze({companyName, jobTitle, jobDescription, file});
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for ATS score and improvement tips</h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
               <FileUploader onFileSelect={handleFileSelect}/>
              </div>
            

            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
