import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';

const QUANTUM_INTERESTS = [
  "Quantum Computing",
  "Quantum Information Theory",
  "Quantum Cryptography",
  "Quantum Communication",
  "Quantum Machine Learning",
  "Quantum Algorithms",
  "Quantum Error Correction",
  "Quantum Simulation",
  "Quantum Chemistry",
  "Quantum Optics",
  "Quantum Metrology",
  "Quantum Sensing"
];

const REFERRAL_SOURCES = [
  "From a friend",
  "Web search",
  "Social media",
  "Academic institution",
  "Conference/Event",
  "Research paper",
  "Professional network",
  "Other"
];

interface ProfileSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (profileData: any) => void;
}

export default function ProfileSetupDialog({ open, onOpenChange, onComplete }: ProfileSetupDialogProps) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    referralSource: '',
    interests: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleReferralChange = (value: string) => {
    setProfileData(prev => ({ ...prev, referralSource: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleComplete = () => {
    onComplete(profileData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Let's set up your profile
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className="border-gray-300"
              />
            </div>
            <DialogFooter className="mt-6">
              <Button 
                onClick={handleNext}
                disabled={!profileData.firstName || !profileData.lastName}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-700">How did you hear about XREPO?</Label>
              <RadioGroup
                value={profileData.referralSource}
                onValueChange={handleReferralChange}
                className="space-y-2"
              >
                {REFERRAL_SOURCES.map((source) => (
                  <div key={source} className="flex items-center space-x-2">
                    <RadioGroupItem value={source} id={source} />
                    <Label htmlFor={source} className="text-gray-700">{source}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                onClick={handleNext}
                disabled={!profileData.referralSource}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-700">What are your quantum interests?</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {QUANTUM_INTERESTS.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox 
                      id={interest}
                      checked={profileData.interests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <Label htmlFor={interest} className="text-gray-700">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                onClick={handleComplete}
                disabled={profileData.interests.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Welcome to XREPO
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

