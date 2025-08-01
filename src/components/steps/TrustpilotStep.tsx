// src/components/steps/TrustpilotStep.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Vous pouvez utiliser une librairie comme 'react-confetti'
// import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TrustpilotStepProps {
    trustpilotLink?: string;
}

export const TrustpilotStep: React.FC<TrustpilotStepProps> = ({ trustpilotLink }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // SUPPRIMEZ CETTE LIGNE : const [showConfetti, setShowConfetti] = useState(false);

    const handlePublish = () => {
        // Ici vous pouvez déclencher un effet visuel si vous ajoutez une librairie de confetti
        // Par exemple: setShowConfetti(true);

        // Ouvrir le lien après une courte animation
        setTimeout(() => {
            if (trustpilotLink) {
                window.open(trustpilotLink, '_blank');
            }
            setIsModalOpen(false); // Fermer la modale
        }, 1000); // Réduit à 1s
    }

    return (
        <div className="flex flex-col items-center justify-center text-center h-[50vh] gap-6">
            {/* showConfetti && <Confetti /> */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <h1 className="text-4xl font-bold">Boom! 💥</h1>
                <p className="text-muted-foreground mt-2">Vous y êtes presque. Publiez votre avis sur Trustpilot.</p>
            </motion.div>

            <Button size="lg" onClick={() => setIsModalOpen(true)}>Publier sur Trustpilot</Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la publication ?</DialogTitle>
                        <DialogDescription>
                            Vous allez être redirigé vers Trustpilot pour finaliser la publication de votre avis.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={handlePublish} className="w-full">Je publie sur Trustpilot</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};