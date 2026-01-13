import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, MessageSquare, Award, BookOpen, Star, Linkedin, Twitter } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const teachers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Senior Nursing Educator",
    specialty: "Anatomy & Physiology",
    bio: "Dr. Johnson has over 15 years of experience in clinical nursing and medical education. She specializes in making complex physiological concepts easy to understand for nursing students.",
    rating: 4.9,
    students: 1240,
    courses: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    education: "PhD in Nursing Education, Yale University",
    verified: true
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    role: "Clinical Pharmacologist",
    specialty: "Pharmacology & Dosage",
    bio: "Professor Chen is a leading expert in safe medication administration. His teaching methods focus on practical dosage calculations and patient safety protocols.",
    rating: 4.8,
    students: 850,
    courses: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    education: "MS in Pharmacology, Johns Hopkins",
    verified: true
  },
  {
    id: 3,
    name: "Nurse Elena Rodriguez",
    role: "Maternal-Child Specialist",
    specialty: "Obstetrics & Pediatrics",
    bio: "Elena is a certified Nurse-Midwife with a passion for maternal health. She brings real-world labor and delivery experience into her virtual classroom.",
    rating: 4.7,
    students: 920,
    courses: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    education: "BSN, MSN - University of Pennsylvania",
    verified: true
  },
  {
    id: 4,
    name: "James Wilson, RN",
    role: "Critical Care Instructor",
    specialty: "Emergency Nursing",
    bio: "James specializes in ICU and Emergency Room protocols. He helps students prepare for the high-pressure environments of critical care units.",
    rating: 4.9,
    students: 630,
    courses: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    education: "CCRN Certification, NYU",
    verified: true
  }
];

export default function MeetTeachers() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <header className="bg-background border-b h-16 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">Our Educators</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold font-display mb-3">Meet Your Mentors</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn from industry experts with decades of clinical experience. Our teachers are here to guide your nursing journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {teachers.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/60 group bg-card h-full">
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-24 w-24 border-2 border-primary/20 ring-4 ring-background shadow-md">
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{teacher.rating}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold font-display text-foreground">{teacher.name}</h3>
                          {teacher.verified && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary border-none">
                              Verified Expert
                            </Badge>
                          )}
                        </div>
                        <p className="text-primary font-medium text-sm">{teacher.role}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed italic">"{teacher.bio}"</p>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Award className="w-3.5 h-3.5 text-primary" />
                        <span>{teacher.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span>{teacher.courses} Courses</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span>{teacher.students} Students</span>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <Button size="sm" className="flex-1 gap-2">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Send Message
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 gap-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        View Courses
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
