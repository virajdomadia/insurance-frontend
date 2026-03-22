import { useAuth as useAuthContext } from '@/lib/AuthContext';

export default function useAuth() {
    return useAuthContext();
}
