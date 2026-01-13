import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, BookOpen, FileText, CheckCircle2, Calculator, Info, Search, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const resources = [
  {
    category: "Study Materials",
    icon: BookOpen,
    color: "text-blue-500",
    items: [
      {
        title: "OpenStax Anatomy & Physiology Textbook",
        type: "Textbook",
        link: "https://openstax.org/details/books/anatomy-and-physiology"
      },
      {
        title: "Free Nursing Textbooks Collection",
        type: "PDF",
        link: "https://freebooksnursing.com/"
      },
      {
        title: "Medscape Pathophysiology Articles",
        type: "Articles",
        link: "https://www.medscape.com/pathophysiology"
      },
      {
        title: "Pharmacology LibreTexts",
        type: "Textbook",
        link: "https://pharmacy.libretexts.org/"
      },
      {
        title: "Sample Nursing Care Plans",
        type: "Templates",
        link: "https://nurseslabs.com/nursing-care-plans/"
      }
    ]
  },
  {
    category: "Video Tutorials",
    icon: PlayCircle,
    color: "text-red-500",
    items: [
      {
        title: "RegisteredNurseRN YouTube Channel",
        type: "Video",
        link: "https://www.youtube.com/c/RegisteredNurseRN"
      },
      {
        title: "American Red Cross CPR & First Aid",
        type: "Video",
        link: "https://www.youtube.com/user/RedCross"
      },
      {
        title: "Khan Academy Health & Medicine",
        type: "Video",
        link: "https://www.khanacademy.org/science/health-and-medicine"
      },
      {
        title: "NRSNG Free Video Tutorials",
        type: "Video",
        link: "https://www.nrsng.com/free-nursing-resources/"
      }
    ]
  },
  {
    category: "Interactive Tools",
    icon: Calculator,
    color: "text-emerald-500",
    items: [
      {
        title: "NCLEX Practice Questions",
        type: "Quiz",
        link: "https://www.registerednursern.com/nclex-practice-questions/"
      },
      {
        title: "Medical Calculators (Dosage, BMI, IV Rate)",
        type: "Calculator",
        link: "https://www.mdcalc.com/"
      },
      {
        title: "Clinical Case Scenarios",
        type: "Simulation",
        link: "https://www.clinicalcases.org/"
      },
      {
        title: "Free Nursing Quizzes",
        type: "Quiz",
        link: "https://www.nursing.com/nclex-prep/free-nclex-practice-questions/"
      }
    ]
  },
  {
    category: "Guidelines & References",
    icon: Info,
    color: "text-orange-500",
    items: [
      {
        title: "CDC Infection Control Guidelines",
        type: "Guideline",
        link: "https://www.cdc.gov/infectioncontrol/index.html"
      },
      {
        title: "WHO Nursing & Midwifery Guidelines",
        type: "Guideline",
        link: "https://www.who.int/teams/nursing-and-midwifery"
      },
      {
        title: "Medscape Drug Reference",
        type: "Reference",
        link: "https://reference.medscape.com/drugs"
      },
      {
        title: "PubMed Open Access Research",
        type: "Research",
        link: "https://pubmed.ncbi.nlm.nih.gov/"
      }
    ]
  }
];

export default function NursingResources() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b h-16 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-display">Nursing Resources</h1>
          </div>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="pl-9 h-9 w-64 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="hidden md:block space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">Categories</h2>
            {resources.map((res) => (
              <Button
                key={res.category}
                variant="ghost"
                className="w-full justify-start gap-3 h-10 px-3 hover-elevate"
              >
                <res.icon className={`h-4 w-4 ${res.color}`} />
                {res.category}
              </Button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-3 space-y-12">
            {resources.map((category, catIdx) => (
              <motion.section 
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                  <h2 className="text-2xl font-bold font-display">{category.category}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <Card key={item.title} className="p-4 hover:shadow-md transition-shadow group cursor-pointer border-border/60">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider h-5">
                            {item.type}
                          </Badge>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </a>
                    </Card>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}
