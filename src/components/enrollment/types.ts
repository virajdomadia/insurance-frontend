export interface EnrollmentFormData {
    language: string;
    name: string;
    mobile: string;
    age: string;
    state: string;
    occupation?: string;
    isEligiblePromised?: boolean; // Demo flag
}

export interface StepProps {
    onNext: () => void;
    onBack?: () => void;
    formData: EnrollmentFormData;
    updateData: (data: Partial<EnrollmentFormData>) => void;
}
