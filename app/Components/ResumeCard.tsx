import React, { use } from "react";
import ScoreCircle from "./ScoreCircle";
// 👉 If using plain React Router DOM
import { Link } from "react-router";
// 👉 If using Remix instead, uncomment this line and remove above
// import { Link } from "@remix-run/react";

import type { Resume } from "../../types";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  const{auth, fs}= usePuterStore();
  const [resumeUrl, setResumeUrl]= useState('');

  useEffect ( () =>{
      const loadResume = async() =>{
        const blob = await fs.read(resumes.imagePath);
        if(!blob) return;
        let url = URL.createObjectURL(blob);
      }
  
      loadResume();
    }, [resume.imagePath]);


  return (
    <Link
      to={`/resume/${resume.id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
      <div className="flex flex-col gap-2">
        {resume.compnayName && <h2 className=" !text-black font-bold break-words">
          {resume.companyName}
        </h2>}

        {resume.jobTitle &&<h3 className="text-lg break-words text-gray-500"> 
          {resume.jobTitle}
        </h3>}
        {!resume.companyName && !resume.jobTitle && <h2 className="!text-black font-bold"> Resume</h2>}
      </div>

      <div className="flext-shrink-0">
        <ScoreCircle score={resume.overallScore} /> 
      </div>
      </div>
      
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img 
           src={resume.imagePath}
           alt="resume"
           className="w-full h=[350px] max-sm:h-[200px] object-cover"
           ></img>
        </div>
      </div>
      )}

    </Link>
  );
};

export default ResumeCard;
