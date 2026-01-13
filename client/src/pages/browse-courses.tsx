import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, BookOpen, Clock, ChevronRight, GraduationCap, ArrowLeft, Star, Users } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const courses = [
  {
    id: 1,
    title: "Fundamentals of Nursing",
    description: "Master the essential skills and knowledge every nurse needs for patient care.",
    instructor: "Dr. Sarah Johnson",
    duration: "6 Weeks",
    students: 1240,
    rating: 4.9,
    category: "Basic Skills",
    modules: [
      "Introduction to Nursing",
      "Vital Signs and Assessment",
      "Infection Control",
      "Patient Safety",
      "Basic Clinical Skills"
    ]
  },
  {
    id: 2,
    title: "Pharmacology & Medications",
    description: "Drug classification, dosage calculations, and safe administration practices.",
    instructor: "Prof. Michael Chen",
    duration: "4 Weeks",
    students: 850,
    rating: 4.8,
    category: "Clinical",
    modules: [
      "Drug Classifications",
      "Dosage Calculations",
      "Safe Administration Routes",
      "Patient Education"
    ]
  },
  {
    id: 3,
    title: "Maternal & Newborn Care",
    description: "Expert guidance on labor, delivery, prenatal care, and neonatal resuscitation.",
    instructor: "Nurse Elena Rodriguez",
    duration: "5 Weeks",
    students: 920,
    rating: 4.7,
    category: "Specialized",
    modules: [
      "Prenatal Care & Monitoring",
      "Labor and Delivery Stages",
      "Postpartum Care",
      "Neonatal Resuscitation"
    ]
  }
];

export default function BrowseCourses() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <header className="bg-background border-b h-16 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">Learning Path: Browse Courses</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-display mb-2">Nursing Modules</h2>
          <p className="text-muted-foreground text-lg italic">"Education is the most powerful weapon which you can use to change the world."</p>
        </div>

        <div className="grid gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/60">
                <div className="md:flex">
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-wider">
                        {course.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {course.rating} ({course.students} students)
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2 font-display">{course.title}</CardTitle>
                    <CardDescription className="text-base mb-4">{course.description}</CardDescription>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {course.instructor}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Course Modules:
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1">
                        {course.modules.map((module) => (
                          <div key={module} className="text-sm flex items-center gap-2 text-muted-foreground">
                            <ChevronRight className="w-3 h-3 text-primary/50" />
                            {module}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-6 md:w-1/3 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-border/40">
                    <GraduationCap className="w-16 h-16 text-primary/20 mb-4" />
                    <Button className="w-full mb-2">Enroll Now</Button>
                    <Button variant="ghost" className="w-full text-xs">View Curriculum</Button>
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
