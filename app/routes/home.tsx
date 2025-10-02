import Navbar from "~/Components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/Components/ResumeCard";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const {auth, fs} = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes]= useState<Resume[]>([]);
  const[loadingResumes, setLoadingResumes]=useState(false);


  useEffect ( () =>{
    const loadResumes = async () =>{
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*',true )) as KVItem[];

      const parsedResumes = resumes ?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))
      console.log(parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }
      loadResumes();
  })

  useEffect( () => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect ( () =>{
    const loadResume = async() =>{
      const blob = await fs.read(resumes.imagePath);
      if(!blob) return;
      let url = URL.createObjectURL(blob);
    }

    loadResume();
  }, [resume.imagePath]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
     
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          if{!loadingResumes && resumes?.length === 0 ?(

          <h2>No resumes found. Upload your first resume</h2>

          ) : (
            <h2>Review your submission and check AI-powered feedback</h2>
          )}
          <h2>Review Your Submissions and check AI-powered feedback</h2>
        </div>

          {loadingResumes && (
             <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-[200px"/>
             </div>
          )}


      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      if{!loadingResumes && resumes ?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload resume
              </Link>
          </div>
      )}

       </section>
    </main>
  );
}
