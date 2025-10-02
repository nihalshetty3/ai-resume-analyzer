import Navbar from "~/Components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants/index";
import ResumeCard from "~/Components/ResumeCard";
import { useNavigate } from "react-router";
import { use, useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import useState from 'react';
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const {auth, fs} = usePuterStore();
  const navigate = useNavigate();
  const [resumeUrl, setResume] = useState('');

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
          <h2>Review Your Submissions and check AI-powered feedback</h2>
        </div>

      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
       </section>
    </main>
  );
}
